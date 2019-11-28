// @flow
import React from 'react';
import Link from 'next/link';

import Search from '../Search';
import Contact from '../Contact';
import Profile from '../Profile';

type Props = {
  toggleSidebarActive: () => void,
  sidebarActive: boolean,
};

// TODO: dashboard home url config

const Header = ({ toggleSidebarActive, sidebarActive }: Props) => (
  <header className="dashboard-header">
    <div className="container container-unlimited">
      <div className="grid align-items-center">
        <div className="cell dashboard-header-cell dashboard-header-cell_sidebar">
          <button
            type="button"
            className="dashboard-header-sidebar-button"
            onClick={toggleSidebarActive}
          >
            <span
              className={[
                'dashboard-sidebar-button-icon',
                'fa',
                sidebarActive ? 'fa-times' : 'fa-bars',
              ].join(' ')}
            />
          </button>
        </div>
        <div className="cell dashboard-header-cell dashboard-header-cell_logo">
          <Link href="/dashboard">
            <a className="dashboard-header-logo">
              <img src="/images/logo.png" alt="XVision" />
            </a>
          </Link>
        </div>
        <div className="cell dashboard-header-cell dashboard-header-cell_search">
          <Search />
        </div>

        <div className="cell dashboard-header-cell dashboard-header-cell_contact">
          <Contact />
        </div>
        <div className="cell dashboard-header-cell dashboard-header-cell_profile">
          <Profile />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
