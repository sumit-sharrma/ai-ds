export type HeaderTheme = 'dark' | 'light';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Page or screen title displayed in the centre. Corresponds to Figma `Text-title` property. */
  title: string;
  /** Callback fired when the back button is pressed. When omitted the button is still rendered but does nothing. */
  onBack?: () => void;
  /** Aria label for the back button. @default 'Go back' */
  backLabel?: string;
  /** Colour theme — match the surface the header sits on. @default 'dark' */
  theme?: HeaderTheme;
}
