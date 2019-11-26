// @flow
import React from 'react';
import Link from 'next/link';

import Search from '../Search';
import Contact from '../Contact';
import Profile from '../Profile';

type Props = {
  toggleSidebarActive: () => void,
};

// TODO: dashboard home url config

const Header = ({ toggleSidebarActive }: Props) => (
  <header className="dashboard-header">
    <div className="container container-unlimited">
      <div className="grid align-items-center">
        <div className="cell dashboard-header-cell dashboard-header-cell_sidebar">
          <button type="button" onClick={toggleSidebarActive}>
            <span className="fa fa-exchange-alt" />
          </button>
        </div>
        <div className="cell dashboard-header-cell dashboard-header-cell_logo">
          <Link href="/dashboard">
            <a>Dashboard</a>
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
