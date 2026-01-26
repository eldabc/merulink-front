import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { generateMondays } from '../../utils/date-utils';
import TitleHeader from '../Shared/TitleHeader';
import FooterFormButtons from '../Shared/FooterFormButtons';

export default function BankingMondaysManager({ mode = 'create', event = null, onBack, year }) {

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      // resolver: yupResolver(eventValidationSchema),
      // mode: 'onChange',
      // reValidateMode: 'onChange'
  })
  
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2026);
  // Importante: No generes los lunes directamente en el cuerpo si son muchos
  const yearMondays = useMemo(() => generateMondays(selectedYear), [selectedYear]);
  
  // Estado para los checks (usamos un Set para que sea ultra rápido)
  const [checkedDates, setCheckedDates] = useState(new Set());
  const [descriptions, setDescriptions] = useState({});

  const handleCheck = (dateStr) => {
    const newChecked = new Set(checkedDates);
    if (newChecked.has(dateStr)) {
      newChecked.delete(dateStr);
    } else {
      newChecked.add(dateStr);
    }
    setCheckedDates(newChecked);
  };

  return (
    <div className="flex flex-col h-full text-white md:min-w-7xl overflow-x-auto p-2 rounded-lg">
      <header className="mb-4">
        <TitleHeader title={"Configuración Lunes Bancarios"} />
        <p className="text-sm text-gray-400">Selecciona los lunes que corresponden a feriados bancarios según SUDEBAN.</p>
      </header>

      {/* Lista scrolleable para no romper el layout */}
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        {yearMondays.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const isChecked = checkedDates.has(dateStr);

          return (
            <div key={dateStr} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isChecked ? 'check-active' : ''}`}>
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-pointer"
                checked={isChecked}
                onChange={() => handleCheck(dateStr)}
              />
              <div className="flex flex-col min-w-[100px]">
                <span className="font-bold">{date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}</span>
                <span className="text-xs text-gray-500">{selectedYear}</span>
              </div>
              
              <input 
                type="text"
                placeholder="Descripción del feriado..."
                className="flex-1 bg-gray-950 border border-gray-700 p-2 rounded text-sm outline-none focus:border-blue-500 disabled:opacity-30"
                disabled={!isChecked}
                value={descriptions[dateStr] || ''}
                onChange={(e) => setDescriptions({...descriptions, [dateStr]: e.target.value})}
              />
            </div>
          );
        })}
      </div>
      
      <FooterFormButtons onBack={onBack} isSubmitting={isSubmitting} mode={mode} navigate={navigate} txtCreate={`Calendario ${selectedYear}`}/>
      
    </div>
  );
}