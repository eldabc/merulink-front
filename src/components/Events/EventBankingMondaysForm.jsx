import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMondays } from '../../utils/date-utils';
import TitleHeader from '../Shared/TitleHeader';
import FooterFormButtons from '../Shared/FooterFormButtons';

export default function BankingMondaysManager({ mode = 'create', event = [], onBack, year }) {
  const navigate = useNavigate();
  
  // 1. Inicialización Perezosa: Cargamos el estado una sola vez al montar el componente
  // Si 'event' trae datos, los transformamos inmediatamente.
  const [checkedDates, setCheckedDates] = useState(() => {
    if (mode === 'edit' && Array.isArray(event)) {
      return new Set(event.map(e => e.start.split('T')[0]));
    }
    return new Set();
  });

  const [descriptions, setDescriptions] = useState(() => {
    if (mode === 'edit' && Array.isArray(event)) {
      const initialDescs = {};
      event.forEach(e => {
        initialDescs[e.start.split('T')[0]] = e.title;
      });
      return initialDescs;
    }
    return {};
  });

  // 2. Estado derivado: Los lunes se calculan solo si cambia el año prop
  const yearMondays = useMemo(() => generateMondays(year), [year]);

  const handleCheck = (dateStr) => {
    setCheckedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateStr)) {
        newSet.delete(dateStr);
      } else {
        newSet.add(dateStr);
      }
      return newSet;
    });
  };

  const handleDescriptionChange = (dateStr, value) => {
    setDescriptions(prev => ({ ...prev, [dateStr]: value }));
  };

  const handleSave = () => {
    const payload = Array.from(checkedDates).map(date => ({
      start: date,
      title: descriptions[date] || "Lunes Bancario",
      category: 'banking-mondays'
    }));
    console.log("Datos listos para enviar:", payload);
    // Aquí llamarías a tu función de guardado del Contexto
  };

  return (
    <div className="flex flex-col h-full text-white md:min-w-7xl overflow-x-auto p-2 rounded-lg">
      <header className="mb-4">
        <TitleHeader title={mode === 'edit' ? `Editando Lunes Bancarios ${year}` : `Configuración Lunes Bancarios ${year}`} />
        <p className="text-sm text-gray-400">
          {mode === 'edit' 
            ? "Modifica los lunes bancarios ya registrados." 
            : "Selecciona los lunes que corresponden a feriados bancarios según SUDEBAN."}
        </p>
      </header>

      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto max-h-[60vh]">
        {yearMondays.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const isChecked = checkedDates.has(dateStr);

          return (
            <div key={dateStr} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isChecked ? 'bg-blue-900/20 border-l-4 border-gray-500' : 'hover:bg-gray-800'}`}>
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-pointer accent-blue-500"
                checked={isChecked}
                onChange={() => handleCheck(dateStr)}
              />
              <div className="flex flex-col min-w-[120px]">
                <span className="font-bold">{date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}</span>
                <span className="text-xs text-gray-500">Lunes</span>
              </div>
              
              <input 
                type="text"
                placeholder="Descripción del feriado..."
                className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-sm outline-none focus:border-blue-500 disabled:opacity-30 transition-opacity"
                disabled={!isChecked}
                value={descriptions[dateStr] || ''}
                onChange={(e) => handleDescriptionChange(dateStr, e.target.value)}
              />
            </div>
          );
        })}
      </div>
      
      <FooterFormButtons 
        onBack={onBack} 
        onSave={handleSave} 
        mode={mode} 
        navigate={navigate} 
        txtCreate={`Guardar Calendario ${year}`}
      />
    </div>
  );
}