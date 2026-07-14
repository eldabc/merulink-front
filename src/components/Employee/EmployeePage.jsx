import { Routes, Route } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import ProtectedElement from '../Shared/ProtectedElement';

export default function EmployeePage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          {/* <Route path="/" element={<ProtectedElement permission="view-employees" element={<EmployeeList />} />} /> */}
          <Route path="/" element={<EmployeeList />} />
          <Route path="nuevo" element={<ProtectedElement permission="create-employees" element={<EmployeeForm />} />} />
          <Route path="ver/:id" element={<ProtectedElement permission="view-employees" element={<EmployeeForm mode="view" />} />} />
          <Route path="editar/:id" element={<ProtectedElement permission="edit-employees" element={<EmployeeForm mode="edit" />} />} />
        </Routes>
      </main>
    </>
  );
}
