# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-03-27

### Added

#### Components
- **Avatar** — user profile avatar with `xl`/`lg` sizes and three content modes: `photo`, `initials`, `empty`. Includes optional camera badge (`showBadge`) for photo and empty states. Supports `dark`/`light` themes.
- **Button** — action button with `primary`, `secondary`, and `ghost` variants across `sm`, `md`, `lg` sizes. Supports `disabled` and `loading` states.
- **Header** — full-width application header with title, optional back button, and an action slot for icon buttons.
- **IconButton** — icon-only button with `primary`, `secondary`, and `ghost` variants across `xs`, `sm`, `md`, `lg` sizes. `aria-label` is required.
- **ListItem** — settings-style list row with a label, optional value, and optional chevron indicator.

All components:
- Use `React.forwardRef` and accept all native HTML attributes via props spread
- Support `theme: 'dark' | 'light'` (default `'dark'`)
- Use `useMemo` for style objects that depend on props
- Enforce `boxSizing: 'border-box'` and `fontFamily: 'inherit'`

#### Token System
- `tokens.json` — design tokens exported from Figma in Tokens Studio format with three collections: `Primitives/Value`, `Semantics/Dark`, `Semantics/Light`
- `src/lib/tokens.ts` — token adapter that resolves Tokens Studio alias references (e.g. `{color.grey.900}`) to concrete hex values and merges dark/light semantic collections into a single combined shape used by all components
- `dim()` helper — converts dimension tokens (`{ $value: "16px" }`) to numbers
- `sem()` helper — resolves semantic colour tokens for a given theme to hex strings

#### Storybook
- Storybook 10 setup with `@storybook/react-vite` framework
- `@storybook/addon-a11y` — WCAG 2.1 AA accessibility checks per story
- `@storybook/addon-docs` — auto-generated API documentation from JSDoc comments
- `@storybook/addon-vitest` — test runner integration
- `src/styles/global.css` — Inter Variable font loading and `box-sizing` reset
- Stories for all five components including `AllVariants` and `Do / Don't` stories

#### CI/CD Pipelines
- **Token Integrity Check** (`.github/workflows/token-check.yml`) — scans component implementation files and fails if hardcoded hex colours, `rgba()` calls, or numeric `fontSize` values are found. Triggers on push/PR when `src/components/**` or `tokens.json` change.
- **Component Completeness Check** (`.github/workflows/component-check.yml`) — validates every component directory has all four required files (`<Name>.tsx`, `<Name>.types.ts`, `<Name>.stories.tsx`, `index.ts`) and that `index.ts` exports are correct. Triggers on push/PR when `src/components/**` changes.
- **Chromatic** (`.github/workflows/chromatic.yml`) — publishes Storybook to Chromatic and runs visual regression tests on every push and PR. Auto-accepts changes on pushes to `main`/`staging` (already reviewed via PR). Requires `CHROMATIC_PROJECT_TOKEN` secret.
- **Token Sync** (`.github/workflows/token-sync.yml`) — runs hourly via cron (`0 * * * *`) and on manual `workflow_dispatch`. Fetches the latest Figma variables, updates `tokens.json`, runs lint checks, and opens a PR targeting `staging` if anything changed. Requires `FIGMA_TOKEN` and `GH_PAT` secrets.

#### Scripts
- `scripts/check-tokens.mjs` — local token integrity checker (same rules as CI). Run with `npm run lint:tokens`.
- `scripts/check-components.mjs` — local component completeness checker (same rules as CI). Run with `npm run lint:components`.
- `scripts/sync-tokens.mjs` — fetches Figma Variables API and writes `tokens.json`. Run with `FIGMA_TOKEN=<token> npm run sync:tokens`.

#### npm Scripts
- `npm run storybook` — start Storybook dev server at http://localhost:6006
- `npm run build-storybook` — build a static Storybook to `storybook-static/`
- `npm run lint:tokens` — run token integrity check
- `npm run lint:components` — run component completeness check
- `npm run lint` — run both checks together
- `npm run sync:tokens` — fetch latest Figma variables and update `tokens.json`
- `npm run chromatic` — publish to Chromatic and run visual regression locally

#### Documentation
- `README.md` — full contributor guide covering prerequisites, getting started, project structure, token system, components, Storybook, automated checks, CI/CD pipelines, adding a new component, and required secrets
- `CLAUDE.md` — AI-readable rules file defining component conventions, token usage, Storybook standards, accessibility requirements, and the Figma → code workflow

### Fixed

- **Token format adapter** — `tokens.json` structure changed from a custom flat W3C format to the Tokens Studio three-collection export format. Created `src/lib/tokens.ts` to bridge the gap without requiring changes to any component files.
- **`ReferenceError: require is not defined`** — `src/lib/tokens.ts` initially used CommonJS `require()` which is not available in the browser/Vite build. Changed to ESM `import`.
- **Chromatic story extraction failure** — `@storybook/addon-vitest` was installed but not registered in `.storybook/main.ts`, causing Chromatic's extractor to fail. Registered the addon. Also fixed `preview.ts` importing from `@storybook/react-vite` instead of `@storybook/react`.
- **Storybook duplicate symbol error** — `@chromatic-com/storybook` addon was added to `.storybook/main.ts` but it auto-injects itself, causing a `symbol already declared` build error. Removed the manual entry.
- **Avatar `lint:tokens` violation** — `SIZE_CONFIG` in `Avatar.tsx` had raw numeric `fontSize` values (`24`, `20`). Changed to use `dim(P.Font['font-size']['24'])` and equivalent token accessors.
- **`package.json` EJSONPARSE in CI** — a JS comment (`//npm run storybook`) had been left inline after a script value, which is invalid JSON. Removed the comment.

---

## [0.1.0] - 2026-03-23

### Added

- Initial project scaffold with React 19, TypeScript, and Vite
- `tokens.json` — first version of design tokens (primitives: colours, spacing, radii, typography)
- Repository and GitHub Actions foundation
