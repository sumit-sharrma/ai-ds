import figma from '@figma/code-connect';
import React from 'react';
import Button from './Button';

figma.connect(
  Button,
  'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=3-26',
  {
    props: {
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
        Destructive: 'destructive',
      }),
      disabled: figma.enum('State', {
        Default: false,
        Hover: false,
        Pressed: false,
        Disabled: true,
      }),
    },
    example: ({ variant, disabled }) => (
      <Button variant={variant} disabled={disabled}>
        Label
      </Button>
    ),
  }
);
