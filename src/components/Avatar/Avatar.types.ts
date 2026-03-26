export type AvatarSize    = 'xl' | 'lg';
export type AvatarContent = 'photo' | 'initials' | 'empty';
export type AvatarTheme   = 'dark' | 'light';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the avatar. @default 'xl' */
  size?: AvatarSize;
  /** Content to display inside the circle. @default 'photo' */
  content?: AvatarContent;
  /** Initials text (1–2 chars). Required when `content='initials'`. */
  initials?: string;
  /** Image URL. Required when `content='photo'`. */
  src?: string;
  /** Accessible alt text for the photo. @default '' */
  alt?: string;
  /** Show the camera edit badge. Only applies to `photo` and `empty`. @default true */
  showBadge?: boolean;
  /** Called when the camera badge is clicked. */
  onBadgeClick?: () => void;
  /** Colour theme — match the surface the avatar sits on. @default 'dark' */
  theme?: AvatarTheme;
}
