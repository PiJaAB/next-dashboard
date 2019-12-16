// TODO: Fix initial "at-top" body class.

// @flow
import React, { useEffect, useContext, useState } from 'react';
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
}: Props): React$Element<'div'> {
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

  const [scrollOffset, setScrollOffset] = useState<number | null>(null);
  const [savedScrollOffset, setSavedScrollOffset] = useState<number | null>(
    null,
  );

  // When a modal is shown, we want to save the top offset and set position fixed to disable scrolling
  useEffect(() => {
    if (scrollOffset === null && !modalActive) return;
    if (modalActive) setScrollOffset(window.pageYOffset);
    else {
      setSavedScrollOffset(scrollOffset);
      setScrollOffset(null);
    }
  }, [modalActive]);

  // Once the modal isn't showing anymore, we want to scroll back to the old position, AFTER the DOM
  // has updated with the new regular positioning.
  useEffect(() => {
    if (savedScrollOffset) window.scrollTo(0, savedScrollOffset);
    setSavedScrollOffset(null);
  }, [savedScrollOffset]);

  return (
    <div
      className={[
        'dashboard',
        scrollOffset !== null && 'modal_active',
        id && `dashboard_id-${id}`,
        themeClass && `dashboard_theme-${themeClass}`,
      ]
        .filter(className => className)
        .join(' ')}
      style={
        scrollOffset != null
          ? {
              top: `-${scrollOffset}px`,
            }
          : {}
      }
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
        <Sidebar sidebarActive={sidebarActive} sidebarCompact={sidebarCompact}>
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
