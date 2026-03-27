import figma from '@figma/code-connect';
import React from 'react';
import Header from './Header';

figma.connect(
  Header,
  'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=21-217',
  {
    example: () => (
      <Header
        title="Page Title"
        onBack={() => {}}
      />
    ),
  }
);
