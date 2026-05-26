function ScheduleLegend({  }) {
  return (
    <div className="flex flex-col gap-4 p-3 bg-gray-50 border rounded-md text-sm select-none">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="w-20 text-center px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-blue-600 hover:scale-105 hover:shadow-sm">
          Fecha
        </span>
        <span className="text-gray-500 font-medium">Día de Hoy</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="w-20 text-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-red-200 hover:scale-105 hover:shadow-sm">
          Fecha
        </span>
        <span className="text-gray-500 font-medium">Feriados, Sábados, Domingos</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <span className="w-20 text-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-red-200 hover:scale-105 hover:shadow-sm">
          VAC
        </span>
        <span className="text-gray-500 font-medium">(Vacaciones)</span>
      </div>
    </div> 
  );
  
}

export default ScheduleLegend;