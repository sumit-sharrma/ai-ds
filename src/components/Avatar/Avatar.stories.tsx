import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Avatar from './Avatar';

const PHOTO_URL = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&q=80';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Circular avatar in two sizes (xl, lg) and three content types (photo, initials, empty). Includes an optional camera badge for edit actions. `showBadge` is not available on the `initials` variant.',
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
      url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=22-363',
    },
  },
  argTypes: {
    size:        { control: 'select', options: ['xl', 'lg'] },
    content:     { control: 'select', options: ['photo', 'initials', 'empty'] },
    theme:       { control: 'select', options: ['dark', 'light'] },
    showBadge:   { control: 'boolean' },
    src:         { control: false },
    onBadgeClick: { action: 'badge clicked' },
  },
  args: {
    size: 'xl',
    theme: 'dark',
    showBadge: true,
    src: PHOTO_URL,
    alt: 'User profile photo',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ─── Variant stories ──────────────────────────────────────────────────────────

export const Photo: Story = {
  name: 'Photo',
  args: { content: 'photo', size: 'xl' },
  parameters: {
    docs: {
      description: {
        story:
          '**A11y:** Always provide a meaningful `alt` text when `content="photo"`. The camera badge is keyboard-accessible via the underlying `IconButton`.',
      },
    },
  },
};

export const Initials: Story = {
  name: 'Initials',
  args: { content: 'initials', initials: 'YN', size: 'xl' },
  parameters: {
    docs: {
      description: {
        story: 'Up to 2 characters; automatically uppercased. The `showBadge` prop has no effect on this variant.',
      },
    },
  },
};

export const Empty: Story = {
  name: 'Empty',
  args: { content: 'empty', size: 'xl' },
  parameters: {
    docs: {
      description: {
        story: 'Default placeholder state — shown before a user uploads a photo.',
      },
    },
  },
};

export const WithoutBadge: Story = {
  name: 'Without Badge',
  args: { content: 'photo', size: 'xl', showBadge: false },
};

export const LightTheme: Story = {
  name: 'Light Theme',
  args: { content: 'initials', initials: 'YN', size: 'xl', theme: 'light' },
  parameters: { backgrounds: { default: 'light' } },
};

// ─── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: {
    docs: { description: { story: 'All 3 content types × 2 sizes across dark and light themes.' } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, fontFamily: 'inherit' }}>
      {(['dark', 'light'] as const).map(theme => (
        <div key={theme}>
          <p style={{ color: theme === 'dark' ? '#888' : '#555', fontSize: 11, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{theme}</p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
            {(['xl', 'lg'] as const).map(size => (
              <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: 10, textTransform: 'uppercase' }}>{size}</span>
                <Avatar content="photo"    size={size} theme={theme} src={PHOTO_URL} alt="photo" />
                <Avatar content="initials" size={size} theme={theme} initials="YN" showBadge={false} />
                <Avatar content="empty"    size={size} theme={theme} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── Do / Don't ───────────────────────────────────────────────────────────────

export const DoAndDont: Story = {
  name: "Do / Don't",
  parameters: {
    docs: {
      description: {
        story:
          "**Do** provide `alt` text for photo avatars. **Do** use `initials` only with 1–2 chars. **Don't** pass a raw hex colour — use the theme prop. **Don't** use `showBadge` on the `initials` variant (it has no effect).",
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48, fontFamily: 'inherit' }}>
      <div>
        <p style={{ color: '#4ADE80', fontSize: 12, marginBottom: 16, marginTop: 0 }}>✓ Do — photo with alt text</p>
        <Avatar content="photo" size="xl" theme="dark" src={PHOTO_URL} alt="Jane Smith's profile photo" />
      </div>
      <div>
        <p style={{ color: '#4ADE80', fontSize: 12, marginBottom: 16, marginTop: 0 }}>✓ Do — 2-char initials</p>
        <Avatar content="initials" size="xl" theme="dark" initials="JS" showBadge={false} />
      </div>
      <div>
        <p style={{ color: '#F87171', fontSize: 12, marginBottom: 16, marginTop: 0 }}>✗ Don't — more than 2 chars (truncated)</p>
        <Avatar content="initials" size="xl" theme="dark" initials="JANE" showBadge={false} />
      </div>
      <div>
        <p style={{ color: '#F87171', fontSize: 12, marginBottom: 16, marginTop: 0 }}>✗ Don't — missing alt on photo</p>
        <Avatar content="photo" size="xl" theme="dark" src={PHOTO_URL} alt="" showBadge={false} />
      </div>
    </div>
  ),
};
