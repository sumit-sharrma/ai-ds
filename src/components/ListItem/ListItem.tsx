import React, { useMemo, CSSProperties } from 'react';
import tokens from '../../../tokens.json';
import type { ListItemProps } from './ListItem.types';

const P = tokens.Primitives;
const S = tokens.Semantics;

function dim(token: { $value: string }): number {
  return parseInt(token.$value, 10);
}

function sem(group: keyof typeof S['color'], key: string, theme: 'dark' | 'light'): string {
  return (S.color as Record<string, Record<string, { $value: { dark: string; light: string } }>>)[group][key].$value[theme];
}

const PADDING_H      = dim(P.spacing['16']);
const PADDING_V      = dim(P.spacing['12']);
const GAP            = dim(P.spacing['16']);
const FONT_SIZE      = dim(P.Font['font-size']['14']);
const LINE_HEIGHT    = dim(P.Font['line-height']['16']);
const WEIGHT_REGULAR  = P.Font['font-weight']['regular'].$value as unknown as number;
const WEIGHT_SEMIBOLD = P.Font['font-weight']['semi-bold'].$value as unknown as number;

const contentStyle: CSSProperties = {
  display:        'flex',
  flexDirection:  'row',
  alignItems:     'center',
  paddingLeft:    PADDING_H,
  paddingRight:   PADDING_H,
  paddingTop:     PADDING_V,
  paddingBottom:  PADDING_V,
  gap:            GAP,
  boxSizing:      'border-box',
  width:          '100%',
};

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    { label, value, showValue = true, showBorder = true, theme = 'dark', style, ...rest },
    ref,
  ) => {
    const containerStyle = useMemo<CSSProperties>(() => ({
      display:       'flex',
      flexDirection: 'column',
      width:         '100%',
      boxSizing:     'border-box',
      fontFamily:    'inherit',
    }), []);

    const labelStyle = useMemo<CSSProperties>(() => ({
      flex:        1,
      color:       sem('text', 'secondary', theme),
      fontSize:    FONT_SIZE,
      fontWeight:  WEIGHT_REGULAR,
      lineHeight:  `${LINE_HEIGHT}px`,
      fontFamily:  'inherit',
      margin:      0,
    }), [theme]);

    const valueStyle = useMemo<CSSProperties>(() => ({
      color:       sem('text', 'primary', theme),
      fontSize:    FONT_SIZE,
      fontWeight:  WEIGHT_SEMIBOLD,
      lineHeight:  `${LINE_HEIGHT}px`,
      fontFamily:  'inherit',
      textAlign:   'right',
      margin:      0,
      flexShrink:  0,
    }), [theme]);

    const borderStyle = useMemo<CSSProperties>(() => ({
      height:          1,
      backgroundColor: sem('border', 'default', theme),
      width:           '100%',
      flexShrink:      0,
    }), [theme]);

    return (
      <div ref={ref} style={{ ...containerStyle, ...style }} {...rest}>
        <div style={contentStyle}>
          <span style={labelStyle}>{label}</span>
          {showValue && value !== undefined && (
            <span style={valueStyle}>{value}</span>
          )}
        </div>
        {showBorder && (
          <div style={borderStyle} aria-hidden="true" role="separator" />
        )}
      </div>
    );
  },
);

ListItem.displayName = 'ListItem';
export default ListItem;
