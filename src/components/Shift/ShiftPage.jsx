import { Routes, Route } from 'react-router-dom';
import ShiftList from './ShiftList';
import ShiftForm from './ShiftForm';
 

export default function ShiftPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<ShiftList />} />
          <Route path="nuevo" element={<ShiftForm />} />
          <Route path="ver/:id" element={<ShiftForm mode="view" />} />
          <Route path="editar/:id" element={<ShiftForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
