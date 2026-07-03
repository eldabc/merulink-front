import { Routes, Route, Navigate } from 'react-router-dom';
import ScheduleList from './ScheduleList';
import ScheduleForm from './ScheduleForm';
import ProtectedElement from '../Shared/ProtectedElement';

export default function SchedulePage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<ProtectedElement permission="view-schedules" element={<ScheduleList />} />} />
          <Route path="nuevo" element={<ProtectedElement permission="create-schedules" element={<ScheduleForm />} />} />
          <Route path="ver/:id" element={<ProtectedElement permission="view-schedules" element={<ScheduleForm mode="view" />} />} />
          <Route path="editar/:id" element={<ProtectedElement permission="update-schedules" element={<ScheduleForm  mode="edit" />} />} />
        </Routes>
      </main>
    </>
  );
}
