import React, { useState, useEffect } from 'react';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Content from './components/layout/Content';
import Footer from './components/layout/Footer';
import Start from './components/Start';

import './styles/index.scss';

const App = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    if (window.innerWidth > 640) {
      setSidebarActive(true);
    }
  }, []);

  return (
    <div className="site">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar active={sidebarActive} />
      <Content>
        <Start />
      </Content>
      <Footer />
    </div>
  );
};

export default App;
