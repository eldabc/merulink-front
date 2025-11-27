import React from "react";
import SideBar from "./SideBar";
import Workspace from "./Workspace";

export default function MainArea({ activeMenu, activePath, onSidebarClick }) {
  return (
    <div className="main-area">
      <SideBar activeMenu={activeMenu} activePath={activePath} onItemClick={onSidebarClick} />
      <main className="workspace">
        <Workspace activeMenu={activeMenu} />
      </main>
    </div>
  );
}