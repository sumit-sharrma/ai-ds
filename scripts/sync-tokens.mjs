#!/usr/bin/env node
/**
 * Figma → tokens.json sync script.
 *
 * Fetches all variables from the Figma file via the REST API and writes
 * them to tokens.json in W3C Design Tokens format, matching the structure
 * already used by the codebase (Primitives + Semantics collections).
 *
 * Required environment variables:
 *   FIGMA_TOKEN    — personal access token or OAuth token with file:read scope
 *   FIGMA_FILE_KEY — the file key (e.g. EqXU8re4hw6XM6OrwaBbu8)
 *
 * Usage:
 *   node scripts/sync-tokens.mjs
 *
 * Exit codes:
 *   0 — tokens written (or already up to date)
 *   1 — error (missing env vars, API failure, etc.)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const TOKENS_PATH = join(ROOT, 'tokens.json');

// ─── Env ──────────────────────────────────────────────────────────────────────

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY ?? 'EqXU8re4hw6XM6OrwaBbu8';

if (!FIGMA_TOKEN) {
  process.stderr.write('✗  FIGMA_TOKEN environment variable is required.\n');
  process.exit(1);
}

// ─── Figma API ────────────────────────────────────────────────────────────────

async function fetchFigmaVariables() {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API error ${res.status}: ${body}`);
  }

  const { meta } = await res.json();
  return meta; // { variables, variableCollections }
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

function rgbaToHex({ r, g, b, a = 1 }) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? `${hex}${toHex(a)}` : hex;
}

// ─── Value resolver ───────────────────────────────────────────────────────────

/**
 * Resolve a Figma variable value to a plain JS value.
 * VARIABLE_ALIAS values are resolved recursively against the variables map.
 */
function resolveValue(raw, variables, resolvedType) {
  if (raw?.type === 'VARIABLE_ALIAS') {
    const aliased = variables[raw.id];
    if (!aliased) return null;
    // Aliases in Primitives have only one mode; take its first value
    const modeValues = Object.values(aliased.valuesByMode);
    return resolveValue(modeValues[0], variables, aliased.resolvedType);
  }

  if (resolvedType === 'COLOR') return rgbaToHex(raw);
  if (resolvedType === 'FLOAT') return `${raw}px`;
  return raw; // STRING, BOOLEAN
}

// ─── Path builder ─────────────────────────────────────────────────────────────

/**
 * Set a deeply nested key in `obj` from a slash-separated path string.
 * e.g. setPath(obj, 'color/grey/50', leaf) → obj.color.grey['50'] = leaf
 */
function setPath(obj, path, value) {
  const parts = path.split('/');
  let cursor = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    cursor[key] ??= {};
    cursor = cursor[key];
  }
  cursor[parts[parts.length - 1]] = value;
}

// ─── Transform ────────────────────────────────────────────────────────────────

function buildTokens(meta) {
  const { variables, variableCollections } = meta;

  // Map collectionId → { name, modes: { modeId → modeName } }
  const collections = {};
  for (const col of Object.values(variableCollections)) {
    collections[col.id] = {
      name: col.name,
      modes: Object.fromEntries(col.modes.map((m) => [m.modeId, m.name])),
    };
  }

  // Output structure
  const output = {
    $schema: 'https://tr.designtokens.org/format/',
    $metadata: {
      source: `Figma – Project (${FIGMA_FILE_KEY})`,
      collections: Object.values(collections).map((c) => c.name),
      exportedAt: new Date().toISOString().slice(0, 10),
      generator: 'scripts/sync-tokens.mjs',
    },
  };

  for (const variable of Object.values(variables)) {
    const col = collections[variable.variableCollectionId];
    if (!col) continue;

    const colRoot = (output[col.name] ??= {});
    const modeEntries = Object.entries(variable.valuesByMode);
    const isMultiMode = modeEntries.length > 1;

    let leaf;

    if (isMultiMode) {
      // Semantics: build { dark: '#...', light: '#...' }
      const themeValue = {};
      for (const [modeId, raw] of modeEntries) {
        const modeName = col.modes[modeId]?.toLowerCase() ?? modeId;
        themeValue[modeName] = resolveValue(raw, variables, variable.resolvedType);
      }
      leaf = { $value: themeValue, $type: figmaTypeToW3C(variable.resolvedType) };
    } else {
      // Primitives: single value
      const raw = modeEntries[0]?.[1];
      leaf = {
        $value: resolveValue(raw, variables, variable.resolvedType),
        $type: figmaTypeToW3C(variable.resolvedType),
      };
    }

    setPath(colRoot, variable.name, leaf);
  }

  return output;
}

function figmaTypeToW3C(type) {
  switch (type) {
    case 'COLOR': return 'color';
    case 'FLOAT': return 'dimension';
    case 'STRING': return 'string';
    case 'BOOLEAN': return 'boolean';
    default: return type.toLowerCase();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const meta = await fetchFigmaVariables();
const newTokens = buildTokens(meta);
const newContent = JSON.stringify(newTokens, null, 2) + '\n';

// Compare with existing file
let changed = true;
try {
  const existing = readFileSync(TOKENS_PATH, 'utf8');
  // Ignore exportedAt date when diffing — only content matters
  const normalize = (s) => s.replace(/"exportedAt":\s*"[^"]+"/g, '"exportedAt": "NORMALIZED"');
  changed = normalize(existing) !== normalize(newContent);
} catch {
  // File doesn't exist yet
}

if (!changed) {
  process.stdout.write('✓  tokens.json is already up to date.\n');
  process.exit(0);
}

writeFileSync(TOKENS_PATH, newContent, 'utf8');
process.stdout.write('✓  tokens.json updated from Figma variables.\n');

// Signal to the workflow that the file changed (used in the git diff step)
process.exit(0);
