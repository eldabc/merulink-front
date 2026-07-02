import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter, useLocation } from 'react-router-dom';
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from './context/AuthContext';
import { GlobalDataProvider } from "./context/GlobalDataContext";

import TopBar from "./components/Menu/TopBar";
import MainArea from "./components/MainArea";
import Footer from "./components/Footer"
import { topMenuItems, findMenuContextByPath } from "./components/Menu/menuTree";
import ParticlesCanvas from "./components/Shared/ParticlesCanvas";

export default function App() {
  return (
    <div className="merulink-root">
      <AuthProvider>
        <GlobalDataProvider>
          <NotificationProvider>
            <BrowserRouter>
              <AppRouterSync />
            </BrowserRouter>

            <ParticlesCanvas />  
          </NotificationProvider>
        </GlobalDataProvider>
      </AuthProvider>
    </div>
  );
}

function AppRouterSync() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("404");
  const [activePath, setActivePath] = useState([]);

  useEffect(() => {
    const pathname = location.pathname || '/';
    const context = findMenuContextByPath(pathname);

    if (context) {
      setActiveMenu(context.activeMenu);
      setActivePath(context.activePath || []);
    } else {
      setActiveMenu('404');
      setActivePath([]);
    }
  }, [location.pathname]);

  const handleMenuClick = useCallback((menuItem) => {
    setActiveMenu(menuItem);
    setActivePath([]);
  }, []);

  const handleSidebarItemClick = useCallback((itemPath) => {
    setActivePath(itemPath);
  }, []);

  return (
    <>
      <TopBar 
        activeMenu={activeMenu}
        topMenuItems={topMenuItems}
        setActiveMenu={handleMenuClick} 
      />

      <MainArea 
        activeMenu={activeMenu}
        activePath={activePath}
        onSidebarClick={handleSidebarItemClick}
      />

      <Footer />
    </>
  );
}