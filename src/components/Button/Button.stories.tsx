/**
 * Button.stories.tsx — Storybook 7+ CSF 3
 * All 12 Figma variants (3 variants × 4 states)
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Primary interactive element. Comes in three variants (primary, secondary, destructive) and two themes (dark, light), each with four interactive states.',
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
      url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=3-26',
    },
  },
  argTypes: {
    variant:    { control: 'select', options: ['primary', 'secondary', 'destructive'] },
    forceState: { control: 'select', options: ['default', 'hover', 'pressed', 'disabled'] },
    theme:      { control: 'select', options: ['dark', 'light'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimaryDefault: Story = {
  name: 'Primary / Default',
  args: { variant: 'primary', theme: 'dark', children: 'Confirm' },
  parameters: {
    docs: {
      description: {
        story:
          'Main call-to-action — use once per view. **A11y:** activated with Space or Enter; focus ring uses `border.focus` token (lime, 2px offset). `aria-disabled` is set alongside the `disabled` attribute when disabled.',
      },
    },
  },
};
export const PrimaryHover:    Story = { name: 'Primary / Hover',    args: { variant: 'primary', theme: 'dark', forceState: 'hover',   children: 'Confirm' } };
export const PrimaryPressed:  Story = { name: 'Primary / Pressed',  args: { variant: 'primary', theme: 'dark', forceState: 'pressed', children: 'Confirm' } };
export const PrimaryDisabled: Story = {
  name: 'Primary / Disabled',
  args: { variant: 'primary', theme: 'dark', disabled: true, children: 'Confirm' },
  parameters: { docs: { description: { story: 'Sets both `disabled` and `aria-disabled={true}`. Opacity drops to 40%, cursor changes to `not-allowed`.' } } },
};

export const SecondaryDefault:  Story = { name: 'Secondary / Default',  args: { variant: 'secondary', theme: 'dark', children: 'Cancel' } };
export const SecondaryHover:    Story = { name: 'Secondary / Hover',    args: { variant: 'secondary', theme: 'dark', forceState: 'hover',   children: 'Cancel' } };
export const SecondaryPressed:  Story = { name: 'Secondary / Pressed',  args: { variant: 'secondary', theme: 'dark', forceState: 'pressed', children: 'Cancel' } };
export const SecondaryDisabled: Story = { name: 'Secondary / Disabled', args: { variant: 'secondary', theme: 'dark', disabled: true,        children: 'Cancel' } };

export const DestructiveDefault:  Story = { name: 'Destructive / Default',  args: { variant: 'destructive', theme: 'dark', children: 'Delete' } };
export const DestructiveHover:    Story = { name: 'Destructive / Hover',    args: { variant: 'destructive', theme: 'dark', forceState: 'hover',   children: 'Delete' } };
export const DestructivePressed:  Story = { name: 'Destructive / Pressed',  args: { variant: 'destructive', theme: 'dark', forceState: 'pressed', children: 'Delete' } };
export const DestructiveDisabled: Story = { name: 'Destructive / Disabled', args: { variant: 'destructive', theme: 'dark', disabled: true,        children: 'Delete' } };

export const DoAndDont: Story = {
  name: 'Do / Don\'t',
  parameters: {
    docs: {
      description: {
        story:
          "**Do** use one Primary button per view for the main action. **Do** pair Primary with Secondary for action/cancel flows. **Don't** use multiple Primary buttons side by side. **Don't** use a Button for navigation — use a link.",
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48, fontFamily: 'inherit' }}>
      <div>
        <p style={{ color: '#4ADE80', fontSize: 12, marginBottom: 12, marginTop: 0 }}>✓ Do — one primary, one secondary</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" theme="dark">Cancel</Button>
          <Button variant="primary"   theme="dark">Save changes</Button>
        </div>
      </div>
      <div>
        <p style={{ color: '#F87171', fontSize: 12, marginBottom: 12, marginTop: 0 }}>✗ Don't — multiple primaries</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="primary" theme="dark">Save</Button>
          <Button variant="primary" theme="dark">Publish</Button>
        </div>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: { docs: { description: { story: 'All three variants across all four states.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      {(['primary', 'secondary', 'destructive'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 16 }}>
          {(['default', 'hover', 'pressed', 'disabled'] as const).map((s) => (
            <Button key={s} variant={variant} forceState={s} theme="dark">
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};