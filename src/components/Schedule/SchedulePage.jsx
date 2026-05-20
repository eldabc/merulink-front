import { Routes, Route } from 'react-router-dom';
import ScheduleList from './ScheduleList';
import ScheduleForm from './ScheduleForm';
 

export default function SchedulePage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<ScheduleList />} />
          <Route path="nuevo" element={<ScheduleForm />} />
          <Route path="ver/:id" element={<ScheduleForm mode="view" />} />
          <Route path="editar/:id" element={<ScheduleForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
