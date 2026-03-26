import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import IconButton from './IconButton';

// ─── Sample icon (arrow-left, uses currentColor) ──────────────────────────────
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path
      d="M16 10H4M4 10L9 5M4 10L9 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path
      d="M10 4v12M4 10h12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Icon-only button in three variants (primary, secondary, ghost) and four sizes (xs, sm, md, lg). `aria-label` is required — icon-only buttons must always have an accessible name.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark',  value: '#0D0D0D' },
        { name: 'light', value: '#F5F5F5' },
      ],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=19-3354',
    },
  },
  argTypes: {
    variant:  { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size:     { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    theme:    { control: 'select', options: ['dark', 'light'] },
    icon:     { control: false, description: 'Icon element to render. Must use `stroke="currentColor"` or `fill="currentColor"` so the button controls the colour.' },
    onClick:  { action: 'clicked' },
  },
  args: {
    icon: <PlusIcon />,
    'aria-label': 'Add item',
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  name: 'Primary',
  args: { variant: 'primary', size: 'md', theme: 'dark' },
};

export const Secondary: Story = {
  name: 'Secondary',
  args: { variant: 'secondary', size: 'md', theme: 'dark' },
};

export const Ghost: Story = {
  name: 'Ghost',
  args: { variant: 'ghost', size: 'md', theme: 'dark' },
  parameters: {
    docs: {
      description: {
        story:
          '**A11y:** `aria-label` is mandatory. Keyboard: Space/Enter activates. Focus ring uses `border.focus` token. Disabled sets both `disabled` and `aria-disabled`.',
      },
    },
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: { variant: 'ghost', size: 'md', theme: 'dark', disabled: true },
  parameters: {
    docs: {
      description: { story: 'Sets `disabled` + `aria-disabled`. Opacity drops to 0.4 (ghost/primary) or 0.35 (secondary).' },
    },
  },
};

export const LightTheme: Story = {
  name: 'Light Theme',
  args: { variant: 'primary', size: 'md', theme: 'light' },
  parameters: { backgrounds: { default: 'light' } },
};

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: {
    docs: { description: { story: 'All 3 variants × 4 sizes across dark and light themes.' } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'inherit' }}>
      {(['dark', 'light'] as const).map((theme) => (
        <div key={theme}>
          <p style={{ color: theme === 'dark' ? '#888' : '#555', fontSize: 11, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{theme}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
              <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ color: '#666', fontSize: 11, width: 70, textTransform: 'capitalize' }}>{variant}</span>
                {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                  <IconButton
                    key={size}
                    variant={variant}
                    size={size}
                    theme={theme}
                    icon={<PlusIcon />}
                    aria-label={`${variant} ${size}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const AllStates: Story = {
  name: 'All States',
  parameters: {
    docs: { description: { story: 'Default, hover (use mouse), pressed (hold click), and disabled.' } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, fontFamily: 'inherit' }}>
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#666', fontSize: 11, textTransform: 'capitalize' }}>{variant}</span>
          <IconButton variant={variant} size="md" theme="dark" icon={<PlusIcon />} aria-label="add" />
          <IconButton variant={variant} size="md" theme="dark" icon={<PlusIcon />} aria-label="add" disabled />
        </div>
      ))}
    </div>
  ),
};

export const DoAndDont: Story = {
  name: "Do / Don't",
  parameters: {
    docs: {
      description: {
        story:
          "**Do** always provide `aria-label`. **Do** use icons that use `currentColor` so the button controls the colour. **Don't** omit `aria-label` — screen readers will read nothing. **Don't** use IconButton for text actions — use Button instead.",
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48, fontFamily: 'inherit' }}>
      <div>
        <p style={{ color: '#4ADE80', fontSize: 12, marginBottom: 12, marginTop: 0 }}>✓ Do — labelled icon button</p>
        <IconButton variant="ghost" size="md" theme="dark" icon={<ArrowLeftIcon />} aria-label="Go back" />
      </div>
      <div>
        <p style={{ color: '#F87171', fontSize: 12, marginBottom: 12, marginTop: 0 }}>✗ Don't — missing aria-label</p>
        {/* TypeScript would prevent this — shown for illustration */}
        <IconButton variant="ghost" size="md" theme="dark" icon={<ArrowLeftIcon />} aria-label="" />
      </div>
    </div>
  ),
};
