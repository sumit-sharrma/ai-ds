import React, { useMemo, CSSProperties } from 'react';
import tokens from '../../../tokens.json';
import { IconButton } from '../IconButton';
import type { HeaderProps } from './Header.types';

const P = tokens.Primitives;
const S = tokens.Semantics;

function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

function sem(group: keyof typeof S['color'], key: string, theme: 'dark' | 'light'): string {
  return (S.color as Record<string, Record<string, { $value: { dark: string; light: string } }>>)[group][key].$value[theme];
}

const PADDING     = dim(P.spacing['8']);
const SPACER_SIZE = 32;
const FONT_SIZE   = dim(P.Font['font-size']['16']);
const LINE_HEIGHT = dim(P.Font['line-height']['20']);
const FONT_WEIGHT = P.Font['font-weight']['semi-bold'].$value as unknown as number;

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

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ title, onBack, backLabel = 'Go back', theme = 'dark', style, ...rest }, ref) => {
    const containerStyle = useMemo<CSSProperties>(() => ({
      display:       'flex',
      flexDirection: 'row',
      alignItems:    'center',
      padding:       PADDING,
      width:         '100%',
      boxSizing:     'border-box',
      fontFamily:    'inherit',
    }), []);

    const titleStyle = useMemo<CSSProperties>(() => ({
      flex:         1,
      textAlign:    'center',
      color:        sem('text', 'primary', theme),
      fontSize:     FONT_SIZE,
      fontWeight:   FONT_WEIGHT,
      lineHeight:   `${LINE_HEIGHT}px`,
      fontFamily:   'inherit',
      margin:       0,
      letterSpacing: 0,
    }), [theme]);

    return (
      <header ref={ref} style={{ ...containerStyle, ...style }} {...rest}>
        <IconButton
          variant="ghost"
          size="md"
          theme={theme}
          icon={<ArrowLeftIcon />}
          aria-label={backLabel}
          onClick={onBack}
        />

        <h1 style={titleStyle}>{title}</h1>

        {/* Spacer balances the right edge — matches Figma Rectangle 1 (32×32) */}
        <div
          style={{ width: SPACER_SIZE, height: SPACER_SIZE, flexShrink: 0 }}
          aria-hidden="true"
        />
      </header>
    );
  },
);

Header.displayName = 'Header';
export default Header;
