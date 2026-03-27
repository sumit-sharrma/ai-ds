# Contributing to ai-ds

Thank you for contributing to the Agentic Design System. This document covers everything you need to know to contribute effectively — from setting up your environment to getting your changes merged.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Adding a New Component](#adding-a-new-component)
- [Modifying Tokens](#modifying-tokens)
- [Testing and Checks](#testing-and-checks)
- [Storybook Standards](#storybook-standards)
- [Accessibility Requirements](#accessibility-requirements)
- [Versioning and Changelog](#versioning-and-changelog)
- [Required Secrets (maintainers only)](#required-secrets-maintainers-only)

---

## Code of Conduct

Be respectful, constructive, and inclusive in all interactions. We follow the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## Ways to Contribute

| Type | Description |
|------|-------------|
| Bug report | Open a GitHub Issue describing the problem, steps to reproduce, and expected behaviour |
| Feature request | Open a GitHub Issue with a proposal before writing any code |
| New component | Follow the [Adding a New Component](#adding-a-new-component) guide |
| Token update | Follow the [Modifying Tokens](#modifying-tokens) guide |
| Documentation | Fix typos, improve examples, add missing details |
| Story improvement | Add missing stories, improve `AllVariants`, add `Do / Don't` |

---

## Getting Started

### Prerequisites

| Tool | Minimum version | Check |
|------|----------------|-------|
| Node.js | 20.x | `node -v` |
| npm | 10.x | `npm -v` |
| Git | any | `git --version` |

### Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/ai-ds.git
cd ai-ds

# 2. Add the upstream remote
git remote add upstream https://github.com/sumit-sharrma/ai-ds.git

# 3. Install dependencies
npm install

# 4. Start Storybook to verify everything works
npm run storybook
```

Storybook opens at **http://localhost:6006**.

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Protected — merge via PR only. |
| `staging` | Integration branch. All PRs target `staging` first. |
| `tokens` | Token-only updates from the automated Figma sync. |

**For contributors:**

1. Always branch from `staging`:
   ```bash
   git fetch upstream
   git checkout -b feat/my-feature upstream/staging
   ```
2. Open your PR against `staging`, not `main`.
3. `staging` → `main` is handled by maintainers after QA.

### Branch naming

| Type | Pattern | Example |
|------|---------|---------|
| New component | `feat/<component-name>` | `feat/badge` |
| Bug fix | `fix/<short-description>` | `fix/button-focus-ring` |
| Token update | `tokens/<description>` | `tokens/add-motion` |
| Documentation | `docs/<description>` | `docs/update-readme` |
| Refactor | `refactor/<description>` | `refactor/avatar-size-config` |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
```

| Type | When to use |
|------|-------------|
| `feat` | New component or prop |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change that is neither a fix nor a feature |
| `test` | Adding or updating stories/tests |
| `chore` | Build scripts, CI config, token updates |

**Examples:**

```
feat(Badge): add new Badge component with status variants
fix(Button): restore focus ring in light theme
chore(tokens): sync Figma variables — spacing scale updated
docs(README): add Required Secrets table
```

---

## Pull Request Process

1. **Run all checks locally** before pushing:
   ```bash
   npm run lint
   ```
   This runs both the token integrity check and the component completeness check.

2. **Push your branch** and open a PR against `staging`:
   ```bash
   git push origin feat/my-feature
   ```

3. **Fill in the PR template** — describe what changed and why, and link any related issues.

4. **Wait for CI** — three checks run automatically:
   - Token Integrity Check — no hardcoded values
   - Component Completeness Check — 4-file structure
   - Chromatic — visual regression review

5. **Address Chromatic diffs** — if Chromatic flags visual changes, a maintainer or designer reviews and approves them in the Chromatic UI before the PR can merge.

6. **Request a review** — tag at least one maintainer. PRs require one approval to merge.

7. **Squash and merge** is the preferred merge strategy.

---

## Adding a New Component

> Read this section in full before writing any code. The CI will fail if any step is skipped.

### 0. Determine the hierarchy level

Before writing any code, check [`COMPONENT_HIERARCHY.md`](./COMPONENT_HIERARCHY.md) to:
- Confirm the component doesn't already exist
- Determine whether it's an **Atom**, **Molecule**, **Organism**, or **Template**
- Identify which existing components it should compose (not recreate)

### 1. Pre-flight checklist

Before writing any code, confirm all of the following:

- [ ] The Figma node is a published **COMPONENT** or **COMPONENT_SET** (not a group or frame)
- [ ] All variants and interactive states are present in Figma (default, hover, disabled, etc.)
- [ ] All colours are bound to semantic variables — no raw hex fills in the spec
- [ ] All spacing, radius, and typography values are bound to primitive variables
- [ ] The component does not duplicate an existing one in `src/components/`
- [ ] Every bound variable ID resolves to a key that exists in `tokens.json`

If any box fails, raise the gap before writing code.

### 1. Create the directory and required files

```
src/components/MyComponent/
  MyComponent.tsx          ← component implementation (required)
  MyComponent.types.ts     ← props interface (required)
  MyComponent.stories.tsx  ← Storybook stories (required)
  MyComponent.figma.tsx    ← Figma Code Connect (required)
  index.ts                 ← re-exports (required)
```

### 2. Props interface (`MyComponent.types.ts`)

```typescript
import React from 'react';

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Description of what this prop does. */
  variant?: 'default' | 'other';
  /** Colour theme — match the surface the component sits on. */
  theme?: 'dark' | 'light';
}
```

- Extend the relevant HTML element's attributes
- Always support `theme: 'dark' | 'light'` (default `'dark'`)
- Add JSDoc to every custom prop

### 3. Component implementation (`MyComponent.tsx`)

```typescript
import React, { CSSProperties, useMemo } from 'react';
import tokens from '../../lib/tokens';
import type { MyComponentProps } from './MyComponent.types';

const P = tokens.Primitives;
const S = tokens.Semantics;

function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

function sem(group: string, key: string, theme: 'dark' | 'light'): string {
  return (S.color as any)[group][key].$value[theme];
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ theme = 'dark', style, ...rest }, ref) => {
    const containerStyle = useMemo<CSSProperties>(() => ({
      backgroundColor: sem('background', 'surface', theme),
      color: sem('text', 'primary', theme),
      padding: `${dim(P.spacing['16'])}px`,
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    }), [theme]);

    return (
      <div ref={ref} style={{ ...containerStyle, ...style }} {...rest} />
    );
  }
);

MyComponent.displayName = 'MyComponent';
export default MyComponent;
```

**Rules:**
- `React.forwardRef` on every component
- `useMemo` for style objects that depend on props
- Always `boxSizing: 'border-box'` and `fontFamily: 'inherit'`
- Never hardcode hex colours, pixel values, or font sizes — always use `sem()` or `dim()`
- Never use className, CSS files, or CSS modules

### 4. `index.ts` (exact shape required)

```typescript
export { default } from './MyComponent';
export { default as MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent.types';
```

The component completeness check validates these exports exactly.

### 5. Stories (`MyComponent.stories.tsx`)

See [Storybook Standards](#storybook-standards) below for the required story set.

### 6. Run checks before pushing

```bash
npm run lint
```

Both checks must pass with zero violations before opening a PR.

---

## Modifying Tokens

Tokens flow from Figma into `tokens.json` via an automated hourly sync. **Do not edit `tokens.json` manually** for design values — changes will be overwritten on the next sync.

| Scenario | What to do |
|----------|-----------|
| Update a colour, spacing, or typography value | Update the variable in Figma — the sync will pick it up within an hour, or trigger manually via `workflow_dispatch` on the `Token Sync` workflow |
| Add a new token category | Discuss with a maintainer first — new categories may require updates to `src/lib/tokens.ts` |
| Fix a broken alias reference | Update the Figma variable binding, not the JSON directly |
| Local testing of a token change | Run `FIGMA_TOKEN=<your_token> npm run sync:tokens` to pull the latest immediately |

The `src/lib/tokens.ts` adapter resolves Tokens Studio alias references and merges dark/light semantics. If the token structure changes significantly, this file may need updating alongside any token changes.

---

## Testing and Checks

### Token integrity check

Scans all component implementation files and fails on:

| Rule | Violation example |
|------|------------------|
| Hardcoded hex colour | `color: '#fff'` |
| Raw rgba/rgb call | `backgroundColor: rgba(0,0,0,0.5)` |
| Hardcoded fontSize | `fontSize: 14` or `fontSize: '14px'` |

```bash
npm run lint:tokens
```

### Component completeness check

Validates every component directory for:
- All four required files present
- `index.ts` has `export { default }`
- `index.ts` has `export { default as <Name> }`
- `index.ts` exports at least one type from `.types`

```bash
npm run lint:components
```

### Run both

```bash
npm run lint
```

### Visual regression (Chromatic)

Chromatic runs automatically on every PR. If your change intentionally alters the visual appearance of a component, the Chromatic diff must be reviewed and approved by a maintainer or designer in the Chromatic UI before the PR can merge.

To run Chromatic locally:

```bash
CHROMATIC_PROJECT_TOKEN=<your_token> npm run chromatic
```

---

## Storybook Standards

Every component must include the following stories:

| Story | Purpose |
|-------|---------|
| `Default` | Most common real-world usage with realistic args |
| One story per variant/state | e.g. `PrimaryDisabled`, `SecondaryLoading`, `GhostSmall` |
| `AllVariants` | Full matrix on a dark background — all variants × sizes |
| `DoAndDont` | Side-by-side correct vs. incorrect usage with colour-coded labels |

**Required meta fields:**

```typescript
const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
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
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=NODE_ID',
    },
  },
  argTypes: {
    theme: { control: 'select', options: ['dark', 'light'] },
  },
};
```

- Always import `React` explicitly in story files
- Never import from `@storybook/react-vite` — use `@storybook/react`
- Ensure `Default` story args are realistic, not placeholder values like `"string"`

---

## Accessibility Requirements

All components must meet **WCAG 2.1 AA**. Before submitting a PR:

- Interactive elements (`button`, `a`, custom roles) have a visible focus ring using the `border.focus` token
- Non-text interactive elements have `aria-label` or `aria-labelledby`
- Disabled state sets both the `disabled` attribute and `aria-disabled={true}`
- Semantic HTML is used where possible (`<button>` over `<div onClick>`)
- The a11y panel in Storybook shows zero errors for all stories

---

## Figma Code Connect

Every component has a `<Name>.figma.tsx` file that links the Figma component to its React implementation. This makes real code snippets appear in Figma's Dev Mode when designers inspect components.

### File structure

```tsx
import figma from '@figma/code-connect';
import React from 'react';
import { MyComponent } from '.';

figma.connect(
  MyComponent,
  'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=NODE-ID',
  {
    props: {
      // Map Figma variant axes → React props
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
      }),
      // Map Figma text properties → React string props
      label: figma.string('Text-label'),
      // Map Figma boolean properties → React boolean props
      showBorder: figma.boolean('Show-border'),
    },
    example: ({ variant, label, showBorder }) => (
      <MyComponent variant={variant} showBorder={showBorder}>
        {label}
      </MyComponent>
    ),
  }
);
```

### Mapping helpers

| Helper | Figma property type | Example |
|--------|-------------------|---------|
| `figma.enum('Axis', mapping)` | Variant axis or enum | Maps `Primary` → `'primary'` |
| `figma.string('PropName')` | Text (`TEXT`) | Maps text content to a string prop |
| `figma.boolean('PropName')` | Toggle (`BOOLEAN`) | Maps toggle to a boolean prop |
| `figma.instance('PropName')` | Component swap | Maps a swappable slot |

Property names come from Figma's `componentPropertyDefinitions`. Strip the `#ID` suffix — e.g. `Text-label#20:1` becomes `figma.string('Text-label')`.

### Publishing locally

```bash
FIGMA_ACCESS_TOKEN=your_token npm run code-connect:publish
```

Get your token from **Figma → Settings → Security → Personal access tokens** — enable both **file:read** and **Code Connect Write** scopes.

### CI auto-publish

Code Connect is published automatically to Figma on every push to `main` that changes a `.figma.tsx` or `figma.config.json` file via `.github/workflows/code-connect.yml`. Requires the `FIGMA_ACCESS_TOKEN` repository secret.

---

## Versioning and Changelog

This project follows [Semantic Versioning](https://semver.org/):

| Change type | Version bump |
|-------------|-------------|
| Breaking change (removed/renamed prop, incompatible API) | Major (`1.0.0` → `2.0.0`) |
| New component or prop, backwards-compatible | Minor (`1.0.0` → `1.1.0`) |
| Bug fix, visual tweak, docs/story update | Patch (`1.0.0` → `1.0.1`) |

**When to update `CHANGELOG.md`:**

Update `CHANGELOG.md` in the same PR as your change, under the appropriate section (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`). Do not create a separate PR just for the changelog.

**Deprecating a prop or component:**

1. Add `@deprecated` JSDoc with a migration note
2. Log a `console.warn` in dev on first render
3. Keep the deprecated API working for at least one major version
4. Mark the Storybook story with a `deprecated` tag

---

## Required Secrets (maintainers only)

Maintainers must configure these secrets in **GitHub → Settings → Secrets and variables → Actions** for CI/CD to work:

| Secret | Workflow | How to obtain |
|--------|----------|--------------|
| `CHROMATIC_PROJECT_TOKEN` | `chromatic.yml` | [chromatic.com](https://www.chromatic.com) → your project → Manage → Project Token |
| `FIGMA_TOKEN` | `token-sync.yml` | Figma → Settings → Security → Personal access tokens (enable **file:read** scope) |
| `GH_PAT` | `token-sync.yml` | GitHub → Settings → Developer settings → Personal access tokens (enable **repo** + **workflow** scopes) |

---

## Questions?

Open a [GitHub Issue](https://github.com/sumit-sharrma/ai-ds/issues) or start a [GitHub Discussion](https://github.com/sumit-sharrma/ai-ds/discussions).
