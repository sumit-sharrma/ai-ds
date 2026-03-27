import React from 'react';

export type EditProfileTheme = 'dark' | 'light';

export interface EditProfileField {
  /** Row label shown on the left (e.g. "Full name"). */
  label: string;
  /** Current value shown on the right (e.g. "Your Name"). */
  value?: string;
}

export interface EditProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  // ── Avatar ────────────────────────────────────────────────────────────────
  /** Photo URL. When omitted the avatar renders in `empty` mode. */
  avatarSrc?: string;
  /** Accessible alt text for the avatar photo. @default 'Profile photo' */
  avatarAlt?: string;
  /** Called when the camera badge on the avatar is tapped. */
  onAvatarChange?: () => void;

  // ── Profile fields ────────────────────────────────────────────────────────
  /** Full name row. */
  fullName?: string;
  /** Phone number row. */
  phoneNumber?: string;
  /** Email address row. */
  email?: string;
  /** Username row (displayed with leading "@"). */
  username?: string;

  // ── Header ────────────────────────────────────────────────────────────────
  /** Called when the back button in the header is tapped. */
  onBack?: () => void;

  // ── Actions ───────────────────────────────────────────────────────────────
  /** Called when "Save Changes" is tapped. */
  onSave?: () => void;
  /** Called when "Delete Account" is tapped. */
  onDeleteAccount?: () => void;
  /** Puts the Save Changes button into a loading / disabled state. */
  isSaving?: boolean;

  // ── Theme ─────────────────────────────────────────────────────────────────
  /** Colour theme. @default 'dark' */
  theme?: EditProfileTheme;
}
