import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { EventProvider } from '../context/EventContext';
import MainLayout from './Shared/MainLayout';

const Calendar = lazy(() => import('./Calendar/Calendar'));

/**
 * HomePage — renders at "/".
 * - If authenticated: wraps Calendar in MainLayout (TopBar + SideBar + Footer).
 * - If guest: redirects to /login via Navigate (URL changes to /login).
 */
export default function HomePage() {
  const { isAuthenticated, authLoading } = useAuth();
  const { showNotification } = useNotification();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1e2022] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <EventProvider showNotification={showNotification}>
      <MainLayout>
        <Suspense fallback={<div className="p-6 text-gray-400">Cargando calendario...</div>}>
          <div className="content-center">
            <Calendar />
          </div>
        </Suspense>
      </MainLayout>
    </EventProvider>
  );
}
