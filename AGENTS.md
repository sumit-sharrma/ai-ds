# AI Agent Rules — Figma Design Work

This file is the authoritative ruleset for any AI agent (Claude Code, Codex, Cursor, v0, etc.)
that creates or modifies designs in the Figma file for this project.

Read it in full before touching Figma. These rules prevent duplicate components,
detached instances, and hardcoded values — the three most common AI design errors.

---

## The One Rule That Covers Everything

> **Never create a new visual element when an existing design-system component can be used instead.**

Every button, icon button, avatar, header, and list item in this system is a published
Figma component. Use them. Do not draw rectangles, copy frames, or build new components
from scratch unless you have confirmed that no matching component exists.

---

## Mandatory Workflow — Follow This Every Session

### Step 1 — Search before you build

At the start of every session, before placing anything on the canvas, run:

```
figma_search_components(query: "")   // lists ALL published components
```

Build a mental registry. The current component set is:

| Figma component name | React component | Hierarchy level |
|----------------------|-----------------|-----------------|
| `Button` | `Button` | Atom |
| `Icon Button` | `IconButton` | Atom |
| `Avatar` | `Avatar` | Atom |
| `Header` | `Header` | Molecule |
| `List` | `ListItem` | Molecule |

### Step 2 — Instantiate, never copy

To place a component on the canvas use:

```
figma_instantiate_component(componentKey: "<key>")
```

**Never** use:
- `figma_create_child` to recreate a component's visual structure
- `figma_clone_node` on a component frame (cloning a FRAME detaches it)
- Drawing rectangles + text to approximate a component's appearance

### Step 3 — Set variant properties, not visual overrides

After instantiating a component, configure it via `figma_set_instance_properties`:

```javascript
// ✓ Correct — set via component properties
figma_set_instance_properties(nodeId, {
  "Variant": "Primary",
  "State": "Default",
  "Size": "Medium"
})

// ✗ Wrong — overriding fills/colours directly
figma_set_fills(nodeId, [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }])
```

### Step 4 — Bind all new values to variables

If you create any NEW layer (background frame, wrapper, etc.), every fill, stroke,
corner radius, spacing, and font must be bound to a Figma variable:

```javascript
// ✓ Correct — variable-bound fill
{
  type: 'SOLID',
  boundVariables: { color: { type: 'VARIABLE_ALIAS', id: 'VariableID:12:199' } }
}

// ✗ Wrong — hardcoded fill
{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }
```

Use `figma_get_variables()` to resolve variable names to IDs before setting fills.

### Step 5 — Place inside a container

Never place components on a blank canvas. Always:
1. Check for an existing Section or Frame on the current page
2. If none exists, create a Section first
3. Place all components inside it

```javascript
let section = figma.currentPage.findOne(n => n.type === 'SECTION' && n.name === 'Screens');
if (!section) {
  section = figma.createSection();
  section.name = 'Screens';
}
// Now place components inside section
```

### Step 6 — Screenshot and verify

After placing components, always call `figma_take_screenshot` and verify:
- Components are instances (not detached frames)
- No raw colours visible that should be token-bound
- Layout matches the design intent

---

## Component Property Reference

### Button
| Figma property | Values | React prop |
|----------------|--------|------------|
| `Variant` | `Primary`, `Secondary`, `Destructive` | `variant` |
| `State` | `Default`, `Hover`, `Pressed`, `Disabled` | `disabled` |

### Icon Button
| Figma property | Values | React prop |
|----------------|--------|------------|
| `Type` | `Primary`, `Secondary`, `Ghost` | `variant` |
| `Size` | `X-Small`, `Small`, `Medium`, `Large` | `size` |
| `State` | `Default`, `Hover`, `Pressed`, `Disabled` | `disabled` |

### Avatar
| Figma property | Values | React prop |
|----------------|--------|------------|
| `Size` | `X-Large`, `Large` | `size` (`xl` / `lg`) |
| `Content` | `Photo`, `Initials`, `Empty` | `content` |

### Header
Single variant — no properties. Title and back button are set via text/boolean overrides.

### List (ListItem)
| Figma property | Type | React prop |
|----------------|------|------------|
| `Text-label` | Text | `label` |
| `Text-action` | Text | `value` |
| `Show-action` | Boolean | `showValue` |
| `Show-border` | Boolean | `showBorder` |

---

## What Counts as a Violation

The `scripts/audit-figma.mjs` script flags these automatically. Fix them before
treating any design screen as complete.

| Violation | What it means | How to fix |
|-----------|--------------|-----------|
| Detached instance | A `FRAME` exists with a name matching a known component | Delete the frame, instantiate the real component |
| Hardcoded fill | A layer has a `SOLID` fill not bound to a variable | Rebind the fill to the correct semantic variable |
| Duplicate component | A `COMPONENT` or `COMPONENT_SET` exists that replicates an existing one | Delete the duplicate, use the published original |

---

## Variable Reference (most common)

| Token | Variable ID | Use for |
|-------|------------|---------|
| `background/surface` | `VariableID:12:199` (dark) | Card/surface backgrounds |
| `background/page` | `VariableID:12:198` | Page background |
| `text/primary` | `VariableID:12:199` | Primary text |
| `text/secondary` | `VariableID:12:200` | Secondary/label text |
| `border/default` | `VariableID:12:235` | Dividers, borders |
| `spacing/16` | `VariableID:12:141` | Standard padding |
| `spacing/12` | `VariableID:12:140` | Compact padding |

> Always verify IDs with `figma_get_variables()` — variable IDs are file-specific and
> may change if the file is duplicated.

---

## Quick Checklist Before Finishing Any Screen

- [ ] Every interactive element uses a component instance (not a copied frame)
- [ ] All fills on new layers are variable-bound (no raw hex)
- [ ] All spacing on new layers uses spacing variables
- [ ] Components are placed inside a Section or Frame
- [ ] `figma_take_screenshot` taken and layout verified
- [ ] `npm run audit:figma` passes with zero violations (run locally or check CI)
