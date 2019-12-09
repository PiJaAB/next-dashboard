// TODO: Fix initial "at-top" body class.

// @flow
import React, { useEffect } from 'react';
import Head from 'next/head';

import DashboardContext from '../../utils/dashboardContext';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import SiteMessages from './SiteMessages';

export type Props = {
  children?: React$Node,
  id?: string,
  contentContainerWidth?:
    | 'extra-narrow'
    | 'narrow'
    | 'normal'
    | 'wide'
    | 'extra-wide',
  header?: React$Node,
  sidebar?: React$Node,
  footer?: boolean,
};

function DashboardLayout({
  children,
  id,
  contentContainerWidth,
  header,
  sidebar,
  footer,
}: Props): React$Element<typeof DashboardContext.Consumer> {
  const atTop = () => {
    const { body } = document;
    if (!body) return;
    if (window.scrollY <= 0) {
      body.classList.add('body_at-top');
    } else {
      body.classList.remove('body_at-top');
    }
  };

  const noTransition = () => {
    const { body } = document;
    if (!body) return;
    body.classList.add('body_resizing');
    setTimeout(() => {
      body.classList.remove('body_resizing');
    });
  };

  useEffect(() => {
    atTop();
    window.addEventListener('scroll', atTop);
    window.addEventListener('resize', noTransition);
    return () => {
      window.removeEventListener('scroll', atTop);
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

        return (
          <div
            className={[
              'dashboard',
              id && `dashboard_id-${id}`,
              theme && `dashboard_theme-${theme}`,
            ]
              .filter(className => className)
              .join(' ')}
          >
            <Head>
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
              />
            </Head>
            {header && (
              <Header
                sidebarActive={sidebarActive}
                toggleSidebarActive={toggleSidebarActive}
              >
                {header}
              </Header>
            )}
            {sidebar && (
              <Sidebar
                sidebarActive={sidebarActive}
                sidebarCompact={sidebarCompact}
              >
                {sidebar}
              </Sidebar>
            )}
            <Content contentContainerWidth={contentContainerWidth}>
              <SiteMessages />
              {children}
            </Content>
            {footer && <Footer />}
            <div id="dashboard-modal-root" />
          </div>
        );
      }}
    </DashboardContext.Consumer>
  );
}

DashboardLayout.defaultProps = {
  children: undefined,
  id: undefined,
  contentContainerWidth: undefined,
  header: true,
  sidebar: undefined,
  footer: true,
};

export default DashboardLayout;
