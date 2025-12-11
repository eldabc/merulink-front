import React from 'react';
import { useDepartments } from '../../context/DepartmentContext';
import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function EmployeeRow({ dep, setSelectedEmployee }) {
  // Obtener la función del contexto
  const { toggleEmployeeField } = useDepartments(); 

  return (
    <tr
      key={dep.id}
      onClick={() => setSelectedEmployee(dep.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{dep.code}</td>
      <td className="px-4 py-3 text-white-700">{dep.departmentName}</td>
      <td className="px-4 py-3">
        <button type="button" className={`tags-work-btn }`}>
         <XMarkIcon className='w-5 h-5 text-red-400' />
        </button>
      </td>
    </tr>
  );
}