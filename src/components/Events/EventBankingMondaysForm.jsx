import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { generateMondays } from '../../utils/date-utils';
import TitleHeader from '../Shared/TitleHeader';
import FooterFormButtons from '../Shared/FooterFormButtons';
import { bankingSchema } from '../../utils/Validations/bankingValidationSchema';
import ErrorMessage from '../Shared/ErrorMessage';

export default function BankingMondaysManager({ mode = 'create', event = [], onBack, year }) {
  const navigate = useNavigate();
  const { createBankingEvents, updateEvent } = useEvents();
  const [formErrors, setFormErrors] = useState({});

  // Estado Checks (colores y habilitar inputs)
  const [checkedDates, setCheckedDates] = useState(() => {
    const initialSet = new Set();
    if (mode === 'edit' && Array.isArray(event)) {
      event.forEach(e => {
        const d = e.start?.substring(0, 10);
        if (d) initialSet.add(d);
      });
    }
    return initialSet;
  });

  // Generación de lunes (cambia si cambia el año)
  const yearMondays = useMemo(() => generateMondays(year), [year]);

  const handleToggle = (dateStr) => {
    setCheckedDates(prev => {
      const newSet = new Set(prev);
      newSet.has(dateStr) ? newSet.delete(dateStr) : newSet.add(dateStr);
      return newSet;
    });
  };


  const handleSave = async () => {
    // Recolectamos con dateStr
    const dataToValidate = Array.from(checkedDates).map(dateStr => ({
      start: dateStr,
      title: document.getElementById(`input-${dateStr}`)?.value || ""
    }));

    try {
     setFormErrors({});
      await bankingSchema.validate(dataToValidate, { abortEarly: false });
      
      await createBankingEvents(dataToValidate, year);

      if (typeof onBack === 'function') onBack();
      else navigate(-1);

    } catch (err) {
      const errorsFound = {};
      
      if (err.inner?.length === 0 || !err.inner?.some(e => e.path.includes('['))) {
        errorsFound['global'] = err.message;
      } else {
        err.inner.forEach(error => {
          const match = error.path.match(/\[(\d+)\]/);
          if (match) {
            const index = match[1];
            const dateKey = dataToValidate[index].start;
            errorsFound[dateKey] = error.message;
          }
        });
      }
      
      setFormErrors(errorsFound);
    }
  };

  return (
    <div className="flex flex-col h-full text-white w-full p-2">
      <header className="mb-4">
        <TitleHeader title={`Calendario Bancario ${year}`} />
        <p className="text-sm text-gray-400">Marca los lunes y escribe el motivo. Solo se guardarán los que estén marcados.</p>
        {formErrors.global && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg flex items-center gap-2 animate-in fade-in duration-300">
            <span className="text-red-500 text-sm font-bold">⚠️ {formErrors.global}</span>
          </div>
        )}
      </header>

      <div className="table-container overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {yearMondays.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const isChecked = checkedDates.has(dateStr);
          const errorMsg = formErrors[dateStr];
          
          const initialValue = event?.find(e => e.start?.startsWith(dateStr))?.title || "";

          return (
            <div key={dateStr} className="flex flex-col">
              <div className={`flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isChecked ? 'check-active border-l-4 border-gray-500' : 'bg-gray-800/40 border-l-4 border-transparent'}
                `}
              >
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                  checked={isChecked}
                  onChange={() => handleToggle(dateStr)}
                />
                
                <div className="w-24 shrink-0">
                  <p className="font-bold">{date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}</p>
                  <p className="text-[10px] uppercase text-gray-500">Lunes</p>
                </div>

                <input 
                  id={`input-${dateStr}`}
                  type="text"
                  defaultValue={initialValue}
                  disabled={!isChecked}
                  placeholder={isChecked ? "Título del feriado..." : "Deshabilitado"}
                  className={`filter-input flex-1 bg-gray-950 border p-2 rounded text-sm outline-none transition-all disabled:opacity-20`}
                />
              </div>
              
              {errorMsg && <ErrorMessage msg={errorMsg} /> }
            </div>
          );
        })}
      </div>

      <FooterFormButtons 
        onBack={onBack} 
        onSave={handleSave}
        mode={mode} 
        navigate={navigate} 
        txtCreate={`Calendario ${year}`}
      />
    </div>
  );
}