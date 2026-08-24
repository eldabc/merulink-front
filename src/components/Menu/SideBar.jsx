import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { findMenuContextByPath } from "../../utils/menu-utils";
import { buildAllPaths } from "../../utils/sidebar-menu-utils";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

export default function SideBar({ isSidebarOpen }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { menu } = useAuth(); // Menú del usuario (ya filtrado por permisos en el backend)
  const context = findMenuContextByPath(pathname, menu);

  const activeMenu = context?.activeMenu || null;
  const activePath = context?.activePath || [];

  // Rama del sidebar: hijos del módulo activo del menú superior
  const branch = menu.find((item) => item.id === activeMenu)?.children || [];

  const initialCollapsed = useMemo(() => buildAllPaths(branch), [branch]);
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  // Reset collapsed state when the computed initialCollapsed actually changes
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

  // Show sidebar when the active module has children to show
  const shouldShow = activeMenu && branch.length > 0 && activeMenu !== 'IA';

  if (!shouldShow) {
    return <aside className="sidebar hidden" />;
  }

  const toggleCollapse = (pathKey) => {
    setCollapsed(prev => ({
      ...prev,
      [pathKey]: !prev[pathKey]
    }));
  };

  // Breadcrumb building helper
  const breadcrumbSegments = activeMenu ? [activeMenu, ...activePath] : [];

  return (
    <aside className={` sidebar
        bg-gray-800 text-white h-full transition-transform duration-300
        lg:translate-x-0 lg:static lg:block
        fixed top-0 left-0 w-64 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}  text-sm sm:text-base
      `}>
      <div className="submenu-title">Secciones</div>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
        {breadcrumbSegments.length > 0 ? (
          breadcrumbSegments.map((seg, idx) => {
            const isLast = idx === breadcrumbSegments.length - 1;
            return (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span
                  style={{
                    color: isLast ? '#666' : '#cfeeff',
                    textDecoration: isLast ? 'none' : 'underline',
                    cursor: isLast ? 'default' : 'pointer',
                  }}
                >
                  {seg}
                </span>
                {!isLast && <span style={{ margin: '0 6px', color: '#666' }}>/</span>}
              </span>
            );
          })
        ) : (
          'Inicio'
        )}
      </div>
      <div>{renderNode(branch, [], null, activePath, toggleCollapse, collapsed)}</div>
    </aside>
  );
}