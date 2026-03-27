#!/usr/bin/env node
/**
 * Token integrity check.
 *
 * Scans every component implementation file (*.tsx, excluding *.stories.tsx
 * and *.test.tsx) and fails if any hardcoded design values are found.
 *
 * Rules enforced:
 *   1. No hardcoded hex colour strings  — use sem() instead
 *   2. No hardcoded rgba() / rgb() calls — use sem() instead
 *   3. No raw numeric font-size in style objects — use dim(P.Font['font-size'][...])
 *
 * Usage:
 *   node scripts/check-tokens.mjs
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const COMPONENTS_DIR = join(ROOT, 'src', 'components');

// ─── Rules ────────────────────────────────────────────────────────────────────

const RULES = [
  {
    id: 'no-hex-color',
    name: 'Hardcoded hex colour',
    description: "Use sem('text'|'background'|'border', key, theme) instead.",
    // Matches any hex string literal used as a value: '#fff', '#0D0D0D', etc.
    // Uses word boundary so CSS hex in comments like #0D0D0D docs don't match falsely —
    // but we also strip comment lines, so this is belt-and-suspenders.
    pattern: /#[0-9a-fA-F]{3,8}\b/,
  },
  {
    id: 'no-rgba',
    name: 'Hardcoded rgba() / rgb()',
    description: "Use sem() token accessor — tokens already carry the correct colour value.",
    pattern: /\brgba?\s*\(/,
  },
  {
    id: 'no-raw-font-size',
    name: 'Hardcoded fontSize in style prop',
    description: "Use dim(P.Font['font-size'][...]) or a SIZE_CONFIG constant keyed to tokens.",
    // Matches: fontSize: 14  or  fontSize: "14px"  but NOT fontSize: dim(...)
    // We only flag assignments where the value is a bare number or quoted px string.
    pattern: /fontSize\s*:\s*(?:\d+|['"`]\d+px['"`])/,
  },
];

// Lines or files to skip
const LINE_EXCLUDES = [
  /^\s*\/\//, // single-line comments
  /^\s*\*/, // JSDoc / block comment lines
];

// ─── File walker ──────────────────────────────────────────────────────────────

function collectFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (
      (entry.endsWith('.tsx') || entry.endsWith('.ts')) &&
      !entry.endsWith('.stories.tsx') &&
      !entry.endsWith('.stories.ts') &&
      !entry.endsWith('.test.tsx') &&
      !entry.endsWith('.test.ts') &&
      !entry.endsWith('.types.ts') && // type-only files have no runtime values
      !entry.endsWith('.figma.tsx') // Code Connect files are not component implementations
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let totalViolations = 0;
const files = collectFiles(COMPONENTS_DIR);

for (const filePath of files) {
  const rel = relative(ROOT, filePath);
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const fileViolations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comment lines
    if (LINE_EXCLUDES.some((re) => re.test(line))) continue;

    for (const rule of RULES) {
      if (rule.pattern.test(line)) {
        fileViolations.push({ lineNo: i + 1, rule, text: line.trim() });
      }
    }
  }

  if (fileViolations.length > 0) {
    process.stderr.write(`\n❌  ${rel}\n`);
    for (const { lineNo, rule, text } of fileViolations) {
      process.stderr.write(`     ${String(lineNo).padStart(4, ' ')} │ [${rule.id}] ${text}\n`);
      process.stderr.write(`          ↳ ${rule.description}\n`);
    }
    totalViolations += fileViolations.length;
  }
}

if (totalViolations > 0) {
  process.stderr.write(
    `\n✗  ${totalViolations} token violation(s) found across ${files.length} file(s) checked.\n` +
    `   See CLAUDE.md → "Token System" for the sem() and dim() usage guide.\n\n`
  );
  process.exit(1);
} else {
  process.stdout.write(
    `✓  Token integrity check passed (${files.length} file(s) scanned, 0 violations).\n`
  );
}
