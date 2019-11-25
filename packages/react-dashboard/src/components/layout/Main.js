// @flow

import React from 'react';
import DashboardContext from '../../utils/dashboardContext';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

export type Props = {
  children?: React$Node,
};

function DashboardLayout({
  children,
}: Props): React$Element<typeof DashboardContext.Consumer> {
  return (
    <DashboardContext.Consumer>
      {context => {
        if (!context) {
          throw new TypeError(
            'Dashboard Layout needs to be in a Dashboard Context',
          );
        }

        /*
          I really really really really really don't think this is neat and tidy code.
          I have no choice.
          The tools chosen against my will is Prettier, and apparently Prettier knows
          better than me.
        */
        const sidebarActive = context.getState<boolean>('sidebarActive', false);
        const sidebarCompact = context.getState<boolean>(
          'sidebarCompact',
          false,
        );

        const toggleSidebarActive = () => {
          context.setState<boolean>('sidebarActive', !sidebarActive);
        };

        const toggleSidebarCompact = () => {
          context.setState<boolean>('sidebarCompact', !sidebarCompact);
        };

        return (
          <div className="site site_initial-load">
            <Header toggleSidebarActive={toggleSidebarActive} />
            <Sidebar
              sidebarActive={sidebarActive}
              sidebarCompact={sidebarCompact}
              toggleSidebarCompact={toggleSidebarCompact}
            />
            <Content>{children}</Content>
            <Footer />
          </div>
        );
      }}
    </DashboardContext.Consumer>
  );
}

DashboardLayout.defaultProps = {
  children: undefined,
};

export default DashboardLayout;
