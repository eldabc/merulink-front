import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../Menu/TopBar';
import SideBar from '../Menu/SideBar';
import Footer from '../Footer';

/**
 * MainLayout — wraps all authenticated pages with the global chrome:
 * TopBar (auto-detects active menu from URL),
 * SideBar (auto-detects which branch to show from URL),
 * Footer, and the routed page content.
 *
 * Can be used in two ways:
 * 1. As a route layout (with <Outlet />) — when nested inside <Routes>
 * 2. As a direct wrapper (with children) — for programmatic use
 */
export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1e2022] flex flex-col">
      <TopBar />

      <div className="flex flex-1">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="sidebar-button lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-md shadow-md"
        >
          MENÚ ☰
        </button>

        <SideBar isSidebarOpen={isSidebarOpen} />

        <main className="workspace flex-1">
          {children || <Outlet />}
        </main>
      </div>

      <Footer />
    </div>
  );
}