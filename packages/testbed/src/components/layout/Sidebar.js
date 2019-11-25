// @flow
import React from 'react';

import Search from '../Search';
import Profile from '../Profile';

type Props = {
  sidebarActive: boolean,
  sidebarCompact: boolean,
  toggleSidebarCompact: () => void,
  toggleTheme: () => void,
};

const Sidebar = ({ sidebarActive, sidebarCompact, toggleSidebarCompact, toggleTheme }: Props) => {
  const main = [
    {
      title: 'Overview',
      path: '/Overview',
      icon: 'home',
    },
    {
      title: 'Resources',
      path: '/Resources',
      icon: 'users',
    },
    {
      title: 'Quality',
      path: '/Quality',
      icon: 'check-circle',
    },
    {
      title: 'Volumes',
      path: '/Volumes',
      icon: 'box',
    },
    {
      title: 'Leadership',
      path: '/Leadership',
      icon: 'male',
    },
    {
      title: 'Statistics',
      path: '/Statistics',
      icon: 'signal',
    },
    {
      title: 'Realtime',
      path: '/Realtime',
      icon: 'clock',
    },
  ];

  const account = [
    {
      title: 'Settings',
      path: '/Settings',
      icon: 'cog',
    },
    {
      title: 'Theme',
      click: toggleTheme,
      icon: 'palette',
    },
    {
      title: 'Logout',
      path: '/Logout',
      icon: 'power-off',
    },
  ];

  const other = [
    {
      title: 'Sidebar',
      click: toggleSidebarCompact,
      icon: 'exchange-alt',
    },
  ];

  return (
    <div
      className={[
        'site-sidebar',
        sidebarActive && 'site-sidebar_active',
        sidebarCompact && 'site-sidebar_compact',
      ]
        .filter(className => className)
        .join(' ')}
    >
      <div className="site-sidebar-search">
        <Search />
      </div>
      <SidebarMenu id="main" items={main} />
      <SidebarMenu id="account" items={account} />
      <SidebarMenu id="other" items={other} />
      <div className="site-sidebar-profile">
        <Profile />
      </div>
    </div>
  );
};

const SidebarMenu = ({ id, items }) => (
  <nav
    className={[
      'site-sidebar-menu',
      id && `site-sidebar-menu_${id}`,
    ]
      .filter(className => className)
      .join(' ')}
    >
    {items.map(item => (
      <div className="site-sidebar-menu-item" key={item.title}>
        <SidebarMenuItemButton {...item} />
      </div>
    ))}
  </nav>
);

const SidebarMenuItemButton = ({ title, path, click, icon }) => {
  const Element = path ? 'a' : 'button';
  const props = {};
  if (Element === 'a') {
    props.href = path;
  } else if (Element === 'button') {
    props.type = 'button';
    props.onClick = click;
  }
  return (
    <Element
      {...props}
      className={[
        'button',
        'site-sidebar-menu-item-button',
        path === '/Overview' && 'site-sidebar-menu-item-button_active',
      ]
        .filter(className => className)
        .join(' ')}
    >
      <span className={`site-sidebar-menu-item-button-icon fa fa-${icon}`} />
      <span className="site-sidebar-menu-item-button-text">{title}</span>
    </Element>
  );
};

export default Sidebar;
