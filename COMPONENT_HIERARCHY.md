# Component Hierarchy

This document classifies every component in the design system using **Atomic Design** principles. Use it when deciding where a new component belongs, which existing components it may compose, and how to name and scope it.

---

## Levels

| Level | Definition | Rule of thumb |
|-------|-----------|---------------|
| **Atom** | Smallest indivisible UI unit. No design-system component dependencies. | If you can't remove any more functionality without breaking it, it's an atom. |
| **Molecule** | Combines two or more atoms into a single-purpose UI pattern. | If it imports another design-system component, it's at least a molecule. |
| **Organism** | A self-contained section of UI composed of molecules and/or atoms. Often maps to a named UI region (header, card, form). | If it could stand alone on a page as a distinct region, it's an organism. |
| **Template** | A full-screen layout that wires organisms together. No business logic — props only. | If it represents an entire screen (e.g. Edit Profile), it's a template. |

---

## Current components

### Atoms

These components have no dependencies on other design-system components. They are the raw building blocks everything else is composed from.

#### `Button`
```
src/components/Button/
```
| | |
|-|-|
| **HTML element** | `<button>` |
| **Variants** | `primary`, `secondary`, `destructive` |
| **States** | default, hover, pressed, disabled, loading |
| **Theme** | `dark` / `light` |
| **Composes** | — |
| **Used by** | molecules, organisms, templates |

A labelled action trigger. The primary call-to-action atom in the system. Only one `primary` Button should appear per view.

---

#### `IconButton`
```
src/components/IconButton/
```
| | |
|-|-|
| **HTML element** | `<button>` |
| **Variants** | `primary`, `secondary`, `ghost` |
| **Sizes** | `xs`, `sm`, `md`, `lg` |
| **States** | default, hover, pressed, disabled |
| **Theme** | `dark` / `light` |
| **Composes** | — |
| **Used by** | `Header`, organisms, templates |

An icon-only action trigger. Requires `aria-label` — no visible text label. Accepts any SVG icon via the `icon` prop.

---

#### `Avatar`
```
src/components/Avatar/
```
| | |
|-|-|
| **HTML element** | `<div>` |
| **Sizes** | `xl` (80px), `lg` (48px) |
| **Content modes** | `photo`, `initials`, `empty` |
| **States** | default, with camera badge |
| **Theme** | `dark` / `light` |
| **Composes** | — |
| **Used by** | organisms, templates (e.g. Edit Profile) |

Displays a user's identity. The optional camera badge (`showBadge`) is only available on `photo` and `empty` content modes — not `initials`.

---

### Molecules

These components import and compose one or more atoms from this design system.

#### `Header`
```
src/components/Header/
```
| | |
|-|-|
| **HTML element** | `<header>` |
| **Variants** | — (single variant) |
| **Theme** | `dark` / `light` |
| **Composes** | `IconButton` (back button, `ghost` / `sm`) |
| **Used by** | templates |

Full-width application header bar. Contains a centred title, an optional back `IconButton` on the left, and an optional action slot on the right (intended for an `IconButton`). The back button is always rendered — omit `onBack` to render it without a callback.

**Composition diagram:**
```
Header
├── IconButton (back, ghost, sm)   — left slot
├── <h1> title                     — centre
└── [children]                     — right slot (optional IconButton)
```

---

#### `ListItem`
```
src/components/ListItem/
```
| | |
|-|-|
| **HTML element** | `<div>` |
| **Variants** | — (single variant) |
| **Theme** | `dark` / `light` |
| **Composes** | — *(text nodes only; no atom imports)* |
| **Used by** | organisms, templates |

A single settings-style row with a left-aligned label and an optional right-aligned value. An optional bottom border separates rows in a list. Although `ListItem` does not import another atom, it is classified as a molecule because it represents a distinct UI pattern formed from multiple independent text elements with layout logic.

**Composition diagram:**
```
ListItem
├── label text    — left, secondary colour, regular weight
├── value text    — right, primary colour, semi-bold  (showValue)
└── border line   — bottom                            (showBorder)
```

---

### Organisms

> None exist yet. The components above provide all the atoms and molecules needed to build organisms.

**Candidates for future addition:**

| Component | Composes | Notes |
|-----------|---------|-------|
| `ProfileCard` | `Avatar` + `Button` | User summary with action |
| `SettingsList` | `ListItem` × n | Grouped list of settings rows |
| `AppBar` | `Header` + `IconButton` | Header with multiple actions |
| `FormField` | (future `Input` atom) | Label + input + error message |

---

### Templates

Full-screen layouts that wire molecules and atoms together using only props — no business logic.

#### `EditProfile`
```
src/templates/EditProfile/
```
| | |
|-|-|
| **HTML element** | `<div>` |
| **Theme** | `dark` / `light` |
| **Composes** | `Header` + `Avatar` + `ListItem` × 4 + `Button` × 2 |
| **Reference** | Edit Profile screen — assessment PDF page 5 |

The reference screen for this design system. Accepts all profile data and action callbacks as props with no internal state.

**Props summary:**

| Prop | Type | Purpose |
|------|------|---------|
| `avatarSrc` | `string?` | Photo URL — omit for empty avatar mode |
| `fullName` | `string?` | Full name field value |
| `phoneNumber` | `string?` | Phone number field value |
| `email` | `string?` | Email field value |
| `username` | `string?` | Username field value (auto-prefixed with `@`) |
| `onBack` | `() => void` | Header back button handler |
| `onSave` | `() => void` | Save Changes button handler |
| `onDeleteAccount` | `() => void` | Delete Account button handler |
| `isSaving` | `boolean` | Disables Save Changes and shows "Saving…" |
| `theme` | `'dark' \| 'light'` | Colour theme |

---

## Rules for adding new components

### 1. Determine the level first

Before writing any code, ask:
- Does this import any other design-system component? → molecule or higher
- Does it compose multiple distinct UI regions? → organism or higher
- Does it represent a full screen? → template

### 2. Respect the dependency direction

Components may only import from **the same level or below**:

```
Template  →  can use Organism, Molecule, Atom
Organism  →  can use Molecule, Atom
Molecule  →  can use Atom only
Atom      →  no design-system imports
```

A `Button` (atom) must never import a `Header` (molecule). An `Organism` must never import a `Template`.

### 3. Name consistently

| Level | Naming pattern | Example |
|-------|---------------|---------|
| Atom | `<Noun>` | `Button`, `Avatar`, `Badge` |
| Molecule | `<Noun>` or `<Adjective><Noun>` | `ListItem`, `Header`, `SearchBar` |
| Organism | `<Noun>` or `<Noun>Section` | `ProfileCard`, `SettingsList` |
| Template | `<ScreenName>` | `EditProfile`, `Onboarding` |

### 4. File structure is the same at every level

```
src/components/<Name>/
  <Name>.tsx
  <Name>.types.ts
  <Name>.stories.tsx
  <Name>.figma.tsx
  index.ts
```

Templates live in `src/templates/<Name>/` and follow the same 5-file structure.

---

## Dependency graph

```
Templates
    └── EditProfile
            ├── Header          ← molecule
            │     └── IconButton  ← atom
            ├── Avatar          ← atom
            ├── ListItem × 4    ← molecule
            └── Button × 2      ← atom

Molecules
    ├── Header
    │     └── IconButton
    └── ListItem

Atoms
    ├── Button
    ├── IconButton
    └── Avatar
```
