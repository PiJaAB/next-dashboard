// @flow
import React from 'react';
/*:: import * as R from 'react'; */

type Props = {
  sidebarActive: boolean,
  sidebarCompact: boolean,
  children?: R.Node,
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

export default Sidebar;
