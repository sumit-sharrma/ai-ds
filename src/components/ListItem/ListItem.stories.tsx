import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ListItem from './ListItem';

const meta: Meta<typeof ListItem> = {
  title: 'Components/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A label/value row used to display key–value data in lists, settings panels, and profile cards. Supports an optional bottom border and toggleable value visibility.',
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
      url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=20-3390',
    },
  },
  argTypes: {
    theme:       { control: 'select', options: ['dark', 'light'] },
    showValue:   { control: 'boolean' },
    showBorder:  { control: 'boolean' },
    label:       { control: 'text' },
    value:       { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ListItem>;

export const Default: Story = {
  name: 'Default',
  args: {
    label: 'Full name',
    value: 'Alex Johnson',
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default state with label, value, and bottom border visible. Keyboard: no interactive elements. Screen reader reads label and value as sibling text nodes.',
      },
    },
  },
};

export const WithoutBorder: Story = {
  name: 'Without Border',
  args: {
    label: 'Full name',
    value: 'Alex Johnson',
    showBorder: false,
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: { story: 'Use `showBorder={false}` on the last item in a list to avoid a trailing divider.' },
    },
  },
};

export const WithoutValue: Story = {
  name: 'Without Value',
  args: {
    label: 'Email address',
    showValue: false,
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: { story: 'Use `showValue={false}` or omit `value` when the value is not yet available.' },
    },
  },
};

export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    label: 'Full name',
    value: 'Alex Johnson',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: { story: 'Light theme variant — use when placed on a light surface.' },
    },
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: {
    docs: {
      description: { story: 'All label/value combinations across both themes.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      {(['dark', 'light'] as const).map((theme) => (
        <div
          key={theme}
          style={{
            width: 340,
            backgroundColor: theme === 'dark' ? '#0D0D0D' : '#F5F5F5',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <ListItem theme={theme} label="Full name"     value="Alex Johnson" />
          <ListItem theme={theme} label="Email"         value="alex@example.com" />
          <ListItem theme={theme} label="Phone"         value="+1 555 000 1234" />
          <ListItem theme={theme} label="Member since"  value="Jan 2024" />
          <ListItem theme={theme} label="Plan"          value="Pro" showBorder={false} />
        </div>
      ))}
    </div>
  ),
};

export const DoAndDont: Story = {
  name: 'Do / Don\'t',
  parameters: {
    docs: {
      description: {
        story:
          "**Do** stack multiple ListItems inside a container with a background surface. **Don't** use ListItem as a standalone floating element without a parent surface, or use it for interactive actions (use a Button instead).",
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48, fontFamily: 'inherit' }}>
      <div>
        <p style={{ color: '#4ADE80', fontSize: 12, marginBottom: 8, marginTop: 0 }}>✓ Do — stack inside a surface</p>
        <div style={{ width: 340, backgroundColor: '#1C1C1C', borderRadius: 8, overflow: 'hidden' }}>
          <ListItem theme="dark" label="Full name"  value="Alex Johnson" />
          <ListItem theme="dark" label="Email"      value="alex@example.com" showBorder={false} />
        </div>
      </div>
      <div>
        <p style={{ color: '#F87171', fontSize: 12, marginBottom: 8, marginTop: 0 }}>✗ Don't — float without surface</p>
        <ListItem theme="dark" label="Full name" value="Alex Johnson" />
      </div>
    </div>
  ),
};
