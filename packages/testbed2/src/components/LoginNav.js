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
        <NavSection id="account">
          <NavEntry href="/dashboard/login" icon="power-off">
            LogIn
          </NavEntry>
          <ThemeSelector />
        </NavSection>
        <NavSection id="other">
          <CompactButton />
        </NavSection>
      </>
    );
  }
}
