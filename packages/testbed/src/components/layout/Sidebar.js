// @flow
import React from 'react';

type Props = {
  active: boolean,
};

const Sidebar = ({ active }: Props) => {
  const links = [
    'Overview',
    'Resources',
    'Quality',
    'Volumes',
    'Leadership',
    'Statistics',
    'Realtime',
  ];

  const accountLinks = [
    'Settings',
    'Logout',
  ];

  const toggleTheme = () => document.body.classList.toggle('body_theme-dark');

  return (
    <div
      className={[
        'site-sidebar',
        active && 'site-sidebar_active',
      ]
        .filter(className => className)
        .join(' ')}
    >
      <nav className="site-sidebar-menu">
        {links.map(link => (
          <div className="site-sidebar-menu-item" key={link}>
            <a href={`/${link.toLowerCase()}`} className="button">{link}</a>
          </div>
        ))}
        <div className="site-sidebar-menu-item-space" />
        {accountLinks.map(link => (
          <div className="site-sidebar-menu-item" key={link}>
            <a href={`/${link.toLowerCase()}`} className="button">{link}</a>
          </div>
        ))}
        <div className="site-sidebar-menu-item-space" />
        <button type="button" className="button" onClick={toggleTheme} style={{ width: '100%' }}>Toggle Theme</button>
      </nav>
    </div>
  );
};

export default Sidebar;
