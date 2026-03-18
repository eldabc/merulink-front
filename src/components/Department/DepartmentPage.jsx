import { Routes, Route } from 'react-router-dom';
import DepartmentList from './DepartmentList';
import DepartmentForm from './DepartmentForm';
 

export default function DepartmentPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<DepartmentList />} />
          <Route path="nuevo" element={<DepartmentForm />} />
          <Route path="ver/:id" element={<DepartmentForm mode="view" />} />
          <Route path="editar/:id" element={<DepartmentForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
