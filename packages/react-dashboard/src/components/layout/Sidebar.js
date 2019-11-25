// TODO: Icon font...

// @flow
import React from 'react';

type Props = {
  sidebarActive: boolean,
  sidebarCompact: boolean,
  toggleSidebarCompact: () => void,
  toggleTheme: () => void,
  children?: React$Node,
};

const Sidebar = ({
  sidebarActive,
  sidebarCompact,
  toggleSidebarCompact,
  toggleTheme,
  children,
}: Props) => {
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
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
      />
      <nav className="dashboard-sidebar-menu">
        {children}
        <div className="dashboard-sidebar-menu-item-space" />
        <button
          type="button"
          className="button"
          onClick={toggleTheme}
          style={{ width: '100%' }}
        >
          <span className="fa fa-palette" />
        </button>
        <button
          type="button"
          className="button"
          onClick={toggleSidebarCompact}
          style={{ width: '100%' }}
        >
          <span className="fa fa-exchange-alt" />
        </button>
      </nav>
    </div>
  );
};

Sidebar.defaultProps = {
  children: undefined,
};

export default Sidebar;
