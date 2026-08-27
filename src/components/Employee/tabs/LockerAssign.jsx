import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getCategoryKey } from '../../../utils/LockerAssign/locker-assign-utils.js';

import LabelFieldForm from '../../Shared/LabelFieldForm.jsx';
import PadlockPatternSteps from "../../Shared/PadlockPatternSteps";
import ResetInstructions from '../../Shared/ResetInstructions.jsx';
import ErrorMessage  from '../../Shared/ErrorMessage';

function LockerAssign({ mode, empLockerAssign, selectedSex, isEmployeeActive, disabledClasses }) {

  const { register, watch, setValue, formState: { errors } } = useFormContext();
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

  const lockerAssignCategoryKey = useMemo(() => getCategoryKey(selectedSex), [selectedSex]);

  const availableLockerMatched = useMemo(
    () => empLockerAssign.filter(
      assign => assign.locker?.category?.key === lockerAssignCategoryKey
    ),
    [empLockerAssign, lockerAssignCategoryKey]
  );

  const noLockerMatchedAvailable = availableLockerMatched.length === 0;

  const renderLockerAssigns = () =>
    availableLockerMatched.map((assign, index) => (
      <option key={`lockerAssign-${assign?.id}-${index}`} value={assign?.id}>
        {assign.locker.code}
      </option>
    ));

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
              <div className='flex flex-col lg:flex-row justify-center lg:items-center gap-2 lg:gap-4 mb-4 mt-6 border border-[#ffffff21] p-7 lg:[&>*:nth-child(2n)]:border-l lg:[&>*:nth-child(2n)]:border-[#ffffff21] lg:[&>*:nth-child(2n)]:pl-4'>
                <div className='md:max-w-3xl lg:shrink-0'>
                  <select 
                    disabled={viewMode || noLockerMatchedAvailable}
                    {...register('lockerAssingId')}
                    className={`text-xl w-full lg:w-44 px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses} ${noLockerMatchedAvailable ? 'opacity-50 cursor-not-allowed' : ''} `} 
                  >
                    <option className='bg-[#3c4042]' value="">{noLockerMatchedAvailable ? 'Sin opciones' : 'Seleccionar...'}</option>
                    {renderLockerAssigns()}
                  </select>
                  {errors.lockerAssingId && <ErrorMessage msg={errors.lockerAssingId.message} /> }
                </div>

                <LabelFieldForm field="Serial candado" simbol="*" />
                <input 
                  disabled={true}  
                  {...register('padlockAssignSerial')} 
                  className={`filter-input rounded-lg px-1 py-1 pl-2 text-xl cursor-not-allowed flex-1 min-w-25 ${disabledClasses} `} 
                />

                <LabelFieldForm field="Clave candado" simbol="*" />
                <input 
                  disabled={true}  
                  {...register('padlockAssignPass')} 
                  className={`filter-input rounded-lg px-1 py-1 pl-2 text-xl cursor-not-allowed flex-1 min-w-25 ${disabledClasses} `} 
                />
              </div>

              
              <div className='flex flex-col border border-[#ffffff21] md:pl-4 p-7'>
                {noLockerMatchedAvailable && <ErrorMessage msg="Sin locker y candado disponible para asignación." />}
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