// TODO: Fix initial "at-top" body class.

import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import classnames from 'classnames';

import ReactTooltip from 'react-tooltip';
import FullscreenExitButton from '../FullscreenExitButton';

import LayoutContext from '../../utils/layoutContext';
import useScrollFix from '../../hooks/useScrollFix';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import SiteMessages from './SiteMessages';
import ConfirmDialogue from './ConfirmDialogue';

export type Props = React.PropsWithChildren<{
  id?: string;
  contentContainerWidth?:
    | 'extra-narrow'
    | 'narrow'
    | 'normal'
    | 'wide'
    | 'extra-wide';
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: boolean;
}>;

function DashboardLayout({
  children,
  id,
  contentContainerWidth,
  header: propHeader = true,
  sidebar,
  footer = true,
}: Props): JSX.Element {
  const {
    getState,
    setState,
    getTemp,
    setTemp,
    theme: { class: themeClass },
    modalActive,
  } = useContext(LayoutContext);

  const isFullscreen = getTemp('isFullscreen', false);
  const isFullscreenMoving = getTemp('fullscreen-cursor-moving', false);

  const header = !isFullscreen && propHeader;

  const sidebarActive = getState<boolean>('sidebarActive', false);
  const sidebarCompact = getState<boolean>('sidebarCompact', false);

  const toggleSidebarActive = () => {
    setState<boolean>('sidebarActive', !sidebarActive);
  };

  useEffect(() => {
    setTemp('hasHeader', Boolean(header));
  }, [header, setTemp]);

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
    const patchedDocument = document as typeof document & {
      mozFullscreen?: boolean;
      webkitIsFullscreen?: boolean;
    };
    const updateFullscreen = () => {
      const fullScreenMode = Boolean(
        patchedDocument.fullscreenElement ||
          // $FlowIssue: deprecated backwards compability
          patchedDocument.fullscreen ||
          // $FlowIssue: deprecated backwards compability
          patchedDocument.mozFullscreen ||
          // $FlowIssue: deprecated backwards compability
          patchedDocument.webkitIsFullscreen,
      );
      if (fullScreenMode !== isFullscreen) {
        setTemp('isFullscreen', fullScreenMode);
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
  }, [isFullscreen, setTemp]);

  useEffect(() => {
    const { body } = document;
    if (!body) return;
    if (sidebarCompact) {
      body.classList.add('sidebar_compact');
    } else {
      body.classList.remove('sidebar_compact');
    }
  }, [sidebarCompact]);

  useEffect(() => {
    const { body } = document;
    if (!body) return undefined;
    let timeoutId: number | null = null;
    const noTransition = () => {
      if (timeoutId == null) {
        body.classList.add('body_resizing');
      } else {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        body.classList.remove('body_resizing');
        timeoutId = null;
      }, 100);
    };
    window.addEventListener('resize', noTransition);
    return () => {
      body.classList.remove('body_resizing');
      window.removeEventListener('resize', noTransition);
    };
  }, []);

  useEffect(() => {
    const atTop = () => {
      const { body } = document;
      if (!body) return;
      if (window.scrollY <= 0) {
        body.classList.add('body_at-top');
      } else {
        body.classList.remove('body_at-top');
      }
    };
    if (modalActive) return undefined;
    atTop();
    window.addEventListener('scroll', atTop);
    return () => {
      if (!modalActive) window.removeEventListener('scroll', atTop);
    };
  }, [modalActive]);

  const scrollRef = useScrollFix(modalActive);

  return (
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
      <ConfirmDialogue />
      <div id="dashboard-modal-root" />
      <ReactTooltip className="tooltip-style" />
    </div>
  );
}

export default DashboardLayout;
