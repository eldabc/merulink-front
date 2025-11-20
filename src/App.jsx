import React, { useState, useCallback } from "react";
import ParticlesCanvas from "./components/ParticlesCanvas";
import TopBar from "./components/TopBar";
import MainArea from "./components/MainArea";

// El componente raíz de la aplicación
export default function App() {
  const [activeMenu, setActiveMenu] = useState("Lobby");

  // Datos de navegación
  const topMenuItems = ["IA", "Empleados", "Infraestructura", "Inventario", "Whatsapp", "Configuración", "Documentos"];
  const submenus = {
    Empleados: ["Lista", "Roles", "Casilleros"],
    Infraestructura: ["APs Internet", "Domotica", "Mantenimiento"],
    Inventario: ["Stock", "Entradas", "Salidas"],
    Configuración: ["Sistema", "Seguridad", "Notificaciones"],
    Documentos: ["Memos", "Reglamento"],
    Whatsapp: ["Recepcion", "Ventas", "AyB"],
  };
  const currentSubmenu = submenus[activeMenu] || [];

  const handleMenuClick = useCallback((menuItem) => {
    setActiveMenu(menuItem);
  }, []);

  return (
    <div className="merulink-root">

      <ParticlesCanvas />

      <TopBar 
        activeMenu={activeMenu}
        topMenuItems={topMenuItems}
        setActiveMenu={handleMenuClick} 
      />

      <MainArea 
        activeMenu={activeMenu}
        currentSubmenu={currentSubmenu} 
      />
    </div>
  );
}