import React, { useState, useEffect, useMemo } from "react";
import { menuTree } from "./Menu/menuTree";

// Helper to build all possible paths in the tree
function buildAllPaths(node, path = []) {
  const paths = {};
  Object.keys(node)
    .filter(key => key !== "_meta")
    .forEach(key => {
      const child = node[key];
      const currentPath = [...path, key];
      const pathKey = JSON.stringify(currentPath);
      paths[pathKey] = true; // true = collapsed
      
      const hasChildren = Object.keys(child).some(k => k !== "_meta");
      if (hasChildren) {
        Object.assign(paths, buildAllPaths(child, currentPath));
      }
    });
  return paths;
}

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
            <button
              onClick={() => onItemClick(currentPath)}
              className="submenu-btn"
              style={{
                color: isActive ? "#fff" : "inherit",
                fontWeight: isActive ? "bold" : "normal"
              }}
            >
              {childMeta.label || key}
            </button>
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

export default function SideBar({ activeMenu, activePath = [], onItemClick }) {
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
    <aside className="sidebar">
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