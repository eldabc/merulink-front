import { useState } from 'react';
import { usePositions } from "../../context/PositionContext";
import { useNavigate } from 'react-router-dom';

import { getDisabledClasses } from '../../utils/global-utils';  
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';

export default function ShiftRow({ shift }) {

  const navigate = useNavigate();
  const { deletePosition } = usePositions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const blockBtn = shift.employees?.length > 0 ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar, cargo tiene Empleados asociados' : 'Eliminar';

  const subDepartmentName = shift.subDepartment?.name ?? (
    <SpanText text="No Aplica" />
  );

  const handleSelectedPosition = (id) => {
    navigate(`/empleados/cargos/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (shift) => {
    setSelectedPosition(shift);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedPosition) return;

    await deletePosition(selectedPosition);
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  return (
    <>
    <tr
      key={shift.id}
      onClick={() => handleSelectedPosition(shift.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{shift.code}</td>
      <td className="px-4 py-3 text-white-700">{shift.name}</td>
      <td className="px-4 py-3 text-white-700">{shift.department.departmentName}</td>
      <td className="px-4 py-3 text-white-700">{subDepartmentName}</td>
      <td className="px-4 py-3">
        <ButtonDelete 
          setIsModalOpen={() => handleDeleteClick(shift)} 
          title={deleteBtnTitle}
          dinamicClasses={disabledClasses}
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
            setSelectedPosition(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Cargo"
          message={`¿Está seguro que desea eliminar Cargo "${selectedPosition?.name}"?`}
        />
      </td>
    </tr>
    </>
  );
}