// @flow
import React from 'react';
import Link from 'next/link';

import DashboardContext from '../../utils/dashboardContext';
import HamburgerMenu from '../HamburgerMenu';

type Props = {
  toggleSidebarActive: () => void,
  sidebarActive: boolean,
  children: React$Node,
};

// TODO: dashboard home url config

const Header = ({ toggleSidebarActive, sidebarActive, children }: Props) => (
  <DashboardContext.Consumer>
    {context => {
      if (!context) {
        throw new TypeError('Header needs to be in a Dashboard Context');
      }
      const theme = context.theme.class;
      const logo = `logo${theme !== 'default' ? `-${theme}` : ''}.png`;
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
                    <img src={`/images/${logo}`} alt="XVision" />
                  </a>
                </Link>
              </div>
              {children}
            </div>
          </div>
        </header>
      );
    }}
  </DashboardContext.Consumer>
);

export default Header;
