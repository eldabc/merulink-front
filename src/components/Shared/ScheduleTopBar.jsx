import { EyeIcon, EyeSlashIcon, ClipboardDocumentListIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import ConfirmDialog from '../Shared/ConfirmDialog';

function ScheduleTopBar ({ exportToPDF, isExporting, setShowPastFortnight, showPastFortnight, shifts, onAutofillFortnight }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleAutofillClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return;

    await deleteSchedule(selectedSchedule);
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };
    
  return (
    <div className=" w-full flex items-center justify-end gap-2 mt-2">
      <button
        type="button"
        onClick={exportToPDF}
        disabled={isExporting}
        title="Descargar copia impresa (PDF)"
        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 disabled:bg-gray-500 text-white font-semibold text-sm rounded-md transition-all shadow-md"
      >
        <ArrowDownTrayIcon className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
        {isExporting ? 'Generando...' : 'PDF'}
      </button>

      <button 
        type="button"
        // onClick={() => onAutofillFortnight()}
        onClick={(e) => {
          handleAutofillClick()
        }}
        title={'Rellenar Quincena'}
        className="flex gap-2 px-4 py-2 bg-[#525456] hover:border rounded-md"
      >
        <ClipboardDocumentListIcon className='w-5 h-5 text-gray-300' />
      </button>

      <button 
        type="button"
        onClick={() => setShowPastFortnight(!showPastFortnight)}
        title={showPastFortnight ? 'Ocultar Visor' : 'Ver Quincena Pasada'}
        className="flex gap-2 px-4 py-2 bg-[#525456] hover:border rounded-md"
      >
        {showPastFortnight ? ( 
          <EyeSlashIcon className='w-5 h-5 text-gray-300' />
        ) : <EyeIcon className='w-5 h-5 text-gray-300' /> }
      </button>

      <ConfirmDialog 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSchedule(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Auto Rellenar Horario"
        message={`¿Está seguro que desea Auto Rellenar este Horario?`}
      />
    </div>
  );
}

export default ScheduleTopBar; 