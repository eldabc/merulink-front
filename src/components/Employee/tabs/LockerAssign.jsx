import { useEffect } from 'react';
import { useEmployees } from '../../../context/EmployeeContext';
import { getCategoryKey } from '../../../utils/LockerAssign/locker-assign-utils.js';


function LockerAssign({ register, errors, lockerAssigns, selectedSex, useLocker }) {
  const { getLockerAssigns } = useEmployees();
  console.log("useLocker", useLocker);  

  const renderLockerAssigns = () => {
    const lockerAssignCategoryKey = getCategoryKey(selectedSex);
    console.log("selectedSex", selectedSex);
    return lockerAssigns
      .filter(assign => assign.locker.category.key === lockerAssignCategoryKey)
      .map(assign => (
        <option key={`lockerAssign-${assign.id}`} className='bg-[#3c4042]' value={assign.id}>
          {assign.locker.code}
        </option>
    ));
  }

  console.log("lockerAssigns", lockerAssigns)
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
        <div>
          <select  
            {...register('lockerAssingId' )}//, { onChange: handleEventChange }
            className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
            `}// ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}
          >
            <option className='bg-[#3c4042]' value="">Seleccionar...</option>
            {renderLockerAssigns()}
          </select>
        </div>
      )
      }
      
    </>
  );
}

export default LockerAssign;