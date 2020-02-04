// TODO: Fix initial "at-top" body class.

// @flow
import React, { useEffect, useContext } from 'react';
import Head from 'next/head';

import DashboardContext from '../../utils/dashboardContext';
import toClassName from '../../utils/toClassName';
import useScrollFix from '../../utils/useScrollFix';
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
}: Props): React$Element<'div'> {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new TypeError('Dashboard Layout needs to be in a Dashboard Context');
  }

  const {
    getState,
    theme: { class: themeClass },
    modalActive,
  } = context;

  const sidebarActive = getState<boolean>('sidebarActive', false);
  const sidebarCompact = getState<boolean>('sidebarCompact', false);

  const toggleSidebarActive = () => {
    context.setState<boolean>('sidebarActive', !sidebarActive);
  };

  useEffect(() => {
    const { body } = document;
    if (!body) return;
    if (sidebar && sidebarActive) {
      body.classList.add('dashboard_sidebar_active');
    } else {
      body.classList.remove('dashboard_sidebar_active');
    }
  }, [sidebar, sidebarActive]);

  useEffect(() => {
    const { body } = document;
    if (!body) return;
    if (sidebarCompact) {
      body.classList.add('sidebar_compact');
    } else {
      body.classList.remove('sidebar_compact');
    }
  }, [sidebarCompact]);

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
    window.addEventListener('resize', noTransition());
    return () => {
      window.removeEventListener('resize', noTransition());
    };
  }, []);

  useEffect(() => {
    if (!modalActive) {
      atTop();
      window.addEventListener('scroll', atTop);
    }
    return () => {
      if (!modalActive) window.removeEventListener('scroll', atTop);
    };
  }, [modalActive]);

  const scrollRef = useScrollFix(modalActive);

  return (
    <div
      className={toClassName([
        'dashboard',
        id && `dashboard_id-${id}`,
        themeClass && `dashboard_theme-${themeClass}`,
      ])}
      ref={scrollRef}
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
          {sidebar && (
            <Sidebar
              sidebarActive={sidebarActive}
              sidebarCompact={sidebarCompact}
            >
              {sidebar}
            </Sidebar>
          )}
          {header}
        </Header>
      )}
      <Content contentContainerWidth={contentContainerWidth} header={header}>
        <SiteMessages />
        {children}
      </Content>
      {footer && <Footer />}
      <div id="dashboard-modal-root" />
    </div>
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
