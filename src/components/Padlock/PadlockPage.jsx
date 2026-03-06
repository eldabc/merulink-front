
import { Routes, Route } from 'react-router-dom';
import PadlockList from './PadlockList';
import PadlockForm from './PadlockForm';
 

export default function PadlockPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<PadlockList />} />
          <Route path="nuevo" element={<PadlockForm />} />
          <Route path="ver/:id" element={<PadlockForm mode="view" />} />
          <Route path="editar/:id" element={<PadlockForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
