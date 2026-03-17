import { useEffect, useRef, useState } from 'react';
import { useEmployees } from '../../../context/EmployeeContext';
import { getCategoryKey } from '../../../utils/LockerAssign/locker-assign-utils.js';
import LabelFieldForm from '../../Shared/LabelFieldForm.jsx';
import PadlockPatternSteps from "../../Shared/PadlockPatternSteps";
import ResetInstructions from '../../Shared/ResetInstructions.jsx';

function LockerAssign({ mode, register, errors, empLockerAssign, selectedSex, setValue, isEmployeeActive, watch, disabledClasses, unlockSequence }) {

  const previousSex = useRef();
  const useLockerWatch = watch('useLocker');
  const lockerAssingIdWatch = watch('lockerAssingId');
  const viewMode = mode === 'view'; 

   useEffect (() => {
    if(!useLockerWatch) {
        setValue('lockerAssingId', '');
        setValue('padlockAssignPass', '');
    }
  }, [mode]);

  const lockerAssignSelected = empLockerAssign.find(
    d => d.locker?.id === Number(lockerAssingIdWatch)
  );
  console.log("lockerAssignSelected", lockerAssingIdWatch, lockerAssignSelected)

  useEffect(() => {
    if (!previousSex.current) {
      previousSex.current = selectedSex;
      return;
    }
    
    //solo se ejecute si hace rerender
    if (previousSex.current !== selectedSex && mode !== 'create') {
      setValue('lockerAssingId', '');
      setValue('padlockAssignPass', '');
    }

  previousSex.current = selectedSex;
  }, [selectedSex]);

  const renderLockerAssigns = () => {
    const lockerAssignCategoryKey = getCategoryKey(selectedSex);

    return empLockerAssign
      .filter(assign => assign.locker?.category?.key === lockerAssignCategoryKey)
      .map(assign => (
        <option key={`lockerAssign-${assign.id}`} className='bg-[#3c4042]' value={assign.id}>
          {assign.locker.code}
        </option>
    ));
  };

  const handleAssignChange = (e) => {
  const selectedId = e.target.value;

    if (!selectedId) {
      setValue('padlockAssignPass', '');
      return;
    }

    const selectedAssign = empLockerAssign.find( a => String(a.id) === String(selectedId) );
    setValue('padlockAssignPass', selectedAssign?.locker?.padlock?.pass ?? '');
  };

  const messagge = !selectedSex ? "¡Debe seleccionar Sexo!" : ''; //(!useLocker ? "¡Empleado no tiene habilitado el uso de Locker!" : '')
  return (
    <>
      {(!selectedSex ) ? (//|| !useLocker
        <div className="text-center bg-gray-600 rounded-2xl ">
          <span className="block justify-center mt-2 text-[14px] text-red-500 text-shadow-amber-50 p-2">
            {messagge}
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 pl-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <span className="text-sm">¿Usa Locker?</span>
            <input 
              disabled={!isEmployeeActive || viewMode}
              type="checkbox" 
              {...register('useLocker')} 
              className={`w-4 h-4 rounded ${disabledClasses}`} 
              // onClick={() => !createMode && toggleEmployeeField(employee?.id, "useLocker")} 
               /> 
            </label>
          </div>
          {useLockerWatch && (
            <>
              <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border 
                        border-[#ffffff21] md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                          md:[&>*:nth-child(2n)]:pl-4 p-7'
              >
                <div className='max-w-3xl'>
                  <select 
                    disabled={viewMode}
                    {...register('lockerAssingId', { onChange: handleAssignChange } )}
                    className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses} `} 
                  >
                    <option className='bg-[#3c4042]' value="">Seleccionar Locker...</option>
                    {renderLockerAssigns()}
                  </select>
                </div>
                <LabelFieldForm field="Clave candado" simbol="*" />
                <input disabled={true}  
                      type="text" {...register('padlockAssignPass')} 
                      className={`filter-input rounded-lg px-1 py-1 pl-2 text-xl  bg-gray-700 text-gray-300 cursor-not-allowed ${disabledClasses} `} 
                />
              </div>
              <div className='flex flex-col border border-[#ffffff21] md:pl-4 p-7'>
                {lockerAssignSelected  && (
                  <>
                    <LabelFieldForm field="Patrón de Candado"/>
                    <ResetInstructions register={register} errors={errors} value={lockerAssignSelected?.locker?.padlock?.pattern?.resetInstructions} />
                                          
                   {lockerAssignSelected?.locker?.padlock?.pattern?.unlockSequence?.map((field, index) => {
                      return (
                        <div key={field.id || index} className="flex items-end gap-4 animate-in fade-in slide-in-from-left-2">
                          <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr_1fr] gap-4 flex-1">
                            
                            {/* Paso */}
                            <div className="flex flex-col gap-2">
                              <span className="text-gray-400 text-[10px] uppercase ml-1">Paso</span>
                              <div className="flex items-center justify-center bg-[#3c4042] text-[#9fd8ff] font-bold rounded-lg h-[46px] w-[50px] border border-white/10 shadow-md">
                                #{index + 1}
                              </div>  
                            </div>

                            {/* Acción */}
                            <div className="flex flex-col gap-2">
                              <span className="text-gray-400 text-[10px] uppercase ml-1">Acción</span>
                              <select 
                                value={field.action || ''}
                                disabled
                                className="input-locker w-full"
                              >
                                <option value="girar">Girar 🔄</option>
                                <option value="presionar">Presionar 🔘</option>
                                <option value="halar">Halar ⬆️</option>
                              </select>
                            </div>

                            {/* Dirección */}
                            <div className="flex flex-col gap-2">
                              <span className="text-gray-400 text-[10px] uppercase ml-1">Dirección</span>
                              <select 
                                value={field.direction || ''}
                                disabled
                                className="input-locker w-full"
                              >
                                <option value="derecha">Derecha ➡️</option>
                                <option value="izquierda">Izquierda ⬅️</option>
                                <option value="arriba">Arriba ⬆️</option>
                                <option value="abajo">Abajo ⬇️</option>
                              </select>
                            </div>

                            {/* Cantidad */}
                            <div className="flex flex-col gap-2">
                              <span className="text-gray-400 text-[10px] uppercase ml-1">Cantidad</span>
                              <input
                                value={field.amount || ''}
                                disabled
                                className="input-locker w-full"
                              />
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </>
      )
      }
      
    </>
  );
}

export default LockerAssign;