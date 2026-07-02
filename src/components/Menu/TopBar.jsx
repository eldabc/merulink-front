import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import logo from './../../assets/logo.png';
import { menuTree, topMenuItems, findMenuContextByPath } from './menuTree';
import { BellIcon } from '@heroicons/react/24/solid';
import NotificationPanel from "../Shared/NotificationPanel";
import NameApp from "../Shared/NameApp";

export default function TopBar() {

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Derive active menu from the current URL
  const context = findMenuContextByPath(location.pathname);
  const activeMenu = context?.activeMenu || null;

  const menuById = Object.fromEntries(menuTree.map((item) => [item.id, item]));

  return (
    <header className="topbar">
      <div className="brand-area">
        <div onClick={() => navigate('/')}>
          {/* <img className="logo-img" src={logo} alt="MeruLink Logo" /> */}
          <NameApp />
        </div>
        <nav className="top-menu" aria-label="Main menu">
          {topMenuItems.map(item => (
            <button
              key={item}
              onClick={() => navigate(menuById[item]?.path || '/')}
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
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-[#9fd8ff] border-2 border-[#2f3d44]"></span>
          </div>

          <NotificationPanel isOpen={isNotifOpen} />
        </div>
        <div className="flex flex-col">
          <div className="name">{user?.name}</div>
          <div className="dept">{user?.department}</div>
        </div>
      </div>
    </header>
  );
}