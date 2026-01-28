import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEvents } from '../../../context/EventContext';
import { generateMondays } from '../../../utils/date-utils';
import TitleHeader from '../../Shared/TitleHeader';
import FooterFormButtons from '../../Shared/FooterFormButtons';
import { bankingSchema } from '../../../utils/Validations/bankingValidationSchema';
import ErrorMessage from '../../Shared/ErrorMessage';
import HeadFormButtons from '../../Shared/HeadFormButtons';

export default function BankingMondaysForm({ mode = 'create', event = [], onBack, year }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { createEditBankingEvents } = useEvents();
  const [formErrors, setFormErrors] = useState({});

  const eventsReceived = location.state?.data || [];
  const viewMode = mode === 'view';

  // Inicializamos los checks basados en los eventos existentes
  const [checkedDates, setCheckedDates] = useState(() => {
    const initialSet = new Set();
    if (Array.isArray(eventsReceived)) {
      eventsReceived.forEach(e => {
        const d = e.start?.substring(0, 10);
        if (d) initialSet.add(d);
      });
    }
    return initialSet;
  });

  const yearMondays = useMemo(() => generateMondays(year), [year]);

  const handleToggle = (dateStr) => {

    if (viewMode) return;

    setCheckedDates(prev => {
    const newSet = new Set(prev);
    
    if (newSet.has(dateStr)) {
      // Desmarcando
      newSet.delete(dateStr);
      
      // Limpiando title
      const inputElement = document.getElementById(`input-${dateStr}`);
      if (inputElement) {
        inputElement.value = ""; 
      }
    } else {
      newSet.add(dateStr);
    }
    
      return newSet;
    });

    // Limpiamos errores de esa fecha y el global al interactuar
    setFormErrors(prev => {
      const newErrs = { ...prev };
      delete newErrs[dateStr];
      delete newErrs.global;
      return newErrs;
    });
  };

  const handleSave = async () => {
    const dataToValidate = Array.from(checkedDates).map(dateStr => ({
      start: dateStr,
      title: document.getElementById(`input-${dateStr}`)?.value || ""
    }));

    try {
      setFormErrors({});
      const dynamicSchema = bankingSchema(mode);
      await dynamicSchema.validate(dataToValidate, { abortEarly: false });

      await createEditBankingEvents(dataToValidate, year, mode);
          
      if (mode === 'create') navigate(-1);
      else navigate(-2);

    } catch (err) {
      const errorsFound = {};
      if (!err.inner || err.inner.length === 0 || !err.inner.some(e => e.path.includes('['))) {
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
        {(viewMode) && <HeadFormButtons url="/eventos/lunes-bancarios/edit" data={eventsReceived} /> }

      <header className="mb-4">
        <TitleHeader title={`Calendario Bancario ${year}`} />
        <p className="text-sm text-gray-400">
          {viewMode 
            ? "Vista de consulta de los lunes bancarios registrados." 
            : "Marca los lunes y escribe el motivo. Solo se guardarán los marcados."}
        </p>
        
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
          
          // Buscamos el valor inicial en los eventos recibidos
          const initialValue = eventsReceived?.find(e => e.start?.startsWith(dateStr))?.title || "";

          return (
            <div key={dateStr} className="flex flex-col mb-2">
              <div className={`flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isChecked ? 'check-active border-l-4 border-gray-500' : 'bg-gray-800/40 border-l-4 border-transparent'}
           `}
              >
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-blue-500 cursor-pointer disabled:opacity-50"
                  checked={isChecked}
                  onChange={() => handleToggle(dateStr)}
                  disabled={viewMode}
                />
                
                <div className="w-24 shrink-0">
                  <p className="font-bold">{date.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' })}</p>
                  <p className="text-[10px] uppercase text-gray-500">Lunes</p>
                </div>

                <input 
                  id={`input-${dateStr}`}
                  type="text"
                  key={`${dateStr}-${initialValue}`} // Fuerza actualización si cambian los datos
                  defaultValue={initialValue}
                  disabled={!isChecked || viewMode}
                  placeholder={isChecked ? "Título del feriado..." : "Deshabilitado"}
                  className={`filter-input flex-1 bg-gray-950 border p-2 rounded text-sm outline-none transition-all disabled:opacity-40`}
                />
              </div>
              
              {errorMsg && <div className="ml-14"><ErrorMessage msg={errorMsg} /></div>}
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