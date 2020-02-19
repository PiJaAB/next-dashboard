// TODO: Fix initial "at-top" body class.

// @flow
import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import classnames from 'classnames';

import FullscreenExitButton from '../FullscreenExitButton';

import LayoutContext, {
  useCreateLayoutContext,
} from '../../utils/layoutContext';
import DashboardContext, { LAYOUT } from '../../utils/dashboardContext';
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
  header: propHeader,
  sidebar,
  footer,
}: Props): React$Element<typeof LayoutContext.Provider> {
  const ctx = useContext(DashboardContext);
  const { [LAYOUT]: ctxProps } = ctx;
  const lctx = useCreateLayoutContext(ctxProps.initialState, ctxProps.persist);
  const {
    getState,
    theme: { class: themeClass },
    modalActive,
  } = lctx;

  const isFullscreen = lctx.getTemp('isFullscreen', false);
  const isFullscreenMoving = lctx.getTemp('fullscreen-cursor-moving', false);

  const header = !isFullscreen && propHeader;

  const sidebarActive = getState<boolean>('sidebarActive', false);
  const sidebarCompact = getState<boolean>('sidebarCompact', false);

  const toggleSidebarActive = () => {
    lctx.setState<boolean>('sidebarActive', !sidebarActive);
  };

  useEffect(() => {
    lctx.setTemp('hasHeader', Boolean(header));
  }, [header]);

  useEffect(() => {
    const { body } = document;
    if (!body) return;
    if (header && sidebar && sidebarActive) {
      body.classList.add('dashboard_sidebar_active');
    } else {
      body.classList.remove('dashboard_sidebar_active');
    }
  }, [sidebar, sidebarActive, header]);

  useEffect(() => {
    const { body } = document;
    if (!body) return;
    if (isFullscreen) {
      body.classList.add('dashboard_fullscreen');
    } else {
      body.classList.remove('dashboard_fullscreen');
    }
  }, [isFullscreen]);

  useEffect(() => {
    const { body } = document;
    if (!body) return;
    if (isFullscreenMoving) {
      body.classList.add('dashboard_fullscreen_moving');
    } else {
      body.classList.remove('dashboard_fullscreen_moving');
    }
  }, [isFullscreenMoving]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const contentEl = document.body;
    const updateFullscreen = () => {
      const fullScreenMode = Boolean(
        document.fullscreenElement ||
          // $FlowIssue: deprecated backwards compability
          document.fullscreen ||
          // $FlowIssue: deprecated backwards compability
          document.mozFullscreen ||
          // $FlowIssue: deprecated backwards compability
          document.webkitIsFullscreen,
      );
      if (fullScreenMode !== isFullscreen) {
        lctx.setTemp('isFullscreen', fullScreenMode);
      }
    };
    updateFullscreen();
    document.addEventListener('mozfullscreenchange', updateFullscreen);
    document.addEventListener('webkitfullscreenchange', updateFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreen);
    if (contentEl) {
      contentEl.addEventListener('mozfullscreenchange', updateFullscreen);
      contentEl.addEventListener('webkitfullscreenchange', updateFullscreen);
      contentEl.addEventListener('fullscreenchange', updateFullscreen);
    }
    return () => {
      document.removeEventListener('mozfullscreenchange', updateFullscreen);
      document.removeEventListener('webkitfullscreenchange', updateFullscreen);
      document.removeEventListener('fullscreenchange', updateFullscreen);
      if (contentEl) {
        contentEl.removeEventListener('mozfullscreenchange', updateFullscreen);
        contentEl.removeEventListener(
          'webkitfullscreenchange',
          updateFullscreen,
        );
        contentEl.removeEventListener('fullscreenchange', updateFullscreen);
      }
    };
  }, [isFullscreen]);

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
    <LayoutContext.Provider value={{ ...lctx, hasHeader: Boolean(header) }}>
      <div
        className={classnames(
          'dashboard',
          id && `dashboard_id-${id}`,
          themeClass && `dashboard_theme-${themeClass}`,
        )}
        ref={scrollRef}
      >
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0/css/all.min.css"
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
        <FullscreenExitButton />
        <div id="dashboard-modal-root" />
      </div>
    </LayoutContext.Provider>
  );
}

DashboardLayout.defaultProps = {
  children: undefined,
  id: undefined,
  contentContainerWidth: undefined,
  header: true,
  sidebar: undefined,
  footer: true,
  allowFullscreen: undefined,
};

export default DashboardLayout;
