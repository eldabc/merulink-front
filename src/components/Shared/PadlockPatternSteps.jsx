function PadlockPatternSteps({ field, index, errors, register, showAddBtn, disabled }) {
  const viewMode = disabled;
  const disabledClasses = viewMode && 'cursor-not-allowed';

  return (
    <div key={field.id} className="flex items-end gap-4 animate-in fade-in slide-in-from-left-2">
      <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr_1fr] gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-[10px] uppercase ml-1">Paso</span>
          <div className="flex items-center justify-center bg-[#3c4042] text-[#9fd8ff] font-bold rounded-lg h-[46px] w-[50px] border border-white/10 shadow-md">
            #{index + 2}
          </div>  
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-[10px] uppercase ml-1">Acción</span>
          <select 
            disabled={viewMode}
            {...register(`unlockSequence.${index}.action`)} 
            className={`input-locker w-full ${disabledClasses}`}
          >
            <option value="girar">Girar 🔄</option>
            <option value="presionar">Presionar 🔘</option>
            <option value="halar">Halar ⬆️</option>
          </select>
            {errors?.unlockSequence?.[index]?.action && <ErrorMessage msg={errors.unlockSequence?.[index]?.action.message} /> }  
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-[10px] uppercase ml-1">Dirección</span>
          <select 
            disabled={viewMode}
            {...register(`unlockSequence.${index}.direction`)} 
            className={`input-locker w-full ${disabledClasses}`}
          >
            <option value="derecha">Derecha ➡️</option>
            <option value="izquierda">Izquierda ⬅️</option>
            <option value="arriba">Arriba ⬆️</option>
            <option value="abajo">Abajo ⬇️</option>
          </select>
            {errors?.unlockSequence?.[index]?.direction && <ErrorMessage msg={errors.unlockSequence?.[index]?.direction.message} /> }  
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-[10px] uppercase ml-1">Cantidad</span>
          <div className="flex gap-2">
            <input
              readOnly={viewMode} 
              {...register(`unlockSequence.${index}.amount`)}
              type="number" 
              min="1"
              className={`input-locker w-full placeholder:opacity-50 ${disabledClasses}`}
              placeholder='Ingresa cantidad'
            />  
            {/* Eliminar paso (solo si hay más de uno) */}
            <div className='w-10 mr-3'>
            {showAddBtn && !viewMode && (
              <button 
                type="button" 
                onClick={() => remove(index)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
            </div>
          </div>
          {errors?.unlockSequence?.[index]?.amount && <ErrorMessage msg={errors.unlockSequence?.[index]?.amount.message} /> }
        </div>
      </div>
    </div>
  );
}

export default PadlockPatternSteps;