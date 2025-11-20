import React from "react";

export default function SideBar({ currentSubmenu }) {
  // Nota: El manejo de clics para los submenús no estaba en el original, 
  // por lo que los botones aún no tienen lógica de navegación.
  
  if (currentSubmenu.length === 0) {
    return <aside className="sidebar hidden" />;
  }

  return (
    <aside className="sidebar">
      <div className="submenu-title">Secciones</div>
      {currentSubmenu.map(s => (
        <button key={s} className="submenu-btn">{s}</button>
      ))}
    </aside>
  );
}