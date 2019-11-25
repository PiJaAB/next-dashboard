// @flow
import React from 'react';

import DashHeaderContact from '../DashHeaderContact';
import DashHeaderProfile from '../DashHeaderProfile';

type Props = {
  toggleSidebarActive: () => void,
};

const Header = ({ toggleSidebarActive }: Props) => (
  <header className="dashboard-header">
    <div className="container container-unlimited">
      <div className="grid align-items-center">
        <div className="cell flex-basis-auto">
          <button type="button" onClick={toggleSidebarActive}>
            <span className="fa fa-exchange-alt" />
          </button>
        </div>
        <div className="cell flex-basis-auto">Dashboard</div>
        <div
          className="cell flex-basis-auto flex-grow-1"
          style={{ maxWidth: '500px' }}
        >
          <input type="text" placeholder="Search" />
        </div>
        <div className="cell flex-basis-auto" style={{ marginLeft: 'auto' }}>
          <DashHeaderContact />
        </div>
        <div className="cell flex-basis-auto">
          <DashHeaderProfile />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
