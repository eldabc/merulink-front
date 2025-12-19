import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsList from './EventsList';

export default function EventsPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<EventsList categoryKey="meru-events" />} />
          <Route path="bodas" element={<EventsList categoryKey="wedding-nights" />} />
          <Route path="cena-alturas" element={<EventsList categoryKey="dinner-heights" />} />
          <Route path="feriados-venezolanos" element={<EventsList categoryKey="venezuelan-holidays" />} />
          <Route path="calendario-google" element={<EventsList categoryKey="google-calendar" />} />
          <Route path="cumpleaños-merú" element={<EventsList categoryKey="meru-birthdays" />} />
          <Route path="executive-mod" element={<EventsList categoryKey="executive-mod" />} />
        </Routes>
      </main>
    </>
  );
}
