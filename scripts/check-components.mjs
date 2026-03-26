#!/usr/bin/env node
/**
 * Component completeness check.
 *
 * Every directory under src/components/<Name>/ must contain exactly these files:
 *   - <Name>.tsx          component implementation
 *   - <Name>.types.ts     props interface and type exports
 *   - <Name>.stories.tsx  Storybook stories
 *   - index.ts            re-exports
 *
 * The index.ts is also validated to confirm it:
 *   - re-exports default from './<Name>'
 *   - re-exports the named component from './<Name>'
 *   - re-exports at least one type from './<Name>.types'
 *
 * Usage:
 *   node scripts/check-components.mjs
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const COMPONENTS_DIR = join(ROOT, 'src', 'components');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isDir(p) {
  return statSync(p).isDirectory();
}

function readText(p) {
  return readFileSync(p, 'utf8');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const componentDirs = readdirSync(COMPONENTS_DIR)
  .map((entry) => ({ name: entry, path: join(COMPONENTS_DIR, entry) }))
  .filter(({ path }) => isDir(path));

let totalViolations = 0;

for (const { name, path: dir } of componentDirs) {
  const rel = relative(ROOT, dir);
  const violations = [];

  // ── Required files ──────────────────────────────────────────────────────────

  const required = [
    { file: `${name}.tsx`,        label: 'implementation' },
    { file: `${name}.types.ts`,   label: 'types' },
    { file: `${name}.stories.tsx`, label: 'stories' },
    { file: 'index.ts',            label: 'index' },
  ];

  for (const { file, label } of required) {
    if (!existsSync(join(dir, file))) {
      violations.push(`Missing ${label} file: ${file}`);
    }
  }

  // ── index.ts content validation (only if it exists) ─────────────────────────

  const indexPath = join(dir, 'index.ts');
  if (existsSync(indexPath)) {
    const indexContent = readText(indexPath);

    if (!indexContent.includes(`export { default }`) && !indexContent.includes(`export {default}`)) {
      violations.push(`index.ts is missing: export { default } from './${name}'`);
    }

    if (!indexContent.includes(`export { default as ${name}`) && !indexContent.includes(`export {default as ${name}`)) {
      violations.push(`index.ts is missing: export { default as ${name} } from './${name}'`);
    }

    if (!indexContent.includes(`.types'`) && !indexContent.includes('.types"')) {
      violations.push(`index.ts is missing a type export from './${name}.types'`);
    }
  }

  // ── Report ──────────────────────────────────────────────────────────────────

  if (violations.length > 0) {
    process.stderr.write(`\n❌  ${rel}/\n`);
    for (const v of violations) {
      process.stderr.write(`     • ${v}\n`);
    }
    totalViolations += violations.length;
  }
}

if (totalViolations > 0) {
  process.stderr.write(
    `\n✗  ${totalViolations} completeness violation(s) across ${componentDirs.length} component(s) checked.\n` +
    `   Every component must follow the 4-file structure defined in CLAUDE.md.\n\n`
  );
  process.exit(1);
} else {
  process.stdout.write(
    `✓  Component completeness check passed (${componentDirs.length} component(s) checked, 0 violations).\n`
  );
}
