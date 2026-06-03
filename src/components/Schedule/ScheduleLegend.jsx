function ScheduleLegend({  }) {
  return (
    <div className="flex flex-col gap-4 p-3 bg-[#2f3d44] hover:bg-[#535557] rounded-md text-sm select-none">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="w-20 text-center px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-blue-600 hover:scale-105 hover:shadow-sm">
          Fecha
        </span>
        <span className="text-gray-200 font-medium">Día de Hoy</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="w-20 text-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-red-200 hover:scale-105 hover:shadow-sm">
          Fecha
        </span>
        <span className="text-gray-200 font-medium">Feriados, Sábados, Domingos</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="w-20 text-center px-2 py-1 bg-[#9ea2a3] text-[#696e74] rounded text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-[#9ea2a3d1] hover:scale-105 hover:shadow-sm">
          VAC
        </span>
        <span className="text-gray-200 font-medium">Periodo de Vacaciones</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="w-20 text-center px-2 py-1 bg-[#363f4c] text-gray-400 border border-gray-400 rounded text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-[#363f4cd9] hover:scale-105 hover:shadow-sm">
          BAJA
        </span>
        <span className="text-gray-200 font-medium">Personal dado de baja</span>
      </div>
    </div> 
  );
  
}

export default ScheduleLegend;