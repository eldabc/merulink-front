import { Routes, Route } from 'react-router-dom';
import PositionList from './PositionList';
import PositionForm from './PositionForm';
 

export default function PositionPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<PositionList />} />
          <Route path="nuevo" element={<PositionForm />} />
          <Route path="ver/:id" element={<PositionForm mode="view" />} />
          <Route path="editar/:id" element={<PositionForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
