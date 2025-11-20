import React from "react";

export default function TopBar({ activeMenu, topMenuItems, setActiveMenu }) {
  return (
    <header className="topbar">
      <div className="brand-area">
        <div className="logo-text" onClick={() => setActiveMenu('Lobby')}>MeruLink</div>
        <nav className="top-menu" aria-label="Main menu">
          {topMenuItems.map(item => (
            <button 
              key={item} 
              onClick={() => setActiveMenu(item)} 
              className={activeMenu === item ? 'active' : ''}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="user-block">
        <div className="name">Riad Abdo</div>
        <div className="dept">Sistemas y Tecnología</div>
      </div>
    </header>
  );
}