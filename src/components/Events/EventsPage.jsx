import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsList from './EventsList';
import EventForm from './EventForm';
import BankingMondaysForm from './BankingMondays/BankingMondaysForm'; 
import { EVENT_CATEGORIES } from '../../utils/eventConfig';

export default function EventsPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path={EVENT_CATEGORIES.M_EVENTS.path} element={<EventsList categoryKeys={[EVENT_CATEGORIES.M_EVENTS.key]} />} />
          <Route 
            path={EVENT_CATEGORIES.W_NIGHTS.path} 
            element={<EventsList categoryKeys={[
              EVENT_CATEGORIES.W_NIGHTS.key, 
              EVENT_CATEGORIES.D_HEIGHTS.key
            ]} />} 
          />
          
          <Route 
            path={EVENT_CATEGORIES.VE_HOLIDAYS.path} 
            element={<EventsList categoryKeys={[
              EVENT_CATEGORIES.VE_HOLIDAYS.key, 
              EVENT_CATEGORIES.G_CALENDAR.key
            ]} />} 
          />

          <Route path={EVENT_CATEGORIES.M_BIRTHDAYS.path} element={<EventsList categoryKeys={[EVENT_CATEGORIES.M_BIRTHDAYS.key]} />} />
          <Route path={EVENT_CATEGORIES.E_MOD.path} element={<EventsList categoryKeys={[EVENT_CATEGORIES.E_MOD.key]} />} />
          <Route path={EVENT_CATEGORIES.B_MONDAYS.path} element={<EventsList categoryKeys={[EVENT_CATEGORIES.B_MONDAYS.key]} />} />

          <Route path="ver/:id" element={<EventForm mode="view" />} />
          <Route path="nuevo" element={<EventForm />} />
          <Route path="editar/:id" element={<EventForm  mode="edit" />} />
          
          <Route path={`${EVENT_CATEGORIES.B_MONDAYS.path}/nuevo`} element={<BankingMondaysForm year={new Date().getFullYear()} />} />
          <Route path={`${EVENT_CATEGORIES.B_MONDAYS.path}/ver`} element={<BankingMondaysForm mode="view" year={new Date().getFullYear()} />} />
          <Route path={`${EVENT_CATEGORIES.B_MONDAYS.path}/edit`} element={<BankingMondaysForm mode="edit" year={new Date().getFullYear()} />} />
        </Routes>
      </main>
    </>
  );
}
