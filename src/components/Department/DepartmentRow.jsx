import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { useDepartments } from '../../context/DepartmentContext';
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function EmployeeRow({ dep }) {
  
  const navigate = useNavigate();
  const { deleteDepartment } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  const blockBtn = dep.subDepartments?.length > 0 ? true : false;
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar, departamento tiene subDepartamentos asociados' : 'Eliminar';
  

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

    await deleteDepartment(selectedDepartment);
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
          title={deleteBtnTitle}
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
            setSelectedDepartment(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Departamento"
          message={`¿Está seguro de que desea eliminar el Departamento "${selectedDepartment?.departmentName}"?`}
        />
      </td>
    </tr>
    </>
  );
}