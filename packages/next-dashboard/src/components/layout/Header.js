// @flow
import React from 'react';
import Link from 'next/link';

import DashboardContext from '../../utils/dashboardContext';

type Props = {
  toggleSidebarActive: () => void,
  children: React$Node,
};

// TODO: dashboard home url config

const Header = ({ toggleSidebarActive, children }: Props) => (
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
                <div className="hamburger-menu">
                  <label>
                    <input type="checkbox" onClick={toggleSidebarActive} />
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="line--1"
                        d="M0 40h62c13 0 6 28-4 18L35 35"
                      />
                      <path className="line--2" d="M0 50h70" />
                      <path
                        className="line--3"
                        d="M0 60h62c13 0 6-28-4-18L35 65"
                      />
                    </svg>
                  </label>
                </div>
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
