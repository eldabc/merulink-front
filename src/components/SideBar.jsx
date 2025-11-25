import React from "react";

export default function SideBar({ currentSubmenu }) {
  
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