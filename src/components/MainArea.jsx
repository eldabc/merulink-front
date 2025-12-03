import {React, useState} from "react";
import SideBar from "./SideBar";
import Workspace from "./Workspace";

export default function MainArea({ activeMenu, activePath, onSidebarClick }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
        isSidebarOpen={isSidebarOpen} />
      <main className="workspace">
        <Workspace activeMenu={activeMenu} />
      </main>
    </div>
  );
}