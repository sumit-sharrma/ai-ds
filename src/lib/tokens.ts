/**
 * Token adapter.
 *
 * tokens.json is exported from Figma in Tokens Studio format, which uses
 * separate collections per theme ('Primitives/Value', 'Semantics/Dark',
 * 'Semantics/Light') and alias references like '{color.grey.900}'.
 *
 * This module resolves aliases and reconstructs the flat { Primitives, Semantics }
 * shape that all components rely on, so no component code needs to change.
 */

import rawTokens from '../../tokens.json';

const raw     = rawTokens as unknown as Record<string, any>;
const P_raw   = raw['Primitives/Value'] as Record<string, any>;
const S_dark  = raw['Semantics/Dark']   as Record<string, any>;
const S_light = raw['Semantics/Light']  as Record<string, any>;

// ─── Alias resolver ───────────────────────────────────────────────────────────

/**
 * Resolve a Tokens Studio alias reference (e.g. '{color.grey.900}') to a
 * concrete value by walking the Primitives tree.
 * Returns the input unchanged if it is already a concrete value.
 */
function resolve(value: string): string {
  if (typeof value !== 'string' || !value.startsWith('{')) return value;
  const path = value.slice(1, -1).split('.');
  let node: any = P_raw;
  for (const key of path) {
    node = node?.[key];
    if (node == null) return value; // unresolvable alias — return as-is
  }
  return typeof node.$value === 'string' ? node.$value : value;
}

// ─── Semantics builder ────────────────────────────────────────────────────────

/**
 * Merge dark and light semantic collections into the combined shape:
 *   Semantics.color[group][key].$value = { dark: '#...', light: '#...' }
 */
function buildSemantics(dark: Record<string, any>, light: Record<string, any>) {
  const result: Record<string, any> = { color: {} };

  for (const group of Object.keys(dark?.color ?? {})) {
    result.color[group] = {};
    const darkGroup  = dark.color[group]  ?? {};
    const lightGroup = light?.color?.[group] ?? {};

    for (const key of Object.keys(darkGroup)) {
      if (key === '$extensions' || key === '$type' || key === '$description') continue;
      result.color[group][key] = {
        $value: {
          dark:  resolve(darkGroup[key]?.$value  ?? ''),
          light: resolve(lightGroup[key]?.$value ?? darkGroup[key]?.$value ?? ''),
        },
        $type: 'color',
      };
    }
  }

  return result;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const Primitives = P_raw;
export const Semantics  = buildSemantics(S_dark, S_light);

const tokens = { Primitives, Semantics };
export default tokens;
