// @flow
import React from 'react';
import Head from 'next/head';

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
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
        />
      </Head>
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
