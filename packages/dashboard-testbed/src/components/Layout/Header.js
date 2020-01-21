// @flow

import React from 'react';

import { HeaderCell } from '@pija-ab/next-dashboard';

import Search from 'src/components/Search';
import Contact from 'src/components/Contact';
import Profile from 'src/components/Profile';

export default function Header(): React$Node {
  return (
    <>
      <HeaderCell cellId="search">
        <Search />
      </HeaderCell>
      <HeaderCell cellId="contact">
        <Contact />
      </HeaderCell>
      <HeaderCell cellId="profile">
        <Profile />
      </HeaderCell>
    </>
  );
}
