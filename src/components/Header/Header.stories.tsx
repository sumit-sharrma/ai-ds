import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Page-level navigation header with a back button, centred title, and a right spacer. Sits at the top of a screen or panel.',
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
      url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=21-217',
    },
  },
  argTypes: {
    theme:     { control: 'select', options: ['dark', 'light'] },
    title:     { control: 'text' },
    backLabel: { control: 'text' },
    onBack:    { action: 'back pressed' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  name: 'Default',
  args: {
    title: 'Profile',
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story:
          '**A11y:** `<header>` landmark, `<h1>` title, back button has `aria-label="Go back"`. Keyboard: Tab focuses back button, Space/Enter fires `onBack`. Focus ring uses `border.focus` token.',
      },
    },
  },
};

export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    title: 'Profile',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: { story: 'Light theme variant — use on light surfaces.' },
    },
  },
};

export const LongTitle: Story = {
  name: 'Long Title',
  args: {
    title: 'Notification Preferences',
    theme: 'dark',
  },
  parameters: {
    docs: {
      description: { story: 'Title truncates gracefully when the text is long.' },
    },
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: {
    docs: {
      description: { story: 'Both themes side by side.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'inherit' }}>
      <Header title="Profile" theme="dark" />
      <Header title="Profile" theme="light" />
    </div>
  ),
};

export const DoAndDont: Story = {
  name: "Do / Don't",
  parameters: {
    docs: {
      description: {
        story:
          "**Do** use Header at the top of a full-width screen or panel. **Don't** nest Headers or use them inside cards — use a plain heading instead.",
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: 'inherit' }}>
      <div>
        <p style={{ color: '#4ADE80', fontSize: 12, marginBottom: 8, marginTop: 0 }}>✓ Do — full-width screen header</p>
        <div style={{ backgroundColor: '#0D0D0D', borderRadius: 8, overflow: 'hidden' }}>
          <Header title="Settings" theme="dark" />
        </div>
      </div>
      <div>
        <p style={{ color: '#F87171', fontSize: 12, marginBottom: 8, marginTop: 0 }}>✗ Don't — inside a card</p>
        <div style={{ backgroundColor: '#1C1C1C', borderRadius: 8, padding: 16, width: 340 }}>
          <Header title="Card Title" theme="dark" />
        </div>
      </div>
    </div>
  ),
};
