// @flow
import React from 'react';

import Search from '../Search';
import Profile from '../Profile';

type Props = {
  sidebarActive: boolean,
  sidebarCompact: boolean,
  children?: React$Node,
};

const Sidebar = ({ sidebarActive, sidebarCompact, children }: Props) => {
  return (
    <div
      className={[
        'dashboard-sidebar',
        sidebarActive && 'dashboard-sidebar_active',
        sidebarCompact && 'dashboard-sidebar_compact',
      ]
        .filter(className => className)
        .join(' ')}
    >
      <div className="dashboard-sidebar-search">
        <Search />
      </div>
      {children}
      <div className="dashboard-sidebar-profile">
        <Profile />
      </div>
    </div>
  );
};

Sidebar.defaultProps = {
  children: undefined,
};

export default Sidebar;
