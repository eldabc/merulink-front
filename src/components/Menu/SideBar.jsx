import React, { useState, useEffect, useMemo } from "react";
import { menuTree } from "./menuTree";
import { buildAllPaths } from "../../utils/sidebar-menu-utils";
import { NavLink } from 'react-router-dom';

function renderNode(nodes, path = [], onItemClick, activePath, toggleCollapse, collapsed) {
  return (nodes || []).map((node) => {
    const hasChildren = Boolean(node.children?.length);
    const currentPath = [...path, node.id];
    const isActive = JSON.stringify(activePath) === JSON.stringify(currentPath);
    const isCollapsed = collapsed[JSON.stringify(currentPath)] !== false;

    return (
      <div key={node.id} style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {hasChildren ? (
            <>
              <button className="skip-style-btn arrow-btn" onClick={() => toggleCollapse(JSON.stringify(currentPath))}>
                {isCollapsed ? "▶" : "▼"}
              </button>

              <button
                onClick={() => toggleCollapse(JSON.stringify(currentPath))}
                className={`submenu-btn ${isActive ? 'active' : ''}`}
                style={{
                  textAlign: 'left',
                  background: 'transparent',
                  paddingLeft: 8,
                  color: isActive ? '#fff' : 'inherit',
                  fontWeight: isActive ? 'bold' : 'normal'
                }}
              >
                {node.label || node.id}
              </button>
            </>
          ) : (
            <>
              <div style={{ width: 20 }} />
              <NavLink
                to={node.path || '#'}
                className={({ isActive: navActive }) => `submenu-btn ${navActive ? 'active' : ''}`}
                style={({ isActive: navActive }) => ({
                  color: (isActive || navActive) ? "#fff" : "inherit",
                  fontWeight: (isActive || navActive) ? "bold" : "normal",
                  paddingLeft: 8
                })}
              >
                {node.label || node.id}
              </NavLink>
            </>
          )}
        </div>

        {hasChildren && !isCollapsed && (
          <div style={{ marginLeft: 20 }}>
            {renderNode(node.children, currentPath, onItemClick, activePath, toggleCollapse, collapsed)}
          </div>
        )}
      </div>
    );
  });
}

export default function SideBar({ activeMenu, activePath = [], onItemClick, isSidebarOpen, menu, toggleSidebar }) {
  const branch = Array.isArray(menu) ? menu : (menuTree.find((item) => item.id === activeMenu)?.children || []);

  const initialCollapsed = useMemo(() => buildAllPaths(branch), [branch]);
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  // Reset collapsed state when the computed initialCollapsed actually changes.
  // Avoid blindly calling setCollapsed every render (which can happen when
  // callers pass a fresh `menu` object each render) to prevent update loops.
  useEffect(() => {
    const currKeys = Object.keys(collapsed);
    const initKeys = Object.keys(initialCollapsed);
    let different = false;
    if (currKeys.length !== initKeys.length) different = true;
    else {
      for (const k of initKeys) {
        if (collapsed[k] !== initialCollapsed[k]) { different = true; break; }
      }
    }
    if (different) setCollapsed(initialCollapsed);
  }, [initialCollapsed]);

  if ((!activeMenu || branch.length === 0 || activeMenu === "404" || activeMenu === "IA") && !toggleSidebar) {
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
        {activeMenu !== '404' ? (
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
      <div>{renderNode(branch, [], onItemClick, activePath, toggleCollapse, collapsed)}</div>
    </aside>
  );
}