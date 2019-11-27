// @flow
import React, { useEffect } from 'react';

import DashboardContext from '../../utils/dashboardContext';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import Nav, { PureNav } from '../Nav';
import SiteMessages from './SiteMessages';

export type Props = {
  children?: React$Node,
};

function DashboardLayout({
  children,
}: Props): React$Element<typeof DashboardContext.Consumer> {
  const noTransition = () => {
    const { body } = document;
    if (!body) return;
    body.classList.add('body_resizing');
    setTimeout(() => {
      body.classList.remove('body_resizing');
    });
  };

  useEffect(() => {
    window.addEventListener('resize', noTransition);
    return () => {
      window.removeEventListener('resize', noTransition);
    };
  }, []);

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
        const theme = context.theme.class;

        const toggleSidebarActive = () => {
          context.setState<boolean>('sidebarActive', !sidebarActive);
        };

        let normalChildren: ?React$Node = [];
        let navChildren: ?React$Node;
        if (Array.isArray(children)) {
          normalChildren = [];
          navChildren = [];
          children.forEach(child => {
            if (!Array.isArray(normalChildren)) {
              throw new TypeError('Expected normalChildren to be Array.');
            }
            if (!Array.isArray(navChildren)) {
              throw new TypeError('Expected navChildren to be Array.');
            }
            if (typeof child !== 'object' || typeof child.type !== 'function') {
              normalChildren.push(child);
              return;
            }
            const { prototype } = child.type;
            if (prototype instanceof Nav || prototype instanceof PureNav) {
              navChildren.push(child);
              return;
            }
            normalChildren.push(child);
          });
        } else {
          normalChildren = children;
        }

        return (
          <div className={`dashboard dashboard_theme-${theme}`}>
            <Header
              sidebarActive={sidebarActive}
              toggleSidebarActive={toggleSidebarActive}
            />
            <Sidebar
              sidebarActive={sidebarActive}
              sidebarCompact={sidebarCompact}
            >
              {navChildren}
            </Sidebar>
            <Content>
              <SiteMessages />
              {normalChildren}
            </Content>
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
