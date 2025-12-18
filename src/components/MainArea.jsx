import {React, useState} from "react";
import SideBar from "./Menu/SideBar";
import Workspace from "./Workspace";
import { useLocation } from 'react-router-dom';
import { menuEvents } from "./Menu/menuEvents";

export default function MainArea({ activeMenu, activePath, onSidebarClick }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const toggleSidebar = location.pathname.startsWith('/eventos');
  
  let menuEventsItems = null;
  if (toggleSidebar) menuEventsItems = menuEvents; 

  return (
    
    <div className="main-area">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="sidebar-button lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-md shadow-md"
      > MENÚ ☰
      </button>
      
      <SideBar 
        activeMenu={activeMenu}
        activePath={activePath} 
        onItemClick={onSidebarClick}
        isSidebarOpen={isSidebarOpen}
        menu={menuEventsItems}
        toggleSidebar={toggleSidebar}
      />
      
      <main className="workspace">
        <Workspace activeMenu={activeMenu} activePath={activePath} />
      </main>
    </div>
  );
}