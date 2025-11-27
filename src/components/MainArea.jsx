import React from "react";
import SideBar from "./SideBar";
import Workspace from "./Workspace";

export default function MainArea({ activeMenu }) {
  return (
    <div className="main-area">
      <SideBar activeMenu={activeMenu} />
      <main className="workspace">
        <Workspace activeMenu={activeMenu} />
      </main>
    </div>
  );
}