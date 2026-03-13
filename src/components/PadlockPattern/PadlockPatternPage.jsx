
import { Routes, Route } from 'react-router-dom';
import PadlockPatternList from './PadlockPatternList';
import PadlockPatternForm from './PadlockPatternForm';
 

export default function PadlockPatternPage() {
  return (
    <>
      <main className="flex-1 rounded p-4 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<PadlockPatternList />} />
          <Route path="nuevo" element={<PadlockPatternForm />} />
          <Route path="ver/:id" element={<PadlockPatternForm mode="view" />} />
          <Route path="editar/:id" element={<PadlockPatternForm  mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}
