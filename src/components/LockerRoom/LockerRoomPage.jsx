
import { Routes, Route } from 'react-router-dom';
import LockerRoomList from './LockerRoomList';
import LockerRoomForm from './LockerRoomForm';
 

export default function LockerRoomPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<LockerRoomList />} />
          <Route path="nuevo" element={<LockerRoomForm />} />
          <Route path="ver" element={<LockerRoomForm mode="view" />} />
          <Route path="editar" element={<lockerRoomForm  mode="edit" />} />

          {/* <Route path="noche-bodas-cena-alturas" element={<EventsList categoryKeys={["wedding-nights", "dinner-heights"]} />} />
          <Route path="festivos-venezolanos-calendario-google" element={<EventsList categoryKeys={["ve-holidays", "google-calendar"]} />} />
          <Route path="cumpleaños-merú" element={<EventsList categoryKeys={["meru-birthdays"]} />} />
          <Route path="executive-mod" element={<EventsList categoryKeys={["executive-mod"]} />} />
          <Route path="lunes-bancarios" element={<EventsList categoryKeys={["banking-mondays"]} />} />

          
          <Route path="nuevo" element={<EventForm />} />
          
          <Route path="/lunes-bancarios/ver" element={<BankingMondaysForm mode="view" year={new Date().getFullYear()} />} />
          <Route path="/lunes-bancarios/edit" element={<BankingMondaysForm mode="edit" year={new Date().getFullYear()} />} /> */}
        </Routes>
      </main>
    </>
  );
}
