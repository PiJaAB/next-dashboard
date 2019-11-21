// TODO: Initial load and resize classes...
// TODO: Save sidebar and color state in storage...

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

  const toggleSidebarActive = () => {
    setSidebarActive(!sidebarActive);
  };

  const toggleSidebarCompact = () => {
    setSidebarCompact(!sidebarCompact);
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
    setTimeout(() => {
      document.getElementsByClassName('site')[0].classList.remove('site_initial-load');
    }, 10);
    const onResize = () => {
      noTransition();
    };
    if (window.innerWidth > 640) {
      setSidebarActive(true);
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="site site_initial-load">
      <Header toggleSidebarActive={toggleSidebarActive} />
      <Sidebar
        sidebarActive={sidebarActive}
        sidebarCompact={sidebarCompact}
        toggleSidebarCompact={toggleSidebarCompact}
      />
      <Content>
        <Start />
      </Content>
      <Footer />
    </div>
  );
};

export default App;
