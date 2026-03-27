# ai-ds — Agentic Design System

A React component library built with an AI-assisted workflow. Design tokens flow from Figma → `tokens.json` → React components → Storybook, with automated CI/CD checks enforcing consistency at every step.

> **Assessment submission** — Design System Expert brief. See [assessment coverage](#assessment-coverage) for a full deliverables breakdown.

## Quick Links

| | Link |
|---|---|
| **Storybook (live)** | [View on Chromatic →](https://www.chromatic.com/library?appId=REPLACE_WITH_CHROMATIC_APP_ID) |
| **Figma file** | [Open in Figma →](https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project) |
| **GitHub repo** | [github.com/sumit-sharrma/ai-ds](https://github.com/sumit-sharrma/ai-ds) |
| **Component hierarchy** | [COMPONENT_HIERARCHY.md](./COMPONENT_HIERARCHY.md) |
| **Contribution guide** | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |

---

## Table of Contents

- [Assessment Coverage](#assessment-coverage)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Token System](#token-system)
- [Components](#components)
- [Running Storybook](#running-storybook)
- [Automated Checks](#automated-checks)
- [CI/CD Pipelines](#cicd-pipelines)
- [Adding a New Component](#adding-a-new-component)
- [Required Secrets](#required-secrets)

---

## Assessment Coverage

| Deliverable | Status | Where |
|---|---|---|
| Design tokens — colours, typography, spacing, motion | ✅ | `tokens.json` |
| Component hierarchy — Atoms, Molecules, Templates | ✅ | `COMPONENT_HIERARCHY.md` |
| AI-readable rules and naming conventions | ✅ | `CLAUDE.md`, `AGENTS.md` |
| 5 components with props, stories, Code Connect | ✅ | `src/components/` |
| Edit Profile template (reference design) | ✅ | `src/templates/EditProfile/` |
| Figma ↔ GitHub token sync (bi-directional) | ✅ | `token-sync.yml` + `code-connect.yml` |
| AI → Figma guard (no duplicates, no hardcoded values) | ✅ | `AGENTS.md` + `figma-audit.yml` |
| Storybook with a11y, visual regression (Chromatic) | ✅ | `.storybook/`, `chromatic.yml` |
| Governance — versioning, contribution model, docs | ✅ | `CHANGELOG.md`, `CONTRIBUTING.md` |
| CI/CD — 6 automated GitHub Actions workflows | ✅ | `.github/workflows/` |

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Minimum version | Check |
|---|---|---|
| Node.js | 20.x | `node -v` |
| npm | 10.x | `npm -v` |
| Git | any | `git --version` |

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/sumit-sharrma/ai-ds.git
cd ai-ds

# 2. Install dependencies
npm install

# 3. Start Storybook
npm run storybook
```

Storybook opens at **http://localhost:6006**

---

## Project Structure

```
ai-ds/
├── .github/
│   └── workflows/
│       ├── token-check.yml       # Fails if hardcoded values found in components
│       ├── component-check.yml   # Fails if a component is missing required files
│       ├── chromatic.yml         # Publishes Storybook + visual regression tests
│       └── token-sync.yml        # Hourly Figma → tokens.json sync
├── scripts/
│   ├── check-tokens.mjs          # Token integrity check (run locally)
│   ├── check-components.mjs      # Component completeness check (run locally)
│   └── sync-tokens.mjs           # Fetch variables from Figma API
├── src/
│   ├── components/
│   │   ├── Avatar/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Avatar.types.ts
│   │   │   ├── Avatar.stories.tsx
│   │   │   ├── Avatar.figma.tsx      # Figma Code Connect
│   │   │   └── index.ts
│   │   ├── Button/          # same 5-file structure
│   │   ├── Header/
│   │   ├── IconButton/
│   │   └── ListItem/
│   ├── lib/
│   │   └── tokens.ts             # Token adapter (resolves Figma export format)
│   └── styles/
│       └── global.css            # Inter Variable font + box-sizing reset
├── .storybook/
│   ├── main.ts                   # Storybook config + addons
│   └── preview.ts                # Global parameters and a11y config
├── tokens.json                   # Design tokens (Tokens Studio format, exported from Figma)
├── figma.config.json             # Figma Code Connect configuration
├── CLAUDE.md                     # AI coding rules for this project
├── CONTRIBUTING.md               # Contributor guide
├── CHANGELOG.md                  # Version history
├── COMPONENT_HIERARCHY.md        # Atom / Molecule / Organism / Template classification
└── package.json
```

---

## Token System

All design values come from `tokens.json`. **Never hardcode colours, spacing, or font sizes** — always use the token accessors defined in `src/lib/tokens.ts`.

### How tokens are structured

`tokens.json` is exported from Figma in Tokens Studio format with three collections:

| Collection | Purpose |
|---|---|
| `Primitives/Value` | Raw scale — colour palette, spacing, radii, typography |
| `Semantics/Dark` | Semantic aliases for the dark theme |
| `Semantics/Light` | Semantic aliases for the light theme |

`src/lib/tokens.ts` adapts this into the shape all components use — resolving alias references like `{color.grey.900}` to real hex values and merging dark/light into a combined object.

### Using tokens in a component

```typescript
import tokens from '../../lib/tokens';

const P = tokens.Primitives; // raw scale
const S = tokens.Semantics;  // combined dark/light semantic aliases

// Dimension token → number (strips "px")
function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

// Semantic colour → hex string for the given theme
function sem(group: string, key: string, theme: 'dark' | 'light'): string {
  return (S.color as any)[group][key].$value[theme];
}
```

### Common token examples

```typescript
// Spacing
dim(P.spacing['16'])  // → 16
dim(P.spacing['24'])  // → 24

// Radius
dim(P.radius['full']) // → 999

// Typography
dim(P.Font['font-size']['14'])    // → 14
dim(P.Font['line-height']['20'])  // → 20

// Semantic colours
sem('background', 'surface', 'dark')  // → '#1c1c1c'
sem('background', 'surface', 'light') // → '#ffffff'
sem('text', 'primary', 'dark')        // → '#ffffff'
sem('border', 'default', 'dark')      // → '#2a2a2a'
sem('icon', 'subtle', 'dark')         // → '#888888'
```

---

## Components

Every component lives in `src/components/<Name>/` and must follow a strict 4-file structure:

| File | Purpose |
|---|---|
| `<Name>.tsx` | Component implementation |
| `<Name>.types.ts` | Props interface and exported types |
| `<Name>.stories.tsx` | Storybook stories |
| `index.ts` | Re-exports for consumers |

### Available components

| Component | Variants / Sizes | Notes |
|---|---|---|
| `Avatar` | Sizes: `xl`, `lg` — Content: `photo`, `initials`, `empty` | Optional camera badge (`showBadge`). Badge not available on `initials`. |
| `Button` | Variants: `primary`, `secondary`, `ghost` — Sizes: `sm`, `md`, `lg` | Supports `disabled` state and `loading` state. |
| `Header` | — | Full-width app header with title, optional back button and action slot. |
| `IconButton` | Variants: `primary`, `secondary`, `ghost` — Sizes: `xs`, `sm`, `md`, `lg` | `aria-label` is required. |
| `ListItem` | — | Settings-style row with label, value, optional chevron. |

All components:
- Support `theme: 'dark' | 'light'` (default `'dark'`)
- Use `React.forwardRef`
- Accept all native HTML attributes via props spread

---

## Running Storybook

```bash
# Start dev server with hot reload
npm run storybook

# Build a static version (outputs to storybook-static/)
npm run build-storybook
```

Storybook runs at **http://localhost:6006** and includes:

- **Controls** — live-edit any prop directly in the browser
- **Docs** — auto-generated API documentation from JSDoc comments
- **Accessibility** — a11y panel shows WCAG 2.1 AA violations per story

---

## Automated Checks

Run these locally before pushing to catch issues before CI does.

### 1. Token integrity check

Scans all component implementation files (excludes `*.stories.tsx`) and fails if any hardcoded design values are found.

```bash
npm run lint:tokens
```

**Catches:**
| Rule | Example violation |
|---|---|
| Hardcoded hex colour | `color: '#fff'` |
| Raw rgba/rgb call | `backgroundColor: rgba(0,0,0,0.5)` |
| Hardcoded fontSize | `fontSize: 14` or `fontSize: '14px'` |

**Expected output:**
```
✓  Token integrity check passed (10 file(s) scanned, 0 violations).
```

**If it fails:**
```
❌  src/components/Button/Button.tsx
       42 │ [no-hex-color] backgroundColor: '#1C1C1C',
          ↳ Use sem('text'|'background'|'border', key, theme) instead.
```

---

### 2. Component completeness check

Validates that every directory under `src/components/` has all four required files and that `index.ts` exports are correct.

```bash
npm run lint:components
```

**Checks per component:**
- `<Name>.tsx` exists
- `<Name>.types.ts` exists
- `<Name>.stories.tsx` exists
- `index.ts` exists
- `index.ts` has `export { default }`
- `index.ts` has `export { default as <Name> }`
- `index.ts` exports at least one type from `.types`

**Expected output:**
```
✓  Component completeness check passed (5 component(s) checked, 0 violations).
```

---

### 3. Run both checks together

```bash
npm run lint
```

---

### 4. Manual token sync

Fetch the latest variables from Figma and update `tokens.json` locally.

```bash
FIGMA_TOKEN=your_figma_personal_access_token npm run sync:tokens
```

Get your Figma token from: **Figma → Settings → Security → Personal access tokens** (file:read scope).

---

### 5. Chromatic (visual regression)

Publish Storybook to Chromatic and run visual regression tests locally.

```bash
CHROMATIC_PROJECT_TOKEN=your_token npm run chromatic
```

---

## CI/CD Pipelines

Six GitHub Actions workflows run automatically. All workflows target the `main`, `staging`, and `tokens` branches.

### 1. Token Integrity Check

**File:** `.github/workflows/token-check.yml`
**Triggers:** Push or PR when `src/components/**` or `tokens.json` changes
**Command:** `node scripts/check-tokens.mjs`
**Fails when:** Any component file contains a hardcoded colour, rgba call, or fontSize number

---

### 2. Component Completeness Check

**File:** `.github/workflows/component-check.yml`
**Triggers:** Push or PR when `src/components/**` changes
**Command:** `node scripts/check-components.mjs`
**Fails when:** Any component directory is missing a required file or has incomplete `index.ts` exports

---

### 3. Chromatic

**File:** `.github/workflows/chromatic.yml`
**Triggers:** Every push and PR
**What it does:**
- Builds Storybook (`npm ci` + `chromaui/action`)
- Publishes to Chromatic and runs visual regression against the last approved baseline
- On PRs — flags visual changes for designer/dev review in the Chromatic UI
- On pushes to `main`/`staging` — auto-accepts changes (already reviewed via PR)

**Requires secret:** `CHROMATIC_PROJECT_TOKEN`

---

### 4. Token Sync

**File:** `.github/workflows/token-sync.yml`
**Triggers:** Every hour via cron (`0 * * * *`) + manual `workflow_dispatch` from GitHub UI
**What it does:**
1. Calls `GET /v1/files/:key/variables/local` on the Figma API
2. Transforms the response to W3C tokens format and writes `tokens.json`
3. If `tokens.json` changed: runs token check + component check
4. Opens a PR targeting `staging` with the diff

The PR from step 4 then triggers all three workflows above automatically.

**Requires secrets:** `FIGMA_TOKEN` + `GH_PAT`

---

### 5. Figma Design Audit

**File:** `.github/workflows/figma-audit.yml`
**Triggers:** Daily at 09:00 UTC + manual `workflow_dispatch`
**What it does:**
- Calls the Figma REST API and walks every non-component page
- Flags **detached instances** — `FRAME` nodes whose names match a known component (should be real instances, not copies)
- Flags **hardcoded fills** — `SOLID` fills not bound to a Figma variable

**Requires secret:** `FIGMA_ACCESS_TOKEN`

To run locally:
```bash
FIGMA_ACCESS_TOKEN=your_token npm run audit:figma
```

---

### 6. Figma Code Connect

**File:** `.github/workflows/code-connect.yml`
**Triggers:** Push to `main` when `src/components/**/*.figma.tsx` or `figma.config.json` changes
**What it does:**
- Runs `figma connect publish` to push Code Connect snippets to Figma
- Designers and developers can then see real component code directly inside Figma's Dev Mode when inspecting any connected component

**Requires secret:** `FIGMA_ACCESS_TOKEN`

To publish Code Connect locally:
```bash
FIGMA_ACCESS_TOKEN=your_token npm run code-connect:publish
```

---

### Full automated flow

```
Designer updates Figma variables
          ↓
token-sync.yml (runs every hour)
  → Fetches Figma Variables API
  → Updates tokens.json
  → Runs lint:tokens + lint:components
  → Opens PR targeting staging
          ↓
PR triggers automatically:
  → token-check.yml      no hardcoded values
  → component-check.yml  4-file completeness
  → chromatic.yml        visual regression review
          ↓
Reviewer approves PR + Chromatic diff
          ↓
Merge to staging → merge to main
```

---

## Adding a New Component

Follow these steps exactly. The CI will fail if any step is skipped.

**1. Get the Figma spec**

Open the Figma file and find the component node ID from the URL (`node-id=XX-XXX`).

**2. Create the directory and four files**

```
src/components/MyComponent/
  MyComponent.tsx
  MyComponent.types.ts
  MyComponent.stories.tsx
  index.ts
```

**3. `index.ts` must follow this exact shape**

```typescript
export { default } from './MyComponent';
export { default as MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent.types';
```

**4. Use only token accessors for all visual values**

```typescript
import tokens from '../../lib/tokens';

const P = tokens.Primitives;
const S = tokens.Semantics;
```

**5. Follow the component conventions from `CLAUDE.md`**

- `React.forwardRef` on every component
- `useMemo` for style objects that depend on props
- Always `boxSizing: 'border-box'` and `fontFamily: 'inherit'`
- Extend the relevant HTML attributes interface (`React.HTMLAttributes<HTMLDivElement>`, etc.)
- Always support `theme: 'dark' | 'light'`

**6. Run checks before pushing**

```bash
npm run lint
```

---

## Required Secrets

Add these in **GitHub → repository → Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Used by | How to get |
|---|---|---|
| `CHROMATIC_PROJECT_TOKEN` | `chromatic.yml` | [chromatic.com](https://www.chromatic.com) → your project → Manage → Project Token |
| `FIGMA_TOKEN` | `token-sync.yml` | Figma → Settings → Security → Personal access tokens (enable **file:read** scope) |
| `FIGMA_ACCESS_TOKEN` | `code-connect.yml`, `figma-audit.yml` | Figma → Settings → Security → Personal access tokens (enable **file:read** and **Code Connect Write** scopes) |
| `GH_PAT` | `token-sync.yml` | GitHub → Settings → Developer settings → Personal access tokens → enable **repo** + **workflow** scopes |
