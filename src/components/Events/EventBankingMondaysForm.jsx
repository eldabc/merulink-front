import { useEffect, useState, useMemo } from 'react';
import { generateMondays } from '../../utils/date-utils';


export default function EventBankingMondaysForm() {
 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMondays, setSelectedMondays] = useState({}); // { "2026-01-12": "Día de la Epifanía" }

  const yearMondays = useMemo(() => generateMondays(selectedYear), [selectedYear]);

  const handleToggleMonday = (dateStr) => {
    setSelectedMondays(prev => {
      const newSelection = { ...prev };
      if (newSelection[dateStr]) {
        delete newSelection[dateStr];
      } else {
        newSelection[dateStr] = ""; // Inicialmente sin descripción
      }
      return newSelection;
    });
  };

  const handleDescriptionChange = (dateStr, desc) => {
    setSelectedMondays(prev => ({ ...prev, [dateStr]: desc }));
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">Gestión de Lunes Bancarios</h2>
      
      <select 
        value={selectedYear} 
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        className="mb-4 p-2 bg-gray-700 rounded"
      >
        <option value={2025}>2025</option>
        <option value={2026}>2026</option>
      </select>

      <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
        {yearMondays.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = !!selectedMondays[dateStr];

          return (
            <div key={dateStr} className="flex items-center gap-4 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => handleToggleMonday(dateStr)}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="w-32">{date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}</span>
              <input 
                type="text" 
                placeholder="Descripción (ej: Corpus Christi)" 
                disabled={!isSelected}
                value={selectedMondays[dateStr] || ""}
                onChange={(e) => handleDescriptionChange(dateStr, e.target.value)}
                className={`flex-1 p-1 rounded bg-gray-900 border ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
              />
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => onSave(selectedMondays)}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-xl font-bold transition-colors"
      >
        Guardar Calendario Bancario
      </button>
    </div>
  );   
}