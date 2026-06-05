import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules } from "../../context/ScheduleContext";

import { getDisabledClasses } from '../../utils/global-utils';  
import { formatTimeTo12H } from '../../utils/date-utils';
import { allMonths } from '../../utils/StaticData/months-utils';
import { normalizeDateDDMMYYY } from '../../utils/date-utils';
import { STATUS_SCHEDULES } from '../../utils/StaticData/schedule-utils';

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';

export default function ScheduleRow({ schedule }) {

  const navigate = useNavigate();
  const { deleteSchedule } = useSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const blockBtn = schedule?.status !== 'created' ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const statusText = STATUS_SCHEDULES[schedule?.status] || schedule?.status || '';
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar Horario con estado ' + statusText : 'Eliminar';

  const start = normalizeDateDDMMYYY(schedule?.start);
  const end = normalizeDateDDMMYYY(schedule?.end);

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
        <td className="px-4 py-3 text-white-700">{`${start} a ${end}`}</td>
        <td className="px-4 py-3 text-white-700">{`${schedule?.observations ?? '' }`}</td>
        <td className="px-4 py-3 text-white-700">{statusText}</td>

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
            title="Eliminar Horario"
            message={`¿Está seguro que desea eliminar Horario "${start} al ${end} "?`}
          />
        </td>
      </tr>
    </Fragment>
  );
}