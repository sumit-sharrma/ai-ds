import figma from '@figma/code-connect';
import React from 'react';
import IconButton from './IconButton';

/** Placeholder icon — swap for the actual icon from your icon library. */
const PlaceholderIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

figma.connect(
  IconButton,
  'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=19-3354',
  {
    props: {
      variant: figma.enum('Type', {
        Primary: 'primary',
        Secondary: 'secondary',
        Ghost: 'ghost',
      }),
      size: figma.enum('Size', {
        'X-Small': 'xs',
        Small: 'sm',
        Medium: 'md',
        Large: 'lg',
      }),
      disabled: figma.enum('State', {
        Default: false,
        Hover: false,
        Pressed: false,
        Disabled: true,
      }),
    },
    example: ({ variant, size, disabled }) => (
      <IconButton
        variant={variant}
        size={size}
        disabled={disabled}
        aria-label="Action"
        icon={<PlaceholderIcon />}
      />
    ),
  }
);
