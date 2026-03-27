import React, { CSSProperties, useMemo } from 'react';
import tokens, { motion } from '../../lib/tokens';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { ListItem } from '../../components/ListItem';
import type { EditProfileProps } from './EditProfile.types';

const P = tokens.Primitives;
const S = tokens.Semantics;

function dim(token: { $value: string | number }): number {
  return typeof token.$value === 'number'
    ? token.$value
    : parseInt(token.$value as string, 10);
}

function sem(group: string, key: string, theme: 'dark' | 'light'): string {
  return (S.color as any)[group][key].$value[theme];
}

const EditProfile = React.forwardRef<HTMLDivElement, EditProfileProps>(
  (
    {
      avatarSrc,
      avatarAlt = 'Profile photo',
      onAvatarChange,
      fullName,
      phoneNumber,
      email,
      username,
      onBack,
      onSave,
      onDeleteAccount,
      isSaving = false,
      theme = 'dark',
      style,
      ...rest
    },
    ref
  ) => {
    const pageStyle = useMemo<CSSProperties>(
      () => ({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: sem('background', 'page', theme),
        fontFamily: 'inherit',
        boxSizing: 'border-box',
      }),
      [theme]
    );

    const scrollAreaStyle = useMemo<CSSProperties>(
      () => ({
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${dim(P.spacing['24'])}px ${dim(P.spacing['16'])}px`,
        gap: dim(P.spacing['24']),
        boxSizing: 'border-box',
      }),
      []
    );

    const cardStyle = useMemo<CSSProperties>(
      () => ({
        width: '100%',
        backgroundColor: sem('background', 'surface', theme),
        borderRadius: dim(P.radius['16']),
        overflow: 'hidden',
        boxSizing: 'border-box',
      }),
      [theme]
    );

    const actionsStyle = useMemo<CSSProperties>(
      () => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: dim(P.spacing['12']),
        paddingBottom: dim(P.spacing['32']),
        boxSizing: 'border-box',
      }),
      []
    );

    const avatarContent = avatarSrc ? 'photo' : 'empty';

    return (
      <div ref={ref} style={{ ...pageStyle, ...style }} {...rest}>
        {/* Header */}
        <Header title="Edit Profile" onBack={onBack} theme={theme} />

        {/* Scrollable content */}
        <div style={scrollAreaStyle}>
          {/* Avatar */}
          <Avatar
            size="xl"
            content={avatarContent}
            src={avatarSrc}
            alt={avatarAlt}
            showBadge
            onBadgeClick={onAvatarChange}
            theme={theme}
          />

          {/* Profile fields card */}
          <div style={cardStyle}>
            <ListItem
              label="Full name"
              value={fullName}
              showValue={!!fullName}
              showBorder
              theme={theme}
            />
            <ListItem
              label="Phone number"
              value={phoneNumber}
              showValue={!!phoneNumber}
              showBorder
              theme={theme}
            />
            <ListItem
              label="Email"
              value={email}
              showValue={!!email}
              showBorder
              theme={theme}
            />
            <ListItem
              label="Username"
              value={username ? `@${username.replace(/^@/, '')}` : undefined}
              showValue={!!username}
              showBorder={false}
              theme={theme}
            />
          </div>

          {/* Action buttons */}
          <div style={actionsStyle}>
            <Button
              variant="primary"
              theme={theme}
              disabled={isSaving}
              onClick={onSave}
              style={{ width: '100%' }}
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>

            <Button
              variant="secondary"
              theme={theme}
              onClick={onDeleteAccount}
              style={{ width: '100%' }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

EditProfile.displayName = 'EditProfile';
export default EditProfile;
