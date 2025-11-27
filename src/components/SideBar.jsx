import React from "react";
import { menuTree } from "./Menu/menuTree";

function renderNode(node, level = 1) {
  return Object.keys(node).map((key) => {
    const child = node[key];
    const hasChildren = child && Object.keys(child).length > 0;

    return (
      <div key={key} style={{ marginBottom: 6 }}>
        <button className="submenu-btn">{key}</button>
        {hasChildren && (
          <div style={{ marginLeft: 12 }}>
            {renderNode(child, level + 1)}
          </div>
        )}
      </div>
    );
  });
}

export default function SideBar({ activeMenu }) {
  const node = menuTree[activeMenu] || {};

  // If no sections for this menu, hide the sidebar
  if (!activeMenu || Object.keys(node).length === 0) {
    return <aside className="sidebar hidden" />;
  }

  return (
    <aside className="sidebar">
      <div className="submenu-title">Secciones</div>
      <div>{renderNode(node)}</div>
    </aside>
  );
}