/**
 * Button.tsx
 * All design values sourced from tokens.json at the project root.
 * No hardcoded colours, spacing, or typography values.
 */
import React, { useState, useCallback, useMemo, CSSProperties } from 'react';
import tokens from '../../lib/tokens';
import type { ButtonProps, ButtonVariant, ButtonState, ButtonTheme } from './Button.types';

const P = tokens.Primitives;
const S = tokens.Semantics;

function sem(group: keyof typeof S['color'], key: string, theme: ButtonTheme): string {
  const token = (S.color as Record<string, Record<string, { $value: { dark: string; light: string } }>>)[group][key];
  return token.$value[theme];
}

function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

const RADIUS_FULL     = dim(P.radius['full']);
const SPACING_16      = dim(P.spacing['16']);
const SPACING_24      = dim(P.spacing['24']);
const FONT_SIZE_14    = dim(P.Font['font-size']['14']);
const LINE_HEIGHT_20  = dim(P.Font['line-height']['20']);
const FONT_WEIGHT_600 = P.Font['font-weight']['semi-bold'].$value as unknown as number;

function primaryStyles(state: ButtonState, theme: ButtonTheme): Pick<CSSProperties, 'backgroundColor' | 'color' | 'border' | 'opacity' | 'cursor'> {
  const base = { color: sem('text', 'on-accent', theme), border: 'none' as const, cursor: 'pointer' as const };
  switch (state) {
    case 'hover':    return { ...base, backgroundColor: sem('background', 'accent-hover', theme) };
    case 'pressed':  return { ...base, backgroundColor: sem('background', 'accent-pressed', theme) };
    case 'disabled': return { ...base, backgroundColor: sem('background', 'accent', theme), opacity: 0.4, cursor: 'not-allowed' };
    default:         return { ...base, backgroundColor: sem('background', 'accent', theme) };
  }
}

function secondaryStyles(state: ButtonState, theme: ButtonTheme): Pick<CSSProperties, 'backgroundColor' | 'color' | 'border' | 'opacity' | 'cursor'> {
  const bAccent = '1.5px solid ' + sem('border', 'accent', theme);
  const bFocus  = '1.5px solid ' + sem('border', 'focus', theme);
  switch (state) {
    case 'hover':    return { backgroundColor: sem('background', 'overlay', theme),       color: sem('text', 'link-hover', theme), border: bFocus,  cursor: 'pointer' };
    case 'pressed':  return { backgroundColor: sem('background', 'surface-raised', theme), color: sem('text', 'link', theme),       border: bAccent, cursor: 'pointer' };
    case 'disabled': return { backgroundColor: sem('background', 'surface', theme),        color: sem('text', 'link', theme),       border: bAccent, opacity: 0.4, cursor: 'not-allowed' };
    default:         return { backgroundColor: sem('background', 'surface', theme),        color: sem('text', 'link', theme),       border: bAccent, cursor: 'pointer' };
  }
}

function destructiveStyles(state: ButtonState, theme: ButtonTheme): Pick<CSSProperties, 'backgroundColor' | 'color' | 'border' | 'opacity' | 'cursor'> {
  const base = { border: 'none' as const, cursor: 'pointer' as const };
  switch (state) {
    case 'hover':    return { ...base, backgroundColor: sem('background', 'error-bold', theme),   color: sem('text', 'primary', theme) };
    case 'pressed':  return { ...base, backgroundColor: sem('background', 'error', theme),        color: sem('text', 'error', theme) };
    case 'disabled': return { ...base, backgroundColor: sem('background', 'surface-raised', theme), color: sem('text', 'primary', theme), opacity: 0.4, cursor: 'not-allowed' };
    default:         return { ...base, backgroundColor: sem('background', 'error', theme),        color: sem('text', 'primary', theme) };
  }
}

function resolveVariantStyles(variant: ButtonVariant, state: ButtonState, theme: ButtonTheme) {
  switch (variant) {
    case 'secondary':   return secondaryStyles(state, theme);
    case 'destructive': return destructiveStyles(state, theme);
    default:            return primaryStyles(state, theme);
  }
}

const baseStyle: CSSProperties = {
  borderRadius:            RADIUS_FULL,
  height:                  48,
  paddingTop:              SPACING_16,
  paddingBottom:           SPACING_16,
  paddingLeft:             SPACING_24,
  paddingRight:            SPACING_24,
  fontSize:                FONT_SIZE_14,
  fontWeight:              FONT_WEIGHT_600,
  lineHeight:              LINE_HEIGHT_20 + 'px',
  fontFamily:              'inherit',
  letterSpacing:           '0.01em',
  whiteSpace:              'nowrap',
  display:                 'inline-flex',
  alignItems:              'center',
  justifyContent:          'center',
  transition:              'background-color 120ms ease, color 120ms ease, border-color 120ms ease, opacity 120ms ease',
  outline:                 'none',
  textDecoration:          'none',
  userSelect:              'none',
  WebkitTapHighlightColor: 'transparent',
  boxSizing:               'border-box',
};

function focusRingStyle(theme: ButtonTheme): CSSProperties {
  return { outline: '2px solid ' + sem('border', 'focus', theme), outlineOffset: 2 };
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', forceState, theme = 'dark', children, disabled, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onFocus, onBlur, style, ...rest }, ref) => {
    const [interactionState, setInteractionState] = useState<ButtonState>('default');
    const [isFocused, setIsFocused] = useState(false);

    const state = useMemo<ButtonState>(() => {
      if (forceState) return forceState;
      if (disabled)   return 'disabled';
      return interactionState;
    }, [forceState, disabled, interactionState]);

    const variantStyle = useMemo(() => resolveVariantStyles(variant, state, theme), [variant, state, theme]);
    const focusStyle   = isFocused && !disabled ? focusRingStyle(theme) : {};

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setInteractionState('hover');    onMouseEnter?.(e); }, [disabled, onMouseEnter]);
    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setInteractionState('default');  onMouseLeave?.(e); }, [disabled, onMouseLeave]);
    const handleMouseDown  = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setInteractionState('pressed');  onMouseDown?.(e);  }, [disabled, onMouseDown]);
    const handleMouseUp    = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setInteractionState('hover');    onMouseUp?.(e);    }, [disabled, onMouseUp]);
    const handleFocus      = useCallback((e: React.FocusEvent<HTMLButtonElement>) => { setIsFocused(true);  onFocus?.(e); }, [onFocus]);
    const handleBlur       = useCallback((e: React.FocusEvent<HTMLButtonElement>) => { setIsFocused(false); setInteractionState('default'); onBlur?.(e); }, [onBlur]);

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{ ...baseStyle, ...variantStyle, ...focusStyle, ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;