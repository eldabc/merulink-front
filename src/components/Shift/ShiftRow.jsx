import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShifts } from "../../context/ShiftContext";

import { getDisabledClasses } from '../../utils/global-utils';  
import { formatTimeTo12H } from '../../utils/date-utils';
import { typeShiftOptions, minHourOptions } from '../../utils/StaticData/shift-utils';

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';

export default function ShiftRow({ shift }) {

  const navigate = useNavigate();
  // const { deletePosition } = useShifts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const blockBtn = shift.employees?.length > 0 ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar, cargo tiene Empleados asociados' : 'Eliminar';

  const handleSelectedPosition = (id) => {
    navigate(`/empleados/horarios/turnos/ver/${id}`); 
  };

  const handleDeleteClick = (shift) => {
    setSelectedPosition(shift);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedPosition) return;

    // await deletePosition(selectedPosition);
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
      <td className="px-4 py-3 text-white-700">{shift.description}</td>
      <td className="px-4 py-3 text-white-700">{formatTimeTo12H(shift.checkInTime)}</td>
      <td className="px-4 py-3 text-white-700">{formatTimeTo12H(shift.checkOutTime)}</td>
      <td className="px-4 py-3 text-white-700">{shift.department.departmentName}</td>
      <td className="px-4 py-3 text-white-700">
        {`${shift.timeRestPeriod} ${minHourOptions.find(opt => opt.value === shift.durationUnitRestPeriod)?.label}`}
      </td>
      <td className="px-4 py-3 text-white-700">
        {`${shift.timeActivePeriod} ${minHourOptions.find(opt => opt.value === shift.durationUnitActivePeriod)?.label}`}
      </td>
      <td className="px-4 py-3 text-white-700">
        {shift.available === 'yes' ? 'Sí' : 'No'}
      </td>


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