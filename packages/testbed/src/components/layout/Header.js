// @flow
import React from 'react';

import Search from '../Search';
import Contact from '../Contact';
import Profile from '../Profile';

type Props = {
  sidebarActive: boolean,
  toggleSidebarActive: () => void,
};

const Header = ({ sidebarActive, toggleSidebarActive }: Props) => (
  <header className="site-header">
    <div className="container container-unlimited">
      <div className="grid align-items-center">
        <div className="cell site-header-cell site-header-cell_sidebar">
          <button
            type="button"
            className="site-header-sidebar-button"
            onClick={toggleSidebarActive}
          >
            <span
              className={[
                'site-header-sidebar-button-icon',
                'fa',
                !sidebarActive && 'fa-bars',
                sidebarActive && 'fa-times',
              ]
                .filter(className => className)
                .join(' ')}
              />
          </button>
        </div>
        <div className="cell site-header-cell site-header-cell_logo">
          <a href="/" className="color-text">Dashboard</a>
        </div>
        <div className="cell site-header-cell site-header-cell_search">
          <Search />
        </div>
        <div className="cell site-header-cell site-header-cell_contact">
          <Contact />
        </div>
        <div className="cell site-header-cell site-header-cell_profile">
          <Profile />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
