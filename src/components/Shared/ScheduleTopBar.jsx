import { EyeIcon, EyeSlashIcon, ClipboardDocumentListIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import ConfirmAutofill from '../Shared/ConfirmAutofill';
import ToggleAutofill from '../Shared/ToggleAutofill';

function ScheduleTopBar ({ viewMode, disabledClasses, exportToPDF, isExporting, setShowPastFortnight, showPastFortnight, onAutofillClick, onConfirmAutofill, isModalOpen, isOneShift, setIsModalOpen, autofillAlways, onAutofillAlwaysChange, onLoadingHandleAutofill }) {
  
  return (
    <div className=" w-full flex items-center justify-end gap-2 mt-2">
      
      {isOneShift && (
        <>
      
        {autofillAlways && <ToggleAutofill compact checkboxChecked={autofillAlways} onCheckboxChange={onAutofillAlwaysChange} onLoadingHandleAutofill={onLoadingHandleAutofill} />}

        <button 
          type="button"
          disabled={viewMode}
          onClick={(e) => {
            e.stopPropagation();
            onAutofillClick()
          }}
          title={'Rellenar Quincena'}
          className={`flex gap-2 px-4 py-2 bg-[#525456] hover:border rounded-md ${disabledClasses}`}
        >
          <ClipboardDocumentListIcon className='w-5 h-5 text-gray-300' />
        </button>
        </>
      )}
      
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
        onClick={() => setShowPastFortnight(!showPastFortnight)}
        title={showPastFortnight ? 'Ocultar Visor' : 'Ver Quincena Pasada'}
        className="flex gap-2 px-4 py-2 bg-[#525456] hover:border rounded-md"
      >
        {showPastFortnight ? ( 
          <EyeSlashIcon className='w-5 h-5 text-gray-300' />
        ) : <EyeIcon className='w-5 h-5 text-gray-300' /> }
      </button>

      <ConfirmAutofill 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); }}
        onConfirm={onConfirmAutofill}
        changesList={[
          "Se rellenarán los días con el turno activo.",
          "Se excluirán automáticamente sábados, domingos y feriados.",
          "Los días de vacaciones que crucen la quincena no generan turnos.",
          "Esta acción no se puede deshacer de forma automática."
        ]}
        checkboxChecked={autofillAlways}
        onCheckboxChange={onAutofillAlwaysChange}
      />
    </div>
  );
}

export default ScheduleTopBar; 