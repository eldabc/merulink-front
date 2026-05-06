import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { EVENT_CAT } from '../../utils/eventConfig';

import EventsList from './EventsList';
import EventForm from './EventForm';
import BankingMondaysForm from './BankingMondays/BankingMondaysForm'; 

export default function EventsPage() {
  const year = new Date().getFullYear();
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path={EVENT_CAT.M_EVENTS.path} element={<EventsList categoryKeys={[EVENT_CAT.M_EVENTS.key]} year={year} />} />
          <Route 
            path={EVENT_CAT.W_NIGHTS.path} 
            element={<EventsList categoryKeys={[
              EVENT_CAT.W_NIGHTS.key, 
              EVENT_CAT.D_HEIGHTS.key
            ]} year={year} />} 
          />
          
          <Route 
            path={EVENT_CAT.VE_HOLIDAYS.path} 
            element={<EventsList categoryKeys={[
              EVENT_CAT.VE_HOLIDAYS.key, 
              EVENT_CAT.G_CALENDAR.key
            ]} year={year} />} 
          />

          <Route path={EVENT_CAT.M_BIRTHDAYS.path} element={<EventsList categoryKeys={[EVENT_CAT.M_BIRTHDAYS.key]} year={year} />} />
          <Route path={EVENT_CAT.E_MOD.path} element={<EventsList categoryKeys={[EVENT_CAT.E_MOD.key]} year={year} />} />
          <Route path={EVENT_CAT.B_MONDAYS.path} element={<EventsList categoryKeys={[EVENT_CAT.B_MONDAYS.key]} year={year} />} />

          <Route path="ver/:id" element={<EventForm mode="view" />} />
          <Route path="nuevo" element={<EventForm />} />
          <Route path="editar/:id" element={<EventForm  mode="edit" />} />
          
          <Route path={`${EVENT_CAT.B_MONDAYS.path}/nuevo`} element={<BankingMondaysForm year={year} />} />
          <Route path={`${EVENT_CAT.B_MONDAYS.path}/ver`} element={<BankingMondaysForm mode="view" year={year} />} />
          <Route path={`${EVENT_CAT.B_MONDAYS.path}/edit`} element={<BankingMondaysForm mode="edit" year={year} />} />
        </Routes>
      </main>
    </>
  );
}
