import { EyeIcon, EyeSlashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

function ScheduleTopBar ({ exportToPDF, isExporting, setShowPastFortnight, showPastFortnight, shifts }) {
  
  return (
    <div className=" w-full flex items-center justify-end gap-2 mt-2">
      <button
        type="button"
        onClick={exportToPDF}
        disabled={isExporting}
        title="Descargar copia impresa (PDF)"
        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-semibold text-sm rounded-md transition-all shadow-md"
      >
        <ArrowDownTrayIcon className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
        {isExporting ? 'Generando...' : 'PDF'}
      </button>

      <button 
        type="button"
        onClick={() => setShowPastFortnight(!showPastFortnight)}
        title={showPastFortnight ? 'Ocultar Visor' : 'Ver Quincena Pasada'}
        className="flex gap-2 px-4 py-2 bg-[#525456] hover:bg-[#52545691] hover:border rounded-md"
      >
        {showPastFortnight ? ( 
          <EyeSlashIcon className='w-5 h-5 text-gray-300' />
        ) : <EyeIcon className='w-5 h-5 text-gray-300' /> }
      </button>

      <button 
        type="button"
        onClick={() => setShowPastFortnight(!showPastFortnight)}
        title={showPastFortnight ? 'Ocultar Visor' : 'Ver Quincena Pasada'}
        className="flex gap-2 px-4 py-2 bg-[#525456] hover:bg-[#52545691] hover:border rounded-md"
      >
        {showPastFortnight ? ( 
          <EyeSlashIcon className='w-5 h-5 text-gray-300' />
        ) : <EyeIcon className='w-5 h-5 text-gray-300' /> }
      </button>
    </div>
  );
}

export default ScheduleTopBar; 