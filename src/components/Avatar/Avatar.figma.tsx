import figma from '@figma/code-connect';
import React from 'react';
import Avatar from './Avatar';

figma.connect(
  Avatar,
  'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=22-363',
  {
    props: {
      size: figma.enum('Size', {
        'X-Large': 'xl',
        Large: 'lg',
      }),
      content: figma.enum('Content', {
        Photo: 'photo',
        Initials: 'initials',
        Empty: 'empty',
      }),
    },
    example: ({ size, content }) => {
      if (content === 'photo') {
        return (
          <Avatar
            size={size}
            content="photo"
            src="https://example.com/avatar.jpg"
            alt="User avatar"
          />
        );
      }
      if (content === 'initials') {
        return <Avatar size={size} content="initials" initials="AB" />;
      }
      return <Avatar size={size} content="empty" />;
    },
  }
);
