import React from 'react';
import { useDepartments } from '../../context/DepartmentContext';
import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function EmployeeRow({ subDep, setSelectedSubDepartment }) {
  // Obtener la función del contexto
  const { toggleEmployeeField } = useDepartments(); 

  return (
    <tr
      key={subDep.id}
      onClick={() => setSelectedSubDepartment(subDep.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{subDep.code}</td>
      <td className="px-4 py-3 text-white-700">{subDep.subDepartmentName}</td>
      <td className="px-4 py-3 text-white-700">{subDep.departmentName}</td>
      <td className="px-4 py-3">
        <button 
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toggleStatusDepartment(subDep.id);
          // }}
          type="button" className={`tags-work-btn }`}>
         <XMarkIcon className='w-5 h-5 text-red-400' />
        </button>
      </td>
    </tr>
  );
}