import React, { useState, useEffect, useMemo } from "react";
import { menuTree } from "./menuTree";
import { buildAllPaths } from "../../utils/sidebar-menu-utils";
import { NavLink } from 'react-router-dom';

function renderNode(node, path = [], onItemClick, activePath, toggleCollapse, collapsed) {
  return Object.keys(node)
    .filter(key => key !== "_meta") // Skip metadata
    .map((key) => {
      const child = node[key];
      const childMeta = child._meta || {};
      const hasChildren = Object.keys(child).some(k => k !== "_meta");
      const currentPath = [...path, key];
      const isActive = JSON.stringify(activePath) === JSON.stringify(currentPath);
      const isCollapsed = collapsed[JSON.stringify(currentPath)] !== false;

      return (
        <div key={key} style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {hasChildren && (
              <button className="arrow-btn"
                onClick={() => toggleCollapse(JSON.stringify(currentPath))}
              >
                {isCollapsed ? "▶" : "▼"}
              </button>
            )}
            {!hasChildren && <div style={{ width: 20 }}></div>}
            {childMeta.path ? (
              <NavLink
                to={childMeta.path}
                className={({ isActive: navActive }) => `submenu-btn ${navActive ? 'active' : ''}`}
                style={({ isActive: navActive }) => ({
                  color: (isActive || navActive) ? "#fff" : "inherit",
                  fontWeight: (isActive || navActive) ? "bold" : "normal",
                  // borderLeft: (isActive || navActive) ? '1px solid #ffffff' : '1px solid transparent',
                  paddingLeft: 8
                })}
              >
                {childMeta.label || key}
              </NavLink>
            ) : (
              <button
                onClick={() => onItemClick && onItemClick(currentPath)}
                className={`submenu-btn ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? "#fff" : "inherit",
                  fontWeight: isActive ? "bold" : "normal",
                  // borderLeft: isActive ? '1px solid #ffffff' : '1px solid transparent',
                  paddingLeft: 8
                }}
              >
                {childMeta.label || key}
              </button>
            )}
          </div>
            {hasChildren && !isCollapsed && (
            <div style={{ marginLeft: 20 }}>
              {renderNode(child, currentPath, onItemClick, activePath, toggleCollapse, collapsed)}
            </div>
          )}
        </div>
      );
    });
}

export default function SideBar({ activeMenu, activePath = [], onItemClick, isSidebarOpen }) {
  const node = menuTree[activeMenu] || {};
  
  // Memoize the initial collapsed state
  const initialCollapsed = useMemo(() => buildAllPaths(node), [activeMenu]);
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  // Reset collapsed state when activeMenu changes
  useEffect(() => {
    setCollapsed(initialCollapsed);
  }, [activeMenu, initialCollapsed]);

  // If no sections for this menu, hide the sidebar
  if (!activeMenu || Object.keys(node).length === 0 || activeMenu === "Lobby" || activeMenu === "IA") {
    return <aside className="sidebar hidden" />;
  }

  const toggleCollapse = (pathKey) => {
    setCollapsed(prev => ({
      ...prev,
      [pathKey]: !prev[pathKey]
    }));
  };

  return (
    <aside className={` sidebar
        bg-gray-800 text-white h-full transition-transform duration-300
        lg:translate-x-0 lg:static lg:block
        fixed top-0 left-0 w-64 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}  text-sm sm:text-base
      `}>
      <div className="submenu-title">Secciones</div>
      {/* Para poder clickar los breadcrumbs */}
      <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
        {activeMenu !== 'Lobby' ? (
          (() => {
            const safeActivePath = Array.isArray(activePath) ? activePath : [];
            const segments = [activeMenu, ...safeActivePath];
            return segments.map((seg, idx) => {
              const isLast = idx === segments.length - 1;
              const handleClick = () => {
                if (!onItemClick) return;
                if (idx === 0) {
                  // top-level clicked -> clear activePath
                  onItemClick([]);
                } else {
                  // build subpath inside activeMenu
                  const subpath = segments.slice(1, idx + 1);
                  onItemClick(subpath);
                }
              };

              return (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <button className="breadcrumb-btn-link"
                    onClick={handleClick}
                    style={{
                      color: isLast ? '#666' : '#cfeeff',
                      textDecoration: isLast ? 'none' : 'underline',
                    }}
                  >
                    {seg}
                  </button>
                  {!isLast && <span style={{ margin: '0 6px', color: '#666' }}>/</span>}
                </span>
              );
            });
          })()
        ) : (
          'Inicio'
        )}
      </div>
      <div>{renderNode(node, [], onItemClick, activePath, toggleCollapse, collapsed)}</div>
    </aside>
  );
}