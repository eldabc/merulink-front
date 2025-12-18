import React from "react";
import logo from './../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { menuTree } from './menuTree';

export default function TopBar({ activeMenu, topMenuItems, setActiveMenu }) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="brand-area">
        <div onClick={() => { setActiveMenu('Lobby'); navigate('/'); }}><img  className="logo-img" src={logo} alt="MeruLink Logo" /></div>
        <nav className="top-menu" aria-label="Main menu">
          {topMenuItems.map(item => (
            <button 
              key={item} 
              onClick={() => {
                setActiveMenu(item);
                const path = menuTree[item]?._meta?.path || '/';
                navigate(path);
              }}
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