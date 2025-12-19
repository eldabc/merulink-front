import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter, useLocation } from 'react-router-dom';
import ParticlesCanvas from "./components/ParticlesCanvas";
import TopBar from "./components/Menu/TopBar";
import MainArea from "./components/MainArea";
import Footer from "./components/Footer"
import { menuTree } from "./components/Menu/menuTree";
import { NotificationProvider } from "./context/NotificationContext";
// import Calendar from "./components/Calendar/Calendar";

export default function App() {
  return (
    <div className="merulink-root">
      <NotificationProvider>
        <BrowserRouter>
          <AppRouterSync />
        </BrowserRouter>

        <ParticlesCanvas />
        <Footer />
      </NotificationProvider>
    </div>
  );
}

function AppRouterSync() {
  // This component lives inside the Router so it can use hooks
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("Lobby");
  const [activePath, setActivePath] = useState([]);

  // derive menu state from current location.pathname
  useEffect(() => {
    const pathname = location.pathname || '/';

    // find matching node in menuTree
    const findInNode = (node, pathSoFar = []) => {
      for (const key of Object.keys(node)) {
        if (key === '_meta') continue;
        const child = node[key];
        const meta = child._meta || {};
        if (meta.path === pathname) {
          return [...pathSoFar, key];
        }
        const hasChildren = Object.keys(child).some(k => k !== '_meta');
        if (hasChildren) {
          const res = findInNode(child, [...pathSoFar, key]);
          if (res) return res;
        }
      }
      return null;
    };

    // search top-level menus
    let matchedTop = null;
    let matchedPath = null;
    for (const topKey of Object.keys(menuTree)) {
      const topNode = menuTree[topKey];
      if (topNode && topNode._meta && pathname === topNode._meta.path) {
        matchedTop = topKey;
        matchedPath = [];
        break;
      }
      const res = findInNode(topNode, []);
      if (res) {
        matchedTop = topKey;
        matchedPath = res;
        break;
      }
    }

    if (matchedTop) {
      setActiveMenu(matchedTop);
      setActivePath(matchedPath || []);
    } else {
      // default to Lobby if nothing matches
      setActiveMenu('Lobby');
      setActivePath([]);
    }
  }, [location.pathname]);

  const topMenuItems = Object.keys(menuTree);

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
    </>
  );
}