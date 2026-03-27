import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import EditProfile from './EditProfile';

const meta: Meta<typeof EditProfile> = {
  title: 'Templates/EditProfile',
  component: EditProfile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Full-screen Edit Profile template. Composes Header + Avatar + ListItem × 4 + Button × 2. No business logic — all state is driven by props.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark',  value: '#0D0D0D' },
        { name: 'light', value: '#F5F5F5' },
      ],
    },
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project',
    },
  },
  argTypes: {
    theme:      { control: 'select', options: ['dark', 'light'] },
    isSaving:   { control: 'boolean' },
    avatarSrc:  { control: 'text' },
    fullName:   { control: 'text' },
    phoneNumber:{ control: 'text' },
    email:      { control: 'text' },
    username:   { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof EditProfile>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    theme: 'dark',
    avatarSrc: 'https://i.pravatar.cc/150?img=47',
    avatarAlt: 'Jane Doe',
    fullName: 'Your Name',
    phoneNumber: '0000-0000-0000',
    email: 'youremail@email.com',
    username: '@yourname',
    onBack: () => {},
    onSave: () => {},
    onDeleteAccount: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default dark theme with all fields populated — matches the reference design.',
      },
    },
  },
};

export const LightTheme: Story = {
  args: {
    ...Default.args,
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: { story: 'Light theme variant.' },
    },
  },
};

export const EmptyAvatar: Story = {
  args: {
    ...Default.args,
    avatarSrc: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'When no `avatarSrc` is provided the Avatar renders in `empty` mode with the camera badge still available.',
      },
    },
  },
};

export const Saving: Story = {
  args: {
    ...Default.args,
    isSaving: true,
  },
  parameters: {
    docs: {
      description: {
        story: '`isSaving=true` disables the Save Changes button and changes its label to "Saving…".',
      },
    },
  },
};

export const EmptyFields: Story = {
  args: {
    theme: 'dark',
    onBack: () => {},
    onSave: () => {},
    onDeleteAccount: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'All optional fields omitted — values are hidden, avatar is in empty mode.',
      },
    },
  },
};

export const DoAndDont: Story = {
  name: "Do / Don't",
  parameters: {
    docs: {
      description: {
        story:
          '**Do** use this template as the single source of truth for the Edit Profile screen — pass data via props. **Don\'t** recreate the layout inline by composing individual components without this template.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 24, background: '#0D0D0D' }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#4ADE80', fontFamily: 'sans-serif', marginBottom: 12 }}>✓ Do — use the template</p>
        <div style={{ border: '1px solid #2a2a2a', borderRadius: 12, overflow: 'hidden', height: 600 }}>
          <EditProfile
            theme="dark"
            avatarSrc="https://i.pravatar.cc/150?img=47"
            fullName="Your Name"
            phoneNumber="0000-0000-0000"
            email="youremail@email.com"
            username="@yourname"
            onBack={() => {}}
            onSave={() => {}}
            onDeleteAccount={() => {}}
            style={{ height: '100%' }}
          />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#F87171', fontFamily: 'sans-serif', marginBottom: 12 }}>✗ Don't — rebuild the layout ad hoc</p>
        <div
          style={{
            border: '1px solid #2a2a2a',
            borderRadius: 12,
            background: '#1c1c1c',
            height: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: '#888', fontFamily: 'sans-serif', textAlign: 'center', padding: 24 }}>
            Manually composing Header + Avatar + rows + buttons<br />outside this template creates inconsistency.
          </p>
        </div>
      </div>
    </div>
  ),
};
