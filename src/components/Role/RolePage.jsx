import { Routes, Route } from 'react-router-dom';
import RoleList from './RoleList';
import RoleForm from './RoleForm';
 
export default function RolePage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<RoleList />} />
          <Route path="nuevo" element={<RoleForm />} />
          <Route path="ver/:id" element={<RoleForm mode="view" />} />
          <Route path="editar/:id" element={<RoleForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
