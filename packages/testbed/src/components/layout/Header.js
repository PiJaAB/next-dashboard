// @flow
import React from 'react';

import SiteHeaderContact from '../SiteHeaderContact';
import SiteHeaderProfile from '../SiteHeaderProfile';

type Props = {
  toggleSidebar: () => void,
};

const Header = ({ toggleSidebar }: Props) => (
  <header className="site-header">
    <div className="container container-unlimited">
      <div className="grid align-items-center">
        <div className="cell flex-basis-auto">
          <button type="button" onClick={toggleSidebar}>Sidebar</button>
        </div>
        <div className="cell flex-basis-auto">
          Dashboard
        </div>
        <div className="cell flex-basis-auto flex-grow-1" style={{ maxWidth: '500px' }}>
          <input type="text" placeholder="Search" />
        </div>
        <div className="cell flex-basis-auto" style={{ marginLeft: 'auto' }}>
          <SiteHeaderContact />
        </div>
        <div className="cell flex-basis-auto">
          <SiteHeaderProfile />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
