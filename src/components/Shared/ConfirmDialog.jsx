export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2f3d44] border border-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-full">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-white">{title || '¿Estás seguro?'}</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6">
          {message || 'Esta acción no se puede deshacer. El evento será eliminado permanentemente.'}
        </p>

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
            Eliminar ahora
          </button>
        </div>
      </div>
    </div>
  );
}