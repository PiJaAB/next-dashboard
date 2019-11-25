// TODO: Icon font...

// @flow
import React from 'react';

type Props = {
  sidebarActive: boolean,
  sidebarCompact: boolean,
  toggleSidebarCompact: () => void,
  toggleTheme: () => void,
};

const Sidebar = ({ sidebarActive, sidebarCompact, toggleSidebarCompact, toggleTheme }: Props) => {
  const links = [
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

  const accountLinks = [
    {
      title: 'Settings',
      path: '/Settings',
      icon: 'cog',
    },
    {
      title: 'Logout',
      path: '/Logout',
      icon: 'power-off',
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
      <nav className="site-sidebar-menu">
        {links.map(({title, path, icon }) => (
          <div
            className={[
              'site-sidebar-menu-item',
              path === '/Overview' && 'site-sidebar-menu-item_active',
            ]
              .filter(className => className)
              .join(' ')}
              key={path}
            >
            <a
              href={path}
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
            </a>
          </div>
        ))}
        <div className="site-sidebar-menu-item-space" />
        {accountLinks.map(({title, path, icon }) => (
          <div
            className={[
              'site-sidebar-menu-item',
              path === '/Overview' && 'site-sidebar-menu-item_active',
            ]
              .filter(className => className)
              .join(' ')}
              key={path}
            >
            <a
              href={path}
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
            </a>
          </div>
        ))}
        <div className="site-sidebar-menu-item-space" />
        <button type="button" className="button" onClick={toggleTheme} style={{ width: '100%' }}>
          <span className="fa fa-palette" />
        </button>
        <button type="button" className="button" onClick={toggleSidebarCompact} style={{ width: '100%' }}>
          <span className="fa fa-exchange-alt" />
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
