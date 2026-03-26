export type ListItemTheme = 'dark' | 'light';

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label shown on the left side. Corresponds to the Figma `Text-label` property. */
  label: string;
  /** Value shown on the right side. Corresponds to the Figma `Text-action` property. */
  value?: string;
  /** Whether to show the value. Corresponds to the Figma `Show-action` property. @default true */
  showValue?: boolean;
  /** Whether to show the bottom border. Corresponds to the Figma `Show-border` property. @default true */
  showBorder?: boolean;
  /** Colour theme — match the surface the component sits on. @default 'dark' */
  theme?: ListItemTheme;
}
