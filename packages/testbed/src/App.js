// TODO: Initial load and resize classes...
// TODO: Save sidebar and color state in storage...
// TODO: Icon font...

import React, { useState, useEffect } from 'react';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Content from './components/layout/Content';
import Footer from './components/layout/Footer';
import Start from './components/Start';

import './styles/index.scss';

const App = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);

  const themes = ['default', 'dark'];

  const toggleSidebarActive = () => {
    setSidebarActive(!sidebarActive);
  };

  const toggleSidebarCompact = () => {
    setSidebarCompact(!sidebarCompact);
  };

  const setStoredTheme = theme => localStorage.theme = theme;
  const getStoredTheme = () => localStorage.theme;
  const addThemeBodyClass = () => document.body.classList.add(`body_theme-${getStoredTheme()}`);
  const removeThemeBodyClass = () => document.body.classList.remove(`body_theme-${getStoredTheme()}`);

  const setInitialTheme = () => {
    const theme = getStoredTheme();
    if (!theme || !themes.includes(theme)) setStoredTheme(themes[0]);
    addThemeBodyClass();
  };

  const setTheme = theme => {
    removeThemeBodyClass();
    setStoredTheme(theme);
    addThemeBodyClass();
  };

  const toggleTheme = () => {
    const theme = getStoredTheme();
    for (var i = 0; i < themes.length; i++) {
      if (theme === themes[i]) {
        if (i + i > themes.length - 1) setTheme(themes[0]);
        else setTheme(themes[i + 1]);
      }
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
    setInitialTheme();
    if (window.innerWidth > 640) {
      setSidebarActive(true);
    }

    setTimeout(() => {
      document.getElementsByClassName('site')[0].classList.remove('site_initial-load');
    }, 10);

    const onResize = () => {
      noTransition();
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="site site_initial-load">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
      <Header toggleSidebarActive={toggleSidebarActive} />
      <Sidebar
        sidebarActive={sidebarActive}
        sidebarCompact={sidebarCompact}
        toggleSidebarCompact={toggleSidebarCompact}
        toggleTheme={toggleTheme}
      />
      <Content>
        <Start />
      </Content>
      <Footer />
    </div>
  );
};

export default App;
