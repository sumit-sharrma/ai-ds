export type ButtonVariant = 'primary' | 'secondary' | 'destructive';
export type ButtonState   = 'default' | 'hover' | 'pressed' | 'disabled';
export type ButtonTheme   = 'dark' | 'light';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Lock the button into a specific visual state — useful for design previews and tests. */
  forceState?: ButtonState;
  /** Colour theme — should match the surface the button sits on. */
  theme?: ButtonTheme;
  /** Button label or content. */
  children: React.ReactNode;
}
