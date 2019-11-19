// @flow
import React from 'react';

type Props = {
  active: boolean,
};

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

const Sidebar = ({ active }: Props) => (
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
    </nav>
  </div>
);

export default Sidebar;
