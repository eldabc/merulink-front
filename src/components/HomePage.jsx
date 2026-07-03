// import React, { Suspense, lazy } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useNotification } from '../context/NotificationContext';
// import { EventProvider } from '../context/EventContext';
// import MainLayout from './Shared/MainLayout';
// import NameApp from './Shared/NameApp';
// import GuestBar from './Shared/GuestBar';

// const Calendar = lazy(() => import('./Calendar/Calendar'));

// /**
//  * HomePage — renders at "/".
//  * - If authenticated: wraps Calendar in MainLayout (TopBar + SideBar + Footer).
//  * - If guest: shows Calendar with login/register links, no app chrome.
//  */
// export default function HomePage() {
//   const { isAuthenticated, authLoading } = useAuth();
//   const { showNotification } = useNotification();

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-[#1e2022] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
//       </div>
//     );
//   }

//   const calendarContent = (
//     <Suspense fallback={<div className="p-6 text-gray-400">Cargando calendario...</div>}>
//       <div className="content-center">
//         <Calendar />
//       </div>
//     </Suspense>
//   );

//   if (isAuthenticated) {
//     return (
//       <EventProvider showNotification={showNotification}>
//         <MainLayout>
//           {calendarContent}
//         </MainLayout>
//       </EventProvider>
//     );
//   }

//   // Guest view: Calendar + auth links
//   return (
//     <EventProvider showNotification={showNotification}>
//       <div className="min-h-screen bg-[#1e2022] flex flex-col">
//         {/* Guest header with auth links */}
//         <GuestBar />

//         {/* Calendar content */}
//         <main className="workspace flex-1">
//           {calendarContent}
//         </main>
//       </div>
//     </EventProvider>
//   );
// }
