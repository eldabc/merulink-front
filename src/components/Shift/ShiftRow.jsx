import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShifts } from "../../context/ShiftContext";

import { getDisabledClasses } from '../../utils/global-utils';  
import { formatTimeTo12H } from '../../utils/date-utils';
import { minHourOptions } from '../../utils/StaticData/shift-utils';

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';
import AlertBadge from '../Shared/AlertBadge';

export default function ShiftRow({ shift }) {

  const navigate = useNavigate();
  const { deleteShift } = useShifts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const blockBtn = shift?.hasSchedules ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar, turno tiene Horarios asociados' : 'Eliminar';

  const handleSelectedShift = (id) => {
    navigate(`/empleados/turnos/ver/${id}`, {
      state: { alert: shift?.alert }
    }); 
  };

  const handleDeleteClick = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedShift) return;

    await deleteShift(selectedShift);
    setIsModalOpen(false);
    setSelectedShift(null);
  };

  return (
    <>
    <tr
      key={shift.id}
      onClick={() => handleSelectedShift(shift.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-700 font-medium">
        <div className="relative inline-block">
          {shift.code} 
          {shift?.alert && <AlertBadge alert={shift?.alert} dynamicClasses="-top-3" />}
        </div>
      </td>
      <td className="px-4 py-3 text-white-700">{shift.description}</td>
      <td className="px-4 py-3 text-white-700">{formatTimeTo12H(shift.checkInTime)}</td>
      <td className="px-4 py-3 text-white-700">{formatTimeTo12H(shift.checkOutTime)}</td>
      <td className="px-4 py-3 text-white-700">{shift?.department?.departmentName}</td>
      <td className="px-4 py-3 text-white-700">
        {`${shift.restPeriodTime} ${minHourOptions.find(opt => opt.value === shift.restPeriodUnitTime)?.label}`}
      </td>
      <td className="px-4 py-3 text-white-700">
        {`${shift.activePeriodTime} ${minHourOptions.find(opt => opt.value === shift.activePeriodUnitTime)?.label}`}
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
            setSelectedShift(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Turno"
          message={`¿Está seguro que desea eliminar Turno "${selectedShift?.description}"?`}
        />
      </td>
    </tr>
    </>
  );
}