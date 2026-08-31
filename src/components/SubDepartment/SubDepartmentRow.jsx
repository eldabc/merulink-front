import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubDepartments } from '../../context/SubDepartmentContext';

import { getDisabledClasses } from '../../utils/global-utils';  

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import HasPermission from '../Shared/HasPermission';
import SpanText from '../Shared/SpanText';

export default function SubDepartmentRow({ subDep }) {
  
  const navigate = useNavigate();
  const { deleteSubDepartment } = useSubDepartments(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubDep, setSelectedSubDep] = useState(null);
  const blockBtn = subDep?.positions?.length > 0 ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar Sub-departamento, tiene Cargos asociados' : 'Eliminar';

  const handleSelectedSubDepartment = (id) => {
    navigate(`/empleados/sub-departamentos/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (sub) => {
    setSelectedSubDep(sub);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedSubDep) return;

    await deleteSubDepartment(selectedSubDep);
    setIsModalOpen(false);
    setSelectedSubDep(null);
  };

  return (
    <>
    <tr
      key={subDep.id}
      onClick={() => handleSelectedSubDepartment(subDep.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{subDep.code}</td>
      <td className="px-4 py-3 text-white-700">{subDep.name}</td>
      <td className="px-4 py-3 text-white-700">{subDep.department.departmentName}</td>
      <td className="px-4 py-3">
        <HasPermission permissions={["delete-subdepartments"]} fallback={<SpanText text="Sin acciones" />}>
          <ButtonDelete 
            setIsModalOpen={() => handleDeleteClick(subDep)} 
            title={deleteBtnTitle}
            dinamicClasses={disabledClasses}
            disabled={blockBtn} 
          />
        </HasPermission>
      </td>
    </tr>
    <tr>
      <td>
        <ConfirmDialog 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSubDep(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Sub-departamento"
          message={`¿Está seguro que desea eliminar Sub-departamento "${selectedSubDep?.name}"?`}
        />
      </td>
    </tr>
    </>
  );
}