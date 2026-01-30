import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsList from './EventsList';
import EventForm from './EventForm';
import { EventProvider } from '../../context/EventContext';
import { useNotification } from '../../context/NotificationContext';
import BankingMondaysForm from './BankingMondays/BankingMondaysForm'; 

export default function EventsPage() {
  const { showNotification } = useNotification();
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <EventProvider showNotification={showNotification}>
          <Routes>
            <Route path="/" element={<EventsList categoryKeys={["meru-events"]} />} />
            <Route path="noche-bodas-cena-alturas" element={<EventsList categoryKeys={["wedding-nights", "dinner-heights"]} />} />
            <Route path="festivos-venezolanos-calendario-google" element={<EventsList categoryKeys={["ve-holidays", "google-calendar"]} />} />
            {/* <Route path="calendario-google" element={<EventsList categoryKeys={["google-calendar"]} />} /> */}
            <Route path="cumpleaños-merú" element={<EventsList categoryKeys={["meru-birthdays"]} />} />
            <Route path="executive-mod" element={<EventsList categoryKeys={["executive-mod"]} />} />
            <Route path="lunes-bancarios" element={<EventsList categoryKeys={["banking-mondays"]} />} />

            <Route path="nuevo" element={<EventForm />} />
            <Route path="/lunes-bancarios/nuevo" element={<BankingMondaysForm year={new Date().getFullYear()} />} />
            <Route path="/lunes-bancarios/ver" element={<BankingMondaysForm mode="view" year={new Date().getFullYear()} />} />
            <Route path="/lunes-bancarios/edit" element={<BankingMondaysForm mode="edit" year={new Date().getFullYear()} />} />
          </Routes>
        </EventProvider>
      </main>
    </>
  );
}
