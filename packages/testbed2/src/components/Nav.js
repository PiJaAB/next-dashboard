// @flow
import React from 'react';

import {
  PureNav as DashNav,
  NavSection,
  NavEntry,
  ThemeSelector,
  CompactButton,
} from '@pija-ab/next-dashboard';

type Props = {};

export default class Nav extends DashNav<Props> {
  render() {
    return (
      <>
        <NavSection id="main">
          <NavEntry href="/dashboard" icon="home">
            Overview
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
          <NavEntry href="/dashboard/realtime" icon="clock">
            Realtime
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
      </>
    );
  }
}
