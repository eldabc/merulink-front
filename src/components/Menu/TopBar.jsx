import React from "react";
import logo from './../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { menuTree } from './menuTree';
import { BellIcon } from '@heroicons/react/24/solid';

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
      <div className="user-block flex items-center gap-5 ">
        <div className="shrink-0 rounded-full bg-[#2f3d44] border border-[#ffffff21] p-2 hover:border-[#9fd8ff]">
          <BellIcon className='w-6 h-6 text-white-400' />
        </div>
        <div className="flex flex-col">
          <div className="name">Riad Abdo</div>
          <div className="dept">Sistemas y Tecnología</div>
        </div>
      </div>
    </header>
  );
}