import React, { useEffect } from 'react';

import { formatTimeTo12H } from '../../utils/date-utils';

function ShiftLegend({ shifts = [], activeBrush = null, onSelectBrush }) {
  
  const handleShiftClick = (shift) => {
    if (!onSelectBrush) return;

    // Si el usuario hace clic en el turno que ya está activo, apagamos la brocha (null)
    if (activeBrush && activeBrush.id === shift.id) {
      onSelectBrush(null);
    } else {
      // Si hace clic en uno nuevo, activamos la brocha con ese turno
      // Guardamos tanto el id como la propiedad que usas para pintar las celdas (shift.letterShift)
      onSelectBrush({
        id: shift.id,
        code: shift.letterShift
      });
    }
  };

  return (
    <div className="w-56 rounded-xl p-5 bg-field">
      <h3 className="text-gray-200 font-semibold mb-2"> Horarios: </h3>
      {shifts.map((shift) => {
        // Verifica si este turno específico es el que está activo en la brocha
        const isSelected = activeBrush && activeBrush.id === shift.id;

        return (
          <div 
            key={shift.id} 
            onClick={() => handleShiftClick(shift)} // Activa el clic en toda la fila del turno
            className={`flex items-center gap-2 mt-2 p-1 rounded-lg cursor-pointer transition-all duration-200 ${
              isSelected 
                ? 'bg-gray-700/50 scale-105 border border-cyan-500/50 shadow-md' // Estilo activo
                : 'hover:bg-gray-800/30 border border-transparent'               // Estilo hover normal
            }`}
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold shrink-0 transition-transform ${
                isSelected ? 'animate-pulse' : ''
              }`}
              style={{ backgroundColor: shift.color ?? 'red' }}
            >
              {shift.letterShift}
            </div>

            <span className={`text-sm select-none ${isSelected ? 'text-cyan-400 font-medium' : 'text-gray-300'}`}>
              {shift.id === 0 
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