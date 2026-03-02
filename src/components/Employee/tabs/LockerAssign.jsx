import { useEffect, useRef } from 'react';
import { useEmployees } from '../../../context/EmployeeContext';
import { getCategoryKey } from '../../../utils/LockerAssign/locker-assign-utils.js';
import LabelFieldForm from '../../Shared/LabelFieldForm.jsx';

function LockerAssign({ mode, register, errors, empLockerAssign, selectedSex, useLocker, setValue }) {
  const { getLockerAssigns } = useEmployees();
  const previousSex = useRef();
  const viewMode = mode === 'view';
  const cursorNotAllowed = viewMode && 'cursor-not-allowed opacity-50';
  // console.log("mode", mode);  

  useEffect(() => {
    if (!previousSex.current) {
      previousSex.current = selectedSex;
      return;
    }

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

  const messagge = !selectedSex ? "¡Debe seleccionar Sexo!" : (!useLocker ? "¡Empleado no tiene habilitado el uso de Locker!" : '');
  return (
    <>
      {(!selectedSex || !useLocker) ? (
        <div className="text-center bg-gray-600 rounded-2xl ">
          <span className="block justify-center mt-2 text-[14px] text-red-500 text-shadow-amber-50 p-2">
            {messagge}
          </span>
        </div>
      ) : (
        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border 
                      border-[#ffffff21] md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                        md:[&>*:nth-child(2n)]:pl-4 p-7'
        >
          <div className='max-w-3xl'>
            <select 
              disabled={viewMode}
              {...register('lockerAssingId', { onChange: handleAssignChange } )}
              className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed} `} 
            >
              <option className='bg-[#3c4042]' value="">Seleccionar Locker...</option>
              {renderLockerAssigns()}
            </select>
          </div>
          <LabelFieldForm field="Clave candado" simbol="*" />
          <input disabled={true}  
                 type="text" {...register('padlockAssignPass')} 
                 className={`filter-input rounded-lg px-1 py-1 pl-2 text-xl  bg-gray-700 text-gray-300 cursor-not-allowed ${cursorNotAllowed} `} 
          />
          
        </div>
      )
      }
      
    </>
  );
}

export default LockerAssign;