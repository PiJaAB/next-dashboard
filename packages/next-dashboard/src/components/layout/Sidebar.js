// @flow
import React from 'react';

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
      {children}
    </div>
  );
};

Sidebar.defaultProps = {
  children: undefined,
};

export default Sidebar;
