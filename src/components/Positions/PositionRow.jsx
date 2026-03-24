import { useState } from 'react';
import { usePositions } from "../../context/PositionContext";
import { useNavigate } from 'react-router-dom';

import { getDisabledClasses } from '../../utils/global-utils';  
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function PositionRow({ position }) {

  const navigate = useNavigate();
  const { deletePosition } = usePositions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const blockBtn = position.employees?.length > 0 ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar, cargo tiene Emplados asociados' : 'Eliminar';

  const subDepartmentName = position.subDepartment?.name ?? (
    <span className="italic text-gray-500">No Aplica</span>
  );

  const handleSelectedPosition = (id) => {
    navigate(`/empleados/cargos/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (position) => {
    setSelectedPosition(position);
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
      key={position.id}
      onClick={() => handleSelectedPosition(position.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{position.code}</td>
      <td className="px-4 py-3 text-white-700">{position.name}</td>
      <td className="px-4 py-3 text-white-700">{position.department.departmentName}</td>
      <td className="px-4 py-3 text-white-700">{subDepartmentName}</td>
      <td className="px-4 py-3">
        <ButtonDelete 
          setIsModalOpen={() => handleDeleteClick(position)} 
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
          message={`¿Estás seguro de que deseas eliminar Cargo "${selectedPosition?.name}"?`}
        />
      </td>
    </tr>
    </>
  );
}