import React, { useEffect } from 'react';

import { formatTimeTo12H } from '../../utils/date-utils';

import AlertBadge from '../Shared/AlertBadge';

function ShiftLegend({ shifts = [], activeBrush = null, onSelectBrush, viewMode, dynamicClasses = 'p-5' }) {

  const handleShiftClick = (shift) => {
    if (!onSelectBrush || viewMode) return;

    // Si hace clic en el turno que ya está activo, apaga la brocha
    if (activeBrush && activeBrush.id === shift.id) {
      onSelectBrush(null);
    } else {
      onSelectBrush(shift); // Si hace clic en un turno nuevo, activa la brocha con el turno completo
    }
  };

  return (
    <div className={`w-56 rounded-xl bg-[#2f3d44] hover:bg-[#535557] ${dynamicClasses}`}>
      <h3 className="text-gray-200 font-semibold mb-2"> Horarios: </h3>
      {shifts.map((shift) => {

        // Verifica si este turno específico es el que está activo en la brocha
        const isSelected = activeBrush && activeBrush.id === shift.id;

        return (
          <div 
            key={shift.id} 
            onClick={() => !viewMode && handleShiftClick(shift)} // Activa el clic en toda la fila del turno
            className={`relative flex items-center gap-2 p-1 rounded-lg cursor-pointer transition-all duration-200 ${
              isSelected 
                ? 'bg-gray-700/50 scale-105 border border-cyan-500/50 shadow-md'
                : `transition-all duration-200 cursor-pointer hover:bg-gray-800/30 hover:scale-105 hover:shadow-sm border border-transparent ${shift?.alert && 'bg-gray-900/30' }`
            }`}
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold shrink-0 transition-transform 
              ${isSelected ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: shift.color ?? 'red' }}
            >
              {shift.letterShift}
              {shift?.alert && <AlertBadge alert={shift?.alert} />}
            </div>

            <span className={`text-sm select-none font-medium ${isSelected ? 'text-cyan-400' : 'text-gray-300'}`}>
              {shift.id === 'S-0'
                ? shift.description 
                : `${formatTimeTo12H(shift.checkInTime)} - ${formatTimeTo12H(shift.checkOutTime)}`
              }
            </span> 
          </div>
        );
      })}
    </div>
  );
}

export default ShiftLegend;