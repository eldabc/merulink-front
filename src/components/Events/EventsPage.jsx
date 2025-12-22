import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsList from './EventsList';
import EventForm from './EventForm';
import { EventProvider } from '../../context/EventContext';
import { INITIAL_EVENTS } from '../../utils/StaticData/event-utils';
import { useNotification } from '../../context/NotificationContext';

export default function EventsPage() {
  const { showNotification } = useNotification();
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<EventsList categoryKeys={["meru-events"]} />} />
          <Route path="noche-bodas-cena-alturas" element={<EventsList categoryKeys={["wedding-nights", "dinner-heights"]} />} />
          <Route path="feriados-venezolanos" element={<EventsList categoryKeys={["ve-holidays"]} />} />
          <Route path="calendario-google" element={<EventsList categoryKeys={["google-calendar"]} />} />
          <Route path="cumpleaños-merú" element={<EventsList categoryKeys={["meru-birthdays"]} />} />
          <Route path="executive-mod" element={<EventsList categoryKeys={["executive-mod"]} />} />

          <Route path="nuevo" element={
            <EventProvider initialData={INITIAL_EVENTS} showNotification={showNotification}>
              <EventForm />
            </EventProvider>
          } />
        </Routes>
      </main>
    </>
  );
}
