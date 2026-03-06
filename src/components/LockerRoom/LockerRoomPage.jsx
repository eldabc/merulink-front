
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
          <Route path="ver/:id" element={<LockerRoomForm mode="view" />} />
          <Route path="editar/:id" element={<LockerRoomForm  mode="edit" />} />

        </Routes>
      </main>
    </>
  );
}
