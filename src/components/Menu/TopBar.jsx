import { useState } from "react";
import logo from './../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { menuTree } from './menuTree';
import { BellIcon } from '@heroicons/react/24/solid';
import NotificationPanel from "../Shared/NotificationPanel";

export default function TopBar({ activeMenu, topMenuItems, setActiveMenu }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="brand-area">
        <div onClick={() => { setActiveMenu('404'); navigate('/'); }}><img  className="logo-img" src={logo} alt="MeruLink Logo" /></div>
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
        <div className="relative">
          <div 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`shrink-0 rounded-full bg-[#2f3d44] border p-2 transition-all duration-200
              ${isNotifOpen ? 'border-[#63bffd] shadow-[0_0_10px_#9fd8ff44]' : 'border-[#ffffff21] hover:border-[#9fd8ff]'}
            `}
          >
            <BellIcon className='w-7 h-7 text-white' />
            {/* Indicador de notificación */}
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-[#9fd8ff] border-2 border-[#2f3d44]"></span>
          </div>

          <NotificationPanel isOpen={isNotifOpen} />
        </div>
        <div className="flex flex-col">
          <div className="name">Riad Abdo</div>
          <div className="dept">Sistemas y Tecnología</div>
        </div>
      </div>
    </header>
  );
}