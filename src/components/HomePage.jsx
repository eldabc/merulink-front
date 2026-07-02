import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { EventProvider } from '../context/EventContext';
import MainLayout from './Shared/MainLayout';
import NameApp from './Shared/NameApp';

const Calendar = lazy(() => import('./Calendar/Calendar'));

/**
 * HomePage — renders at "/".
 * - If authenticated: wraps Calendar in MainLayout (TopBar + SideBar + Footer).
 * - If guest: shows Calendar with login/register links, no app chrome.
 */
export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const { showNotification } = useNotification();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e2022] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const calendarContent = (
    <Suspense fallback={<div className="p-6 text-gray-400">Cargando calendario...</div>}>
      <div className="content-center">
        <Calendar />
      </div>
    </Suspense>
  );

  if (isAuthenticated) {
    return (
      <EventProvider showNotification={showNotification}>
        <MainLayout>
          {calendarContent}
        </MainLayout>
      </EventProvider>
    );
  }

  // Guest view: Calendar + auth links
  return (
    <EventProvider showNotification={showNotification}>
      <div className="min-h-screen bg-[#1e2022] flex flex-col">
        {/* Guest header with auth links */}
        <header className="w-full bg-[#2f3d44] border-b border-[#43474a] px-6 py-3 flex items-center justify-between">
          <NameApp />
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="text-sm bg-[#008a9e] hover:bg-[#9fd8ff] [text-shadow:_0_2px_2px_rgba(0,0,0,0.8)] !text-gray-200 px-4 py-1.5 rounded-md transition-colors font-medium"
            >
              Registrarse
            </Link>
          </div>
        </header>

        {/* Calendar content */}
        <main className="workspace flex-1">
          {calendarContent}
        </main>
      </div>
    </EventProvider>
  );
}
