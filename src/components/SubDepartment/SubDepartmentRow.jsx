import React from 'react';
import { useSubDepartments } from '../../context/SubDepartmentContext';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { getDepartmentNameById } from '../../utils/Departments/departments-utils'

export default function SubDepartmentRow({ subDep, setSelectedSubDepartment }) {
  // Obtener la función del contexto
  const { toggleSubDepartmentStatus } = useSubDepartments(); 

  return (
    <tr
      key={subDep.id}
      onClick={() => setSelectedSubDepartment(subDep.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{subDep.code}</td>
      <td className="px-4 py-3 text-white-700">{subDep.subDepartmentName}</td>
      <td className="px-4 py-3 text-white-700">
        { subDep.departmentName ? (
          subDep.departmentName
        ) : (
          getDepartmentNameById(subDep.departmentId)
        )}
      </td>
      <td className="px-4 py-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleSubDepartmentStatus(subDep.id);
          }}
          type="button" className={`tags-work-btn }`} title='Elimar Sub-Departamento'>
         <XMarkIcon className='w-5 h-5 text-red-400' />
        </button>
      </td>
    </tr>
  );
}