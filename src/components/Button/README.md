# Button

React + TypeScript component generated from the Figma design spec.
**File:** Project · EqXU8re4hw6XM6OrwaBbu8 · Node 3:26

All styles are sourced exclusively from tokens.json at the project root.

## Structure
```
ai-ds/
├── tokens.json
└── src/
    └── components/
        └── Button/
            ├── Button.tsx
            ├── Button.types.ts
            ├── Button.stories.tsx
            └── index.ts
```

## Usage
```tsx
import { Button } from './src/components/Button';

<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button disabled>Unavailable</Button>
<Button theme="light">Light mode</Button>
```