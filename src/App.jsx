import React, { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ParticlesCanvas from "./components/ParticlesCanvas";
import TopBar from "./components/TopBar";
import MainArea from "./components/MainArea";
import Footer from "./components/Footer"
import { menuTree } from "./components/Menu/menuTree";
import { NotificationProvider } from "./components/Context/NotificationContext";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("Lobby");
  const [activePath, setActivePath] = useState([]); // breadcrumb

  // Datos de navegación: derive everything desde el árbol `menuTree`
  const topMenuItems = Object.keys(menuTree);

  const handleMenuClick = useCallback((menuItem) => {
    setActiveMenu(menuItem);
    setActivePath([]); // reset breadcrumb when clicking topbar
  }, []);

  const handleSidebarItemClick = useCallback((itemPath) => {
    setActivePath(itemPath);
  }, []);

  return (
    
    <div className="merulink-root">
      <NotificationProvider>
      
        <BrowserRouter>
        {/* Navegación con React Router DOM */}

        {/* 🌐 Definición de las Rutas */}
        <Routes>
        
        {/* Ruta para la Propuesta B: http://localhost:3000/diseno-b */}

        </Routes>
      </BrowserRouter>

        <ParticlesCanvas />

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
      </NotificationProvider>
    </div>
  );
}