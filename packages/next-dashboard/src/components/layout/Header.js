// @flow
import React, { useContext } from 'react';
import Link from 'next/link';

import DashboardContext from '../../utils/dashboardContext';
import HamburgerMenu from '../HamburgerMenu';

type Props = {
  toggleSidebarActive: () => void,
  sidebarActive: boolean,
  children: React$Node,
};

// TODO: dashboard home url config

function Header({ toggleSidebarActive, sidebarActive, children }: Props) {
  const ctx = useContext(DashboardContext);
  if (ctx == null) throw new Error('Header: no dashboard context in scope');

  const theme = ctx.theme.class;
  const logo = `logo${theme !== 'default' ? `-${theme}` : ''}.png`;

  const { name } = ctx != null ? ctx.branding : {};

  return (
    <header className="dashboard-header">
      <div className="header-content-container">
        <div className="grid grid-x3-medium grid-x4-large align-items-center">
          <div className="cell dashboard-header-cell dashboard-header-cell_sidebar">
            <HamburgerMenu
              sidebarActive={sidebarActive}
              toggleSidebarActive={toggleSidebarActive}
            />
          </div>
          <div className="cell dashboard-header-cell dashboard-header-cell_logo">
            <Link href="/dashboard">
              <a className="dashboard-header-logo">
                <img src={`/images/${logo}`} alt={name || 'Logo'} />
              </a>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}

export default Header;
