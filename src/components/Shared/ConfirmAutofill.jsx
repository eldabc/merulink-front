import WarningChangeStatusEmployee from './WarningChangeStatusEmployee';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, changesList = [], checkboxChecked, onCheckboxChange }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2f3d44] border border-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-full">
            <span className="text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-white">Rellenar Quincena</h3>
        </div>
        
        <div className="text-gray-400 text-sm mb-6">
          <p className='text-justify'>¿Está seguro que desea Rellenar esta Quincena automáticamente?</p>

          <div className="text-center bg-gray-600 rounded-2xl ">
            {changesList.length > 0 && (
              <div className="mt-2 text-[14px] text-red-500 text-shadow-amber-50 p-2">
                <span className="block font-bold mb-1 text-center">⚠️ Se realizará los siguientes cambios: </span>
                <ul className="list-disc list-inside space-y-1 mb-2 pl-1 text-left">
                  {changesList.map((change, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                    {change}
                    </li>
                  ))}
                </ul>
          <span className="block font-bold mt-2 text-red-600">Esta acción no se puede deshacer de forma automática. </span>

              </div>
            )}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={(e) => onCheckboxChange?.(e.target.checked)}
              className="w-5 h-5 rounded-lg bg-gray-700 border-gray-500 shrink-0"
            />
            <span className="leading-none">Rellenar siempre automáticamente</span>
          </label>
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
           Rellenar Quincena Automáticamente
          </button>
        </div>
      </div>
    </div>
  );
}