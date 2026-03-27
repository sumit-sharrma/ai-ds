import React, { useState, useCallback, useMemo, CSSProperties } from 'react';
import tokens from '../../lib/tokens';
import type { IconButtonProps, IconButtonVariant, IconButtonSize } from './IconButton.types';

const P = tokens.Primitives;
const S = tokens.Semantics;

function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

function sem(group: keyof typeof S['color'], key: string, theme: 'dark' | 'light'): string {
  return (S.color as Record<string, Record<string, { $value: { dark: string; light: string } }>>)[group][key].$value[theme];
}

// ─── Size scale ───────────────────────────────────────────────────────────────
const SIZE_CONFIG: Record<IconButtonSize, { total: number; padding: number; radius: number; icon: number }> = {
  xs: { total: 20, padding: dim(P.spacing['4']),  radius: dim(P.radius['4']),  icon: 12 },
  sm: { total: 32, padding: dim(P.spacing['8']),  radius: dim(P.radius['8']),  icon: 16 },
  md: { total: 44, padding: dim(P.spacing['12']), radius: dim(P.radius['12']), icon: 20 },
  lg: { total: 48, padding: dim(P.spacing['12']), radius: dim(P.radius['16']), icon: 24 },
};

// ─── Variant styles ───────────────────────────────────────────────────────────
type State = 'default' | 'hover' | 'pressed' | 'disabled';

interface VariantStyle {
  backgroundColor: string;
  border: string;
  opacity: number;
  iconColor: string;
}

function getVariantStyle(
  variant: IconButtonVariant,
  state: State,
  theme: 'dark' | 'light',
): VariantStyle {
  const none = 'none';

  switch (variant) {
    case 'primary': {
      const bgMap: Record<State, string> = {
        default:  sem('background', 'accent',         theme),
        hover:    sem('background', 'accent-hover',   theme),
        pressed:  sem('background', 'accent-pressed', theme),
        disabled: sem('background', 'accent',         theme),
      };
      return {
        backgroundColor: bgMap[state],
        border:          none,
        opacity:         state === 'disabled' ? 0.4 : 1,
        iconColor:       sem('icon', 'on-accent', theme),
      };
    }

    case 'secondary': {
      const bgMap: Record<State, string> = {
        default:  sem('background', 'surface',       theme),
        hover:    sem('background', 'overlay',       theme),
        pressed:  sem('background', 'surface-raised', theme),
        disabled: sem('background', 'surface',       theme),
      };
      const borderColorMap: Record<State, string> = {
        default:  sem('border', 'accent',  theme),
        hover:    sem('border', 'focus',   theme),
        pressed:  sem('border', 'accent',  theme),
        disabled: sem('border', 'subtle',  theme),
      };
      return {
        backgroundColor: bgMap[state],
        border:          `1.5px solid ${borderColorMap[state]}`,
        opacity:         state === 'disabled' ? 0.35 : 1,
        iconColor:       sem('icon', 'accent', theme),
      };
    }

    case 'ghost':
    default: {
      const bgMap: Record<State, string> = {
        default:  'transparent',
        hover:    sem('background', 'subtle',   theme),
        pressed:  sem('background', 'overlay',  theme),
        disabled: 'transparent',
      };
      return {
        backgroundColor: bgMap[state],
        border:          none,
        opacity:         state === 'disabled' ? 0.4 : 1,
        iconColor:       sem('icon', 'subtle', theme),
      };
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'ghost',
      size    = 'md',
      theme   = 'dark',
      disabled,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      style,
      ...rest
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setIsHovered(true);  onMouseEnter?.(e); }, [disabled, onMouseEnter]);
    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { setIsHovered(false); setIsPressed(false); onMouseLeave?.(e); }, [onMouseLeave]);
    const handleMouseDown  = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setIsPressed(true);  onMouseDown?.(e);  }, [disabled, onMouseDown]);
    const handleMouseUp    = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { setIsPressed(false); onMouseUp?.(e);    }, [onMouseUp]);
    const handleFocus      = useCallback((e: React.FocusEvent<HTMLButtonElement>) => { setIsFocused(true);  onFocus?.(e);      }, [onFocus]);
    const handleBlur       = useCallback((e: React.FocusEvent<HTMLButtonElement>) => { setIsFocused(false); setIsPressed(false); onBlur?.(e); }, [onBlur]);

    const interactionState: State = disabled ? 'disabled' : isPressed ? 'pressed' : isHovered ? 'hover' : 'default';
    const { total, padding, radius, icon: iconSize } = SIZE_CONFIG[size];
    const { backgroundColor, border, opacity, iconColor } = useMemo(
      () => getVariantStyle(variant, interactionState, theme),
      [variant, interactionState, theme],
    );

    const buttonStyle = useMemo<CSSProperties>(() => ({
      width:           total,
      height:          total,
      minWidth:        total,
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      flexShrink:      0,
      padding:         padding,
      borderRadius:    radius,
      border:          border,
      backgroundColor: backgroundColor,
      opacity:         opacity,
      cursor:          disabled ? 'not-allowed' : 'pointer',
      boxSizing:       'border-box',
      color:           iconColor,
      outline:         isFocused && !disabled
        ? `2px solid ${sem('border', 'focus', theme)}`
        : 'none',
      outlineOffset:   2,
      transition:      'background-color 120ms ease, border-color 120ms ease, opacity 120ms ease',
      fontFamily:      'inherit',
    }), [total, padding, radius, border, backgroundColor, opacity, disabled, iconColor, isFocused, theme]);

    const clonedIcon = React.cloneElement(icon, {
      width:    iconSize,
      height:   iconSize,
      'aria-hidden': true,
      focusable: false,
    });

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-disabled={disabled}
        style={{ ...buttonStyle, ...style }}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        {clonedIcon}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
export default IconButton;
