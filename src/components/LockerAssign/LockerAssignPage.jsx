
import { Routes, Route } from 'react-router-dom';
import LockerAssignList from './LockerAssignList';
import LockerAssignForm from './LockerAssignForm';
 

export default function LockerAssignPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<LockerAssignList />} />
          <Route path="nuevo" element={<LockerAssignForm />} />
          <Route path="ver" element={<LockerAssignForm mode="view" />} />
          <Route path="editar" element={<LockerAssignForm  mode="edit" />} />

        </Routes>
      </main>
    </>
  );
}
