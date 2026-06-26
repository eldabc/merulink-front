function ToggleAutofill({ isOpen, compact = false, checkboxChecked, onCheckboxChange }) {
  
  const wrapperClasses = compact
    ? 'flex items-center gap-2 px-2 py-2 rounded-full bg-gray-650/70 border border-gray-700/70 cursor-pointer select-none transition-all duration-200 hover:bg-gray-600'
    : 'mt-4 flex items-center justify-between p-3 rounded-xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm cursor-pointer select-none group transition-all duration-200 hover:border-gray-600/80';

  return (
    <label className={wrapperClasses} title="Automatiza la generación de horarios cada quincena">
      <div className={compact ? 'flex items-center gap-2' : 'flex flex-col gap-0.5'}>
        <span className={`text-xs font-medium text-gray-200`}>
          Rellenar {!compact && 'siempre'} automáticamente
        </span>
        {!compact && (
          <span className="text-xs text-gray-400">
            Automatiza la generación de horarios cada quincena
          </span>
        )}
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checkboxChecked}
          onChange={(e) => onCheckboxChange?.(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 peer-checked:after:bg-white peer-checked:after:border-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"></div>
      </div>
    </label>
  );
}

export default ToggleAutofill;