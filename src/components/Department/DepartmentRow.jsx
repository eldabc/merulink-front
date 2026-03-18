import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { useDepartments } from '../../context/DepartmentContext';
import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function EmployeeRow({ dep }) {
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  const blockBtn = dep.subDepartments?.length > 0 ? true : false;
  const title = blockBtn ? 'No se puede eliminar, departamento tiene subDepartamentos asociados' : 'Eliminar';
  // console.log("dep", dep);

  const handleSelectedDepartment = (id) => {
    navigate(`/empleados/departamentos/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (padlock) => {
    setSelectedDepartment(padlock);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment) return;

    await deletePadlock(selectedDepartment);
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };
  
  return (
    <>
    <tr
      key={dep.id}
      onClick={() => handleSelectedDepartment(dep.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{dep.code}</td>
      <td className="px-4 py-3 text-white-700">{dep.departmentName}</td>
      <td className="px-4 py-3">
        <ButtonDelete 
          setIsModalOpen={() => handleDeleteClick(dep)} 
          title={title}
          dinamicClasses={blockBtn && 'cursor-not-allowed opacity-50'}
          disabled={blockBtn} 
        />
      </td>
    </tr>
    <tr>
      <td>
        <ConfirmDialog 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLocker(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Departamento"
          message={`¿Estás seguro de que deseas eliminar Departamento "${selectedDepartment?.code}"?`}
        />
      </td>
    </tr>
    </>
  );
}