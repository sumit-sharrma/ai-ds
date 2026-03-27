import React, { useMemo, CSSProperties } from 'react';
import tokens from '../../lib/tokens';
import { IconButton } from '../IconButton';
import type { AvatarProps, AvatarSize } from './Avatar.types';

const P = tokens.Primitives;
const S = tokens.Semantics;

function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

function sem(group: keyof typeof S['color'], key: string, theme: 'dark' | 'light'): string {
  return (S.color as Record<string, Record<string, { $value: { dark: string; light: string } }>>)[group][key].$value[theme];
}

// ─── Size scale ───────────────────────────────────────────────────────────────
const SIZE_CONFIG: Record<AvatarSize, {
  total: number;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  strokeWidth: number;
}> = {
  xl: { total: 80, fontSize: dim(P.Font['font-size']['24']), fontWeight: 700, lineHeight: dim(P.Font['line-height']['28']), strokeWidth: 3 },
  lg: { total: 56, fontSize: dim(P.Font['font-size']['20']), fontWeight: 600, lineHeight: dim(P.Font['line-height']['24']), strokeWidth: 2 },
};

// ─── Sub-icons ────────────────────────────────────────────────────────────────
const CameraIcon = () => (
  <svg viewBox="0 0 12 12" fill="none">
    <path
      d="M1 4.5C1 3.948 1.448 3.5 2 3.5h.5l.5-1h3l.5 1H10c.552 0 1 .448 1 1V9c0 .552-.448 1-1 1H2C1.448 10 1 9.552 1 9V4.5z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx="6" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PersonSilhouette = ({ size }: { size: AvatarSize }) => {
  // Proportional head + shoulders, designed for both 80×80 (xl) and 56×56 (lg)
  const s = size === 'xl' ? 80 : 56;
  return (
    <svg viewBox={`0 0 ${s} ${s}`} fill="currentColor" aria-hidden="true"
      style={{ width: s, height: s, position: 'absolute', top: 0, left: 0 }}>
      {/* Head */}
      <ellipse cx={s * 0.5} cy={s * 0.37} rx={s * 0.15} ry={s * 0.15} />
      {/* Shoulders */}
      <ellipse cx={s * 0.5} cy={s * 0.75} rx={s * 0.2625} ry={s * 0.15} />
    </svg>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      size       = 'xl',
      content    = 'photo',
      initials,
      src,
      alt        = '',
      showBadge  = true,
      onBadgeClick,
      theme      = 'dark',
      style,
      ...rest
    },
    ref,
  ) => {
    const { total, fontSize, fontWeight, lineHeight, strokeWidth } = SIZE_CONFIG[size];
    const hasBadge = showBadge && content !== 'initials';

    const containerStyle = useMemo<CSSProperties>(() => ({
      position:   'relative',
      display:    'inline-flex',
      flexShrink: 0,
      width:      total,
      height:     total,
      fontFamily: 'inherit',
      boxSizing:  'border-box',
    }), [total]);

    const circleStyle = useMemo<CSSProperties>(() => ({
      width:           total,
      height:          total,
      borderRadius:    '50%',
      overflow:        'hidden',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      position:        'relative',
      boxSizing:       'border-box',
      ...(content === 'initials' && {
        backgroundColor: sem('background', 'surface-raised', theme),
        border:          `${strokeWidth}px solid ${sem('border', 'default', theme)}`,
      }),
      ...(content === 'empty' && {
        backgroundColor: sem('background', 'subtle', theme),
        border:          `${strokeWidth}px solid ${sem('border', 'default', theme)}`,
      }),
    }), [total, content, theme, strokeWidth]);

    const initialsStyle = useMemo<CSSProperties>(() => ({
      fontSize,
      fontWeight,
      lineHeight:    `${lineHeight}px`,
      color:         sem('text', 'on-accent', theme),
      letterSpacing: size === 'xl' ? '-0.048px' : '-0.02px',
      userSelect:    'none',
      fontFamily:    'inherit',
    }), [fontSize, fontWeight, lineHeight, size, theme]);

    const badgeStyle = useMemo<CSSProperties>(() => ({
      position: 'absolute',
      bottom:   0,
      right:    0,
    }), []);

    return (
      <div ref={ref} style={{ ...containerStyle, ...style }} {...rest}>
        <div style={circleStyle}>
          {content === 'photo' && (
            <img
              src={src}
              alt={alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}

          {content === 'initials' && (
            <span style={initialsStyle}>
              {(initials ?? '').slice(0, 2).toUpperCase()}
            </span>
          )}

          {content === 'empty' && (
            <div style={{ color: sem('icon', 'subtle', theme), width: '100%', height: '100%', position: 'relative' }}>
              <PersonSilhouette size={size} />
            </div>
          )}
        </div>

        {hasBadge && (
          <div style={badgeStyle}>
            <IconButton
              variant="primary"
              size="xs"
              theme={theme}
              icon={<CameraIcon />}
              aria-label="Change photo"
              onClick={onBadgeClick}
            />
          </div>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
export default Avatar;
