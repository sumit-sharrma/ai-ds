import figma from '@figma/code-connect';
import React from 'react';
import EditProfile from './EditProfile';

figma.connect(
  EditProfile,
  'https://www.figma.com/design/EqXU8re4hw6XM6OrwaBbu8/Project?node-id=80-164',
  {
    example: () => (
      <EditProfile
        theme="dark"
        avatarSrc="https://example.com/avatar.jpg"
        avatarAlt="Profile photo"
        fullName="Your Name"
        phoneNumber="0000-0000-0000"
        email="youremail@email.com"
        username="@yourname"
        onBack={() => {}}
        onSave={() => {}}
        onDeleteAccount={() => {}}
      />
    ),
  }
);
