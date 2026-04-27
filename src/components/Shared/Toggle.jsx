import { useEffect } from 'react';
import { useEvents } from '../../context/EventContext';

import { STATUS_EVENTS } from '../../utils/StaticData/event-utils';

function Toggle({ readOnly, register, errors, setValue, watch }) {
  // Vigilamos el valor actual del campo en el formulario
  const currentStatus = watch("status");
  
  // Determinamos si el checkbox debe estar visualmente "on"
  const isConfirmed = currentStatus === 'Confirmado';

  const handleToggle = () => {
    if (readOnly) return;
    // Alternamos manualmente entre los dos valores del diccionario
    const nextStatus = currentStatus === 'Confirmado' ? 'Tentativo' : 'Confirmado';
    console.log("next", nextStatus)
    setValue("status", nextStatus, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs ${!isConfirmed ? 'text-amber-400 font-bold' : 'text-gray-500'}`}>
        {STATUS_EVENTS.tentative}
      </span>

      <div 
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
          isConfirmed ? 'bg-green-600' : 'bg-gray-600'
        } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isConfirmed ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>

      <span className={`text-xs ${isConfirmed ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
        {STATUS_EVENTS.confirmed}
      </span>

      {/* Input oculto que mantiene el valor real para el formulario */}
      <input type="hidden" {...register("status")} />
    </div>
  );
}

export default Toggle;