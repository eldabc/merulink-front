import React from "react";
import logo from './../assets/logo.png';

export default function TopBar({ activeMenu, topMenuItems, setActiveMenu }) {
  return (
    <header className="topbar">
      <div className="brand-area">
        <div onClick={() => setActiveMenu('Lobby')}><img  className="logo-img" src={logo} alt="MeruLink Logo" /></div>
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