
import { Routes, Route } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
 

export default function LockerAssignPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="nuevo" element={<EmployeeForm />} />
          <Route path="ver/:id" element={<EmployeeForm mode="view" />} />
          <Route path="editar/:id" element={<EmployeeForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
