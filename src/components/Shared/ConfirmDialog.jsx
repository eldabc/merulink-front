import WarningChangeStatusEmployee from '../Shared/WarningChangeStatusEmployee';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, btnText, warningMessage, toggleStatusChangeList }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2f3d44] border border-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-full">
            <span className="text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-white">{title || '¿Estás seguro?'}</h3>
        </div>
        
        <div className="text-gray-400 text-sm mb-6">
          <p className='text-justify'>{message}</p>
          {/* // || 'Esta acción no se puede deshacer. El evento será eliminado permanentemente.' */}

          <div className="text-center bg-gray-600 rounded-2xl ">
            {warningMessage ? (
              <WarningChangeStatusEmployee toggleStatusChangeList={toggleStatusChangeList} />
            ) : (
              <span className="block justify-center mt-2 text-[14px] text-red-500 text-shadow-amber-50 p-2">
                Esta acción no se puede deshacer.
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-mediumtext-white rounded-lg transition-colors shadow-lg shadow-red-900/20"
          >
           { btnText ? btnText : "Eliminar ahora" }
          </button>
        </div>
      </div>
    </div>
  );
}