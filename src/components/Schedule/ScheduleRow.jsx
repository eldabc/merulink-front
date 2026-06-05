import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules } from "../../context/ScheduleContext";

import { getDisabledClasses } from '../../utils/global-utils';  
import { formatTimeTo12H } from '../../utils/date-utils';
import { allMonths } from '../../utils/StaticData/months-utils';
import { normalizeDateDDMMYYY } from '../../utils/date-utils';
import { truncateText } from '../../utils/text-utils';
import { getFortnightInfo } from '../../utils/Schedule/schedule-utils';


import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';

export default function ScheduleRow({ schedule, statusInfo }) {

  const navigate = useNavigate();
  const { deleteSchedule } = useSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const blockBtn = schedule?.status !== 'created' ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar Horario con estado ' + statusInfo?.label : 'Eliminar';

  const start = normalizeDateDDMMYYY(schedule?.start);
  const end = normalizeDateDDMMYYY(schedule?.end);
  const fortnight = getFortnightInfo(schedule?.start);

  const handleSelectedSchedule = (id, departmentId, monthNumber, fortnight) => {
    // console.log("Datos",id, monthNumber, fortnight);

    navigate(`/empleados/horarios/ver/${id}`, { 
      state: { departmentId, monthNumber, fortnight } 
    }); 
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
        onClick={() => handleSelectedSchedule(schedule.id, 1, schedule.monthNumber,fortnight.number)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
      >
        <td className="px-4 py-3 text-white-700">{monthJson?.label}</td>
        <td className="px-4 py-3 text-white-700">{`${start} a ${end}`}</td>
        <td className="px-4 py-3 text-white-700">{`${truncateText(schedule?.observations ?? '', 30)}`}</td>
        <td className="px-4 py-3 text-white-700">
          <div className={`${statusInfo?.color} w-20 text-center px-2 py-1 text-gray-50 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer hover:bg-[#363f4cd9] hover:scale-105 hover:shadow-sm`}>
            {statusInfo?.label}
          </div>
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
            title="Eliminar Horario"
            message={`¿Está seguro que desea eliminar Horario "${start} al ${end} "?`}
          />
        </td>
      </tr>
    </Fragment>
  );
}