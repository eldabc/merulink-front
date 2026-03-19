import { Routes, Route } from 'react-router-dom';
import SubDepartmentList from './SubDepartmentList';
import SubDepartmentForm from './SubDepartmentForm';
 

export default function DepartmentPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<SubDepartmentList />} />
          <Route path="nuevo" element={<SubDepartmentForm />} />
          <Route path="ver/:id" element={<SubDepartmentForm mode="view" />} />
          <Route path="editar/:id" element={<SubDepartmentForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
