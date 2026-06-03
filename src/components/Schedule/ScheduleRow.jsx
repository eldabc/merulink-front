import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules } from "../../context/ScheduleContext";

import { getDisabledClasses } from '../../utils/global-utils';  
import { formatTimeTo12H } from '../../utils/date-utils';
import { allMonths } from '../../utils/StaticData/months-utils';

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';

export default function ScheduleRow({ schedule }) {

  const navigate = useNavigate();
  const { deleteSchedule } = useSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const blockBtn = schedule?.hasSchedules ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar, turno tiene Horarios asociados' : 'Eliminar';

  const handleSelectedSchedule = (id) => {
    navigate(`/empleados/horarios/ver/${id}`); 
  };

  const handleDeleteClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return;

    await deleteSchedule(selectedSchedule);
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const monthJson = allMonths[schedule?.monthNumber -1];

  return (
    <Fragment key={schedule?.id}>
      <tr
        onClick={() => handleSelectedSchedule(schedule.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
      >
        <td className="px-4 py-3 text-white-700">{monthJson?.label}</td>
        <td className="px-4 py-3 text-white-700">{`${schedule?.start} a ${schedule?.end}`}</td>
        <td className="px-4 py-3 text-white-700">{formatTimeTo12H(schedule?.checkOutTime)}</td>
        <td className="px-4 py-3 text-white-700">
          {/* {`${schedule.activePeriodTime} ${minHourOptions.find(opt => opt.value === schedule.activePeriodUnitTime)?.label}`} */}
        </td>
        <td className="px-4 py-3 text-white-700">
          {schedule?.available === 'yes' ? 'Sí' : 'No'}
        </td>

        <td className="px-4 py-3">
          <ButtonDelete 
            setIsModalOpen={() => handleDeleteClick(schedule)} 
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
              setSelectedSchedule(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar Turno"
            message={`¿Está seguro que desea eliminar Turno "${selectedSchedule?.description}"?`}
          />
        </td>
      </tr>
    </Fragment>
  );
}