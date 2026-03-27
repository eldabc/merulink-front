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
      setValue('padlockAssignSerial', '');
    }

  }, [mode, useLockerWatch]); 

  useEffect(() => {
    if (!previousSex.current) {
      previousSex.current = selectedSex;
      return;
    }
    
    //solo se ejecute si hace rerender
    if (previousSex.current !== selectedSex && mode !== 'create') {
      setValue('lockerAssingId', '');
      setValue('padlockAssignPass', '');
      setValue('padlockAssignSerial', '');
    }

    previousSex.current = selectedSex;
  }, [selectedSex]);

  const renderLockerAssigns = () => {
    const lockerAssignCategoryKey = getCategoryKey(selectedSex);

    return empLockerAssign
      .filter(assign => assign.locker?.category?.key === lockerAssignCategoryKey)
      .map((assign, index) => (
        <option key={`lockerAssign-${assign?.id}-${index}`} className='bg-[#3c4042]' value={assign?.id}>
          {assign.locker.code}
        </option>
      ));
  };

  const lockerAssignSelected = empLockerAssign.find(
    assign => assign?.id === Number(lockerAssingIdWatch)
  );

  useEffect(() => {
    const selectedId = lockerAssingIdWatch;

    if (!selectedId) {
      setValue('padlockAssignPass', '');
      setValue('padlockAssignSerial', '');
      return;
    }
    // console.log("lockerAssignSelected", lockerAssingIdWatch, lockerAssignSelected);
    setValue('padlockAssignPass', lockerAssignSelected?.locker?.padlock?.pass ?? '');
    setValue('padlockAssignSerial', lockerAssignSelected?.locker?.padlock?.serial ?? '');
  }, [lockerAssignSelected]);

  const messagge = !selectedSex ? "¡Debe seleccionar Sexo!" : '';
  return (
    <>
      {(!selectedSex ) ? (
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
              /> 
            </label>
          </div>
          {useLockerWatch && (
            <>
              <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 div-border'>
                <div className='max-w-3xl'>
                  <select 
                    disabled={viewMode}
                    {...register('lockerAssingId')}
                    className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses} `} 
                  >
                    <option className='bg-[#3c4042]' value="">Seleccionar Locker...</option>
                    {renderLockerAssigns()}
                  </select>
                </div>
                <LabelFieldForm field="Serial candado" simbol="*" />
                <input disabled={true}  
                      {...register('padlockAssignSerial')} 
                      className={`filter-input rounded-lg px-1 py-1 pl-2 text-xl cursor-not-allowed ${disabledClasses} `} 
                />
                <LabelFieldForm field="Clave candado" simbol="*" />
                <input disabled={true}  
                      {...register('padlockAssignPass')} 
                      className={`filter-input rounded-lg px-1 py-1 pl-2 text-xl cursor-not-allowed ${disabledClasses} `} 
                />
              </div>
              <div className='flex flex-col border border-[#ffffff21] md:pl-4 p-7'>
                {lockerAssignSelected  && (
                  <>
                    <LabelFieldForm field="Patrón de Candado" />
                    <ResetInstructions 
                      register={register} 
                      errors={errors} 
                      value={lockerAssignSelected?.locker?.padlock?.pattern?.resetInstructions}
                      viewMode={true} 
                    />
                                          
                   {lockerAssignSelected?.locker?.padlock?.pattern?.unlockSequence?.map((field, index) => {
                      return (
                        <PadlockPatternSteps
                          key={`${lockerAssignSelected?.id}-${index}`}
                          field={field}
                          index={index}
                          showAddBtn={false}
                          viewMode={true}
                        />
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