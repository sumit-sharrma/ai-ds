# Design System — Claude Rules

This file is the authoritative reference for building components in this design system.
Read it in full before creating or modifying any component.

---

## Stack

- React 19 + TypeScript
- Inline styles only — no CSS modules, no Tailwind, no styled-components
- Storybook 10 with `@storybook/react-vite`
- Design tokens from `tokens.json` (W3C Design Tokens format)
- Font: Inter Variable (`@fontsource-variable/inter`) — always `fontFamily: 'inherit'` in components, set on `body` via `src/styles/global.css`

---

## Token System

All visual values come from `tokens.json`. Never hardcode colours, spacing, radii, typography, or motion values.

### Two layers

```
tokens.Primitives   — raw scale values (colours, spacing, radius, font sizes, weights)
tokens.Semantics    — semantic aliases with dark/light theme variants
```

### Reading tokens

```typescript
import tokens, { dur, ease, motion } from '../../lib/tokens';

const P = tokens.Primitives;
const S = tokens.Semantics;

// Dimension token → number (strips "px")
function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

// Semantic colour → hex string for the given theme
function sem(
  group: keyof typeof S['color'],
  key: string,
  theme: 'dark' | 'light'
): string {
  return (S.color as any)[group][key].$value[theme];
}
```

### Semantic colour groups

| Group        | Examples                                                  |
|--------------|-----------------------------------------------------------|
| `text`       | `primary`, `secondary`, `on-accent`, `link`, `error`     |
| `background` | `page`, `surface`, `surface-raised`, `accent`, `error`   |
| `border`     | `default`, `strong`, `subtle`, `focus`, `accent`         |

### Common Primitive tokens

| Token path                            | Value  |
|---------------------------------------|--------|
| `P.spacing['16'].$value`              | "16px" |
| `P.spacing['24'].$value`              | "24px" |
| `P.radius['full'].$value`             | "999px"|
| `P.Font['font-size']['14'].$value`    | "14px" |
| `P.Font['line-height']['20'].$value`  | "20px" |
| `P.Font['font-weight']['semi-bold'].$value` | 600 |

### Motion tokens

Motion tokens are accessed via the named helpers exported from `src/lib/tokens.ts`.
Never hardcode `transition`, `animation-duration`, or `cubic-bezier` values.

```typescript
import { dur, ease, motion } from '../../lib/tokens';

// Duration → milliseconds
dur('fast')    // → 100
dur('normal')  // → 200
dur('slow')    // → 300

// Easing → CSS cubic-bezier string
ease('ease-out')    // → 'cubic-bezier(0, 0, 0.2, 1)'
ease('ease-in-out') // → 'cubic-bezier(0.4, 0, 0.2, 1)'
ease('spring')      // → 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'

// Compose a full CSS transition shorthand
motion('background-color', 'normal', 'ease-in-out')
// → 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)'

motion('opacity', 'fast', 'ease-out', 50)
// → 'opacity 100ms cubic-bezier(0, 0, 0.2, 1) 50ms'
```

**Duration scale:**

| Key | Value | Use for |
|-----|-------|---------|
| `instant` | 0ms | Immediate — no animation |
| `fast` | 100ms | Button press, toggle, icon swap |
| `normal` | 200ms | Hover states, colour changes |
| `slow` | 300ms | Panel open/close, drawer, sheet |
| `slower` | 500ms | Page transitions, onboarding |

**Easing scale:**

| Key | Curve | Use for |
|-----|-------|---------|
| `linear` | `cubic-bezier(0,0,1,1)` | Progress bars, loaders |
| `ease-in` | `cubic-bezier(0.4,0,1,1)` | Elements exiting the screen |
| `ease-out` | `cubic-bezier(0,0,0.2,1)` | Elements entering the screen |
| `ease-in-out` | `cubic-bezier(0.4,0,0.2,1)` | State changes on-screen |
| `spring` | `cubic-bezier(0.175,0.885,0.32,1.275)` | Modals, badges, popovers |

**In a component:**

```typescript
const buttonStyle = useMemo<CSSProperties>(() => ({
  backgroundColor: sem('background', 'accent', theme),
  transition: motion('background-color', 'fast', 'ease-in-out'),
}), [theme]);
```

---

## Component Readiness Check

Before writing any code, verify every item below. If any item fails, stop and raise the gap with the user — do not proceed with assumptions.

### 1. Figma spec

- [ ] The Figma node is accessible via `figma_get_component_for_development`
- [ ] The component is a published **COMPONENT** or **COMPONENT_SET** (not a frame or group)
- [ ] All variants and interactive states are present in the design (default, hover, pressed, disabled, etc.)
- [ ] All visible text has a bound font-size, font-weight, and line-height variable
- [ ] All colours are bound to semantic variables (no raw hex fills)
- [ ] Spacing and radius values are bound to primitive variables

### 2. Tokens

- [ ] Every `boundVariable` ID used in the Figma node resolves to a key that exists in `tokens.json`
- [ ] No new tokens are needed — or if they are, they have been added to `tokens.json` first

### 3. Props & API

- [ ] Every Figma component property (`BOOLEAN`, `TEXT`, `VARIANT`) has a clear mapping to a React prop
- [ ] The component's props interface is unambiguous (no overlapping or conflicting props)
- [ ] Edge cases are defined: what renders when optional props are omitted?

### 4. Accessibility

- [ ] The correct semantic HTML element is identified (`button`, `a`, `li`, `input`, etc.)
- [ ] Required ARIA roles, labels, or attributes are known
- [ ] Keyboard interaction pattern is defined (Tab, Enter, Space, Escape, arrow keys as relevant)

### 5. Scope

- [ ] The component does not duplicate an existing component in `src/components/`
- [ ] Any sub-components it depends on either already exist or are in scope for this task

**If all boxes pass → proceed to implementation.**
**If any box fails → surface the blocker before writing code.**

---

## Component Rules

### Directory structure

Every component lives in its own directory:

```
src/components/ComponentName/
  ComponentName.tsx        ← component implementation
  ComponentName.types.ts   ← props interface + type exports
  ComponentName.stories.tsx← Storybook stories
  index.ts                 ← re-exports
```

### Props interface

- Extend the relevant HTML element's attributes (`React.ButtonHTMLAttributes<HTMLButtonElement>`, `React.HTMLAttributes<HTMLDivElement>`, etc.)
- Always support `theme: 'dark' | 'light'` — default `'dark'`
- Use JSDoc on every custom prop

```typescript
export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Description of what this prop does. */
  variant?: 'default' | 'other';
  /** Colour theme — match the surface the component sits on. */
  theme?: 'dark' | 'light';
}
```

### index.ts

```typescript
export { default } from './ComponentName';
export { default as ComponentName } from './ComponentName';
export type { ComponentProps } from './ComponentName.types';
```

### Styling

- All styles via inline `style` prop — no className, no CSS files
- Always `boxSizing: 'border-box'`
- Always `fontFamily: 'inherit'`
- Use `useMemo` for styles that depend on props to avoid unnecessary recalculation
- Use `React.forwardRef` on every component

### Theme-aware pattern

```typescript
const containerStyle = useMemo<CSSProperties>(() => ({
  backgroundColor: sem('background', 'surface', theme),
  color: sem('text', 'primary', theme),
  borderBottom: `1px solid ${sem('border', 'default', theme)}`,
  padding: `${dim(P.spacing['12'])}px ${dim(P.spacing['16'])}px`,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}), [theme]);
```

---

## Storybook Rules

### Story file structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react'; // always import React explicitly
import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'One-line description.' } },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark',  value: '#0D0D0D' },
        { name: 'light', value: '#F5F5F5' },
      ],
    },
  },
  argTypes: {
    theme: { control: 'select', options: ['dark', 'light'] },
    // add per-component argTypes
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;
```

- Export one story per meaningful variant/state combination
- Always include an `AllVariants` story that shows the full matrix on a dark background
- Add `parameters.docs.description.story` to stories that need explanation

### Documentation requirements

Every component's Storybook entry must include:

**Default usage** — a `Default` or `{Variant}Default` story with the most common real-world args.

**Variants and states** — one story per variant/state combination, named clearly (e.g. `PrimaryDisabled`, `SecondaryHover`).

**Accessibility notes** — add an `a11y` parameter block and a docs description calling out keyboard behaviour, ARIA usage, and contrast:

```typescript
parameters: {
  docs: {
    description: {
      story: 'Keyboard: Space/Enter activates. Focus ring uses `border.focus` token. Disabled state sets both `disabled` and `aria-disabled`.',
    },
  },
},
```

**Do/Don't guidelines** — include a dedicated `DoAndDont` story using a side-by-side layout:

```typescript
export const DoAndDont: Story = {
  name: 'Do / Don\'t',
  parameters: {
    docs: {
      description: {
        story: '**Do** use Primary for the single main action per view. **Don\'t** use multiple Primary buttons side by side.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <div>
        <p style={{ color: '#4ADE80', marginBottom: 8 }}>✓ Do</p>
        {/* correct usage */}
      </div>
      <div>
        <p style={{ color: '#F87171', marginBottom: 8 }}>✗ Don't</p>
        {/* incorrect usage */}
      </div>
    </div>
  ),
};
```

**Code example** — the `autodocs` page auto-generates one from the `Default` story args. Ensure args are realistic, not placeholder values like `"string"`.

**Design reference** — always include the Figma node URL in the meta `parameters`:

```typescript
parameters: {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=NODE_ID',
  },
},
```

---

## Accessibility (A11y)

- **Standards**: Follow **WCAG 2.1 AA** guidelines.
- **ARIA Attributes**: Add appropriate ARIA roles and labels for interactive elements.
- **Keyboard Navigation**: Ensure all interactive elements are reachable and operable via keyboard.
- **Focus Management**: Manage focus states for modals, dialogs, and other overlays.
- **Color Contrast**: Maintain a minimum contrast ratio of 4.5:1 for text and interactive elements.

### Practical checklist per component

- Interactive elements (`button`, `a`, custom roles) must have a visible focus ring using `border.focus` token
- Use semantic HTML elements where possible — prefer `<button>` over `<div onClick>`
- Non-text interactive elements must have `aria-label` or `aria-labelledby`
- Disabled state: set both `disabled` attribute and `aria-disabled={true}`
- Dynamic content changes (show/hide) should use `aria-expanded`, `aria-hidden`, or `aria-live` as appropriate
- Never remove focus outline without replacing it with a visible alternative

---

## Figma → Code Workflow

1. Use `figma_get_component_for_development` with the node ID and `codebasePath` to get the full spec
2. Resolve variable IDs to token names using `figma_get_variables` if needed
3. Map Figma layout properties to inline styles:

| Figma                        | CSS / inline style                     |
|------------------------------|----------------------------------------|
| `layoutMode: HORIZONTAL`     | `display: 'flex', flexDirection: 'row'`|
| `layoutMode: VERTICAL`       | `display: 'flex', flexDirection: 'column'`|
| `primaryAxisSizingMode: FIXED` | fixed width/height                   |
| `counterAxisSizingMode: FIXED` | fixed cross-axis dimension           |
| `layoutSizingHorizontal: FILL` | `width: '100%'` (or `flex: 1`)       |
| `layoutSizingVertical: HUG`  | no fixed height, let content size it  |
| `counterAxisAlignItems: CENTER` | `alignItems: 'center'`              |
| `paddingLeft/Right/Top/Bottom` | map to spacing tokens via `dim()`    |
| `itemSpacing`                | `gap`                                  |

4. Map Figma `boundVariables` to token lookups — prefer `sem()` for semantic tokens
5. Map Figma component properties to React props:
   - `BOOLEAN` property → `boolean` prop
   - `TEXT` property → `string` prop
   - `VARIANT` property → union type prop

---

## Versioning & Release

- **Semantic Versioning**: Follow `MAJOR.MINOR.PATCH` rules:
  - `MAJOR` — breaking changes (removed props, renamed components, incompatible API changes)
  - `MINOR` — new components or props, backwards-compatible additions
  - `PATCH` — bug fixes, visual tweaks, doc/story updates

- **Changelog**: Update `CHANGELOG.md` for every release using [Keep a Changelog](https://keepachangelog.com) format:

```markdown
## [1.2.0] - YYYY-MM-DD
### Added
- New `ListItem` component
### Changed
- `Button` now accepts `size` prop
### Deprecated
- `Button` prop `forceState` — use `data-state` instead (removed in v2)
### Removed
- (none)
### Fixed
- Secondary button border missing in light theme
### Security
- (none)
```

- **Deprecation Policy**: When deprecating a component or prop:
  1. Add a `@deprecated` JSDoc tag with a migration note
  2. Log a `console.warn` in dev (`process.env.NODE_ENV !== 'production'`) on first render
  3. Keep the deprecated API working for at least one `MAJOR` version
  4. Mark the Storybook story with a `deprecated` tag and a docs description explaining the replacement

```typescript
/**
 * @deprecated Use `NewComponent` instead. Will be removed in v2.
 */
export interface OldProps { ... }
```

```typescript
// inside the component, on mount:
if (process.env.NODE_ENV !== 'production' && deprecatedProp !== undefined) {
  console.warn('[DS] OldComponent: `deprecatedProp` is deprecated. Use `newProp` instead.');
}
```

---

## What Not To Do

- Never hardcode hex colours, pixel values, or font sizes
- Never use CSS files or className for component styles
- Never skip theme support
- Never create a component without a stories file
- Never use `any` except inside token accessor casts (the `sem()` helper)
- Never import from `@storybook/react-vite` in stories — use `@storybook/react`
