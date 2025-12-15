import React from 'react';
import { useDepartments } from '../../context/DepartmentContext';
import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function PositionRow({ position, setSelectedDepartment }) {
  // Obtener la función del contexto
  const { toggleEmployeeField } = useDepartments(); 

  return (
    <tr
      key={position.id}
      onClick={() => setSelectedDepartment(position.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{position.code}</td>
      <td className="px-4 py-3 text-white-700">{position.positionName}</td>
      <td className="px-4 py-3">
        <button 
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toggleStatusDepartment(position.id);
          // }}
          type="button" className={`tags-work-btn }`}>
         <XMarkIcon className='w-5 h-5 text-red-400' />
        </button>
      </td>
    </tr>
  );
}