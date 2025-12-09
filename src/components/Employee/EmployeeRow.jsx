import React from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { getStatusColor, getStatusName } from '../../utils/status-utils';

export default function EmployeeRow({ emp, setSelectedEmployee }) {
  // Obtener la función del contexto
  const { toggleEmployeeField } = useEmployees(); 

  return (
    <tr
      key={emp.id}
      onClick={() => setSelectedEmployee(emp.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{emp.numEmployee}</td>
      <td className="px-4 py-3 text-white-700">{emp.ci}</td>
      <td className="px-4 py-3 text-white-700">{emp.firstName}</td>
      <td className="px-4 py-3 text-white-700">{emp.lastName}</td>
      <td className="px-4 py-3 text-white-700">{emp.department}</td>
      <td className="px-4 py-3 text-white-700">{emp.subDepartment}</td>
      <td className="px-4 py-3 text-white-700">{emp.position}</td>
      <td className="px-4 py-3">
        <span 
          className={getStatusColor(emp.status)}
          onClick={(e) => {
            e.stopPropagation();
            toggleEmployeeField(emp.id, "status");
          }}
        >{getStatusName(emp.status)}</span>
      </td>
    </tr>
  );
}