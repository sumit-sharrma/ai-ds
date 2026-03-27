#!/usr/bin/env node
/**
 * Figma design audit.
 *
 * Scans every non-component page in the Figma file and reports:
 *   1. Detached component instances — FRAME nodes whose names match a known
 *      component. These are usually copy-pasted frames instead of real instances.
 *   2. Hardcoded fills — SOLID fills that are not bound to a Figma variable.
 *      Every colour must come from the token system.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=<token> node scripts/audit-figma.mjs
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — violations found (or API error)
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const FILE_KEY = 'EqXU8re4hw6XM6OrwaBbu8';
const API_BASE = 'https://api.figma.com/v1';
const TOKEN    = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN;

// ─── Known component names ────────────────────────────────────────────────────
// Names of published component sets in the Figma file.
// If a FRAME on a design page shares one of these names it is likely a detached
// copy rather than a real component instance.
const COMPONENT_NAMES = new Set([
  'button', 'icon button', 'iconbutton', 'avatar', 'header', 'list', 'listitem',
]);

// Pages that ARE the component definitions — skip them for detach checks.
const COMPONENT_PAGES = new Set([
  'button', 'icon button', 'avatar', 'header', 'list item', 'listitem', 'icons',
  'primitives', 'tokens', 'components',
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function figmaFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'X-Figma-Token': TOKEN },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Walk the node tree depth-first, calling callback for every node.
 */
function walk(node, callback) {
  callback(node);
  if (node.children) {
    for (const child of node.children) walk(child, callback);
  }
}

/**
 * Returns true if the fill has no variable binding on its colour.
 */
function isHardcodedFill(fill) {
  if (fill.type !== 'SOLID') return false;
  const bound = fill.boundVariables?.color;
  return !bound || bound.type !== 'VARIABLE_ALIAS';
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!TOKEN) {
    console.error('❌  Set FIGMA_ACCESS_TOKEN or FIGMA_TOKEN before running this script.');
    process.exit(1);
  }

  console.log(`Fetching Figma file ${FILE_KEY}…\n`);
  const data = await figmaFetch(`/files/${FILE_KEY}`);

  const detached  = [];
  const hardcoded = [];

  for (const page of data.document.children) {
    const pageLower = page.name.toLowerCase();

    // ── Detached instance check (design/screen pages only) ──────────────────
    if (!COMPONENT_PAGES.has(pageLower)) {
      walk(page, (node) => {
        if (node.type !== 'FRAME' && node.type !== 'GROUP') return;
        const nameLower = node.name.toLowerCase().trim();
        if (COMPONENT_NAMES.has(nameLower)) {
          detached.push({ page: page.name, name: node.name, id: node.id });
        }
      });
    }

    // ── Hardcoded fill check (all pages) ────────────────────────────────────
    walk(page, (node) => {
      if (!node.fills || node.fills.length === 0) return;
      // Skip purely invisible fills
      const badFills = node.fills.filter(
        (f) => f.visible !== false && isHardcodedFill(f)
      );
      if (badFills.length > 0) {
        hardcoded.push({ page: page.name, name: node.name, id: node.id, count: badFills.length });
      }
    });
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  let failed = false;

  if (detached.length > 0) {
    failed = true;
    console.log(`❌  Detached component instances (${detached.length}):\n`);
    for (const v of detached) {
      console.log(`   Page: "${v.page}"  Node: "${v.name}"  ID: ${v.id}`);
      console.log(`   ↳ This FRAME matches a known component name.`);
      console.log(`     Delete it and use figma_instantiate_component instead.\n`);
    }
  }

  if (hardcoded.length > 0) {
    failed = true;
    const shown = hardcoded.slice(0, 25);
    console.log(`❌  Hardcoded fills not bound to variables (${hardcoded.length} nodes):\n`);
    for (const v of shown) {
      console.log(`   Page: "${v.page}"  Node: "${v.name}"  ID: ${v.id}  (${v.count} fill(s))`);
      console.log(`   ↳ Bind fill to a semantic variable via boundVariables.color.\n`);
    }
    if (hardcoded.length > 25) {
      console.log(`   … and ${hardcoded.length - 25} more.\n`);
    }
  }

  if (!failed) {
    console.log('✓  Figma audit passed — no detached instances, no hardcoded fills.');
  } else {
    console.log(`\nSee AGENTS.md for remediation steps.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌  Audit error:', err.message);
  process.exit(1);
});
