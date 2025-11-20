import React from "react";
import SideBar from "./SideBar";
import Workspace from "./Workspace";

export default function MainArea({ activeMenu, currentSubmenu }) {
  return (
    <div className="main-area">
      <SideBar currentSubmenu={currentSubmenu} />
      <main className="workspace">
        <Workspace activeMenu={activeMenu} />
      </main>
    </div>
  );
}