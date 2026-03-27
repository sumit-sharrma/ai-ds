import figma from '@figma/code-connect';
import React from 'react';
import ListItem from './ListItem';

figma.connect(
  ListItem,
  'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=20-3390',
  {
    props: {
      label: figma.string('Text-label'),
      value: figma.string('Text-action'),
      showValue: figma.boolean('Show-action'),
      showBorder: figma.boolean('Show-border'),
    },
    example: ({ label, value, showValue, showBorder }) => (
      <ListItem
        label={label}
        value={value}
        showValue={showValue}
        showBorder={showBorder}
      />
    ),
  }
);
