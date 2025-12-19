import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsList from './EventsList';

export default function EventsPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<EventsList categoryKeys={["meru-events"]} />} />
          <Route path="noche-bodas-cena-alturas" element={<EventsList categoryKeys={["wedding-nights", "dinner-heights"]} />} />
          {/* <Route path="cena-alturas" element={<EventsList categoryKeys="dinner-heights" />} /> */}
          <Route path="feriados-venezolanos" element={<EventsList categoryKeys={["venezuelan-holidays"]} />} />
          <Route path="calendario-google" element={<EventsList categoryKeys={["google-calendar"]} />} />
          <Route path="cumpleaños-merú" element={<EventsList categoryKeys={["meru-birthdays"]} />} />
          <Route path="executive-mod" element={<EventsList categoryKeys={["executive-mod"]} />} />
        </Routes>
      </main>
    </>
  );
}
