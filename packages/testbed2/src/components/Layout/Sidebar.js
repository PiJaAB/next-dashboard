// @flow
import React from 'react';

import {
  NavSection,
  NavEntry,
  ThemeSelector,
  CompactButton,
} from '@pija-ab/next-dashboard';

import Search from 'src/components/Search';
import Profile from 'src/components/Profile';

export default function Nav(): React$Node {
  return (
    <>
      <div className="dashboard-sidebar-search">
        <Search />
      </div>
      <NavSection id="main">
        <NavEntry href="/dashboard" icon="home">
          Overview
        </NavEntry>
        <NavEntry href="/dashboard/realtime" icon="clock">
          Realtime
        </NavEntry>
        <NavEntry href="/dashboard/datatest" icon="users">
          Data Test
        </NavEntry>
        <NavEntry href="/dashboard/resources" icon="users">
          Resources
        </NavEntry>
        <NavEntry href="/dashboard/quality" icon="check-circle">
          Quality
        </NavEntry>
        <NavEntry href="/dashboard/volumes" icon="box">
          Volumes
        </NavEntry>
        <NavEntry href="/dashboard/leadership" icon="male">
          Leadership
        </NavEntry>
        <NavEntry href="/dashboard/statistics" icon="signal">
          Statistics
        </NavEntry>
      </NavSection>
      <NavSection id="account">
        <NavEntry href="/dashboard/settings" icon="cog">
          Settings
        </NavEntry>
        <ThemeSelector />
        <NavEntry href="/dashboard/login" icon="power-off">
          Logout
        </NavEntry>
      </NavSection>
      <NavSection id="other">
        <CompactButton />
      </NavSection>
      <div className="dashboard-sidebar-profile">
        <Profile />
      </div>
    </>
  );
}
