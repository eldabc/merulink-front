import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsList from './EventsList';

export default function EventsPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<EventsList categoryKey="meru-events" />} />
          <Route path="" element={<EventsList categoryKey="meru-events" />} />
          <Route path="bodas" element={<EventsList categoryKey="wedding-nights" />} />
          <Route path="otros" element={<EventsList categoryKey="otros" />} />
        </Routes>
      </main>
    </>
  );
}
