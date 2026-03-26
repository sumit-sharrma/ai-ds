export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
export type IconButtonSize    = 'xs' | 'sm' | 'md' | 'lg';
export type IconButtonTheme   = 'dark' | 'light';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Icon element to render — must use `stroke="currentColor"` or `fill="currentColor"`. */
  icon: React.ReactElement;
  /** Accessible label — required for icon-only buttons (WCAG 2.1 AA). */
  'aria-label': string;
  /** Visual style. @default 'ghost' */
  variant?: IconButtonVariant;
  /** Size of the button. @default 'md' */
  size?: IconButtonSize;
  /** Colour theme — match the surface the button sits on. @default 'dark' */
  theme?: IconButtonTheme;
}
