import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';

import { truncateText } from '../../utils/text-utils';
import { divideDateTime, normalizeDateToString, formatTimeTo12H } from '../../utils/date-utils'; //, getNextHour

import ButtonDelete from '../Shared/ButtonDelete';
import ButtonIsTemplate from '../Shared/ButtonIsTemplate';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function EventRow( {event, isMeruBirthday, eventWithoutLocation} ) {

  const { deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const divideDateTimeStart = divideDateTime(event?.start);


  const renderDescriptionComments = () => {
    const description = event.extendedProps?.description ? event.extendedProps?.description : '';
    const comments = event.extendedProps?.comments ? event.extendedProps?.comments : '';

    return event.extendedProps?.description ? truncateText(description, 50) : truncateText(comments, 50);
  }

  const handleDeleteEvent = (id) => {
    deleteEvent(id);
  }

  const selectedEvent = (id) => {
    navigate(`/eventos/ver/${id}`, { 
      state: { data: event } 
    }); 
  };

  return (
    <>
      <tr
        key={event.id}
        onClick={() => selectedEvent(event.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium">{event.title}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{normalizeDateToString(event?.start)}</td>
        
        {isMeruBirthday ? (
          <>
            <td className="px-4 py-3 text-white-700">{event.extendedProps?.department?.name}</td>
            <td className="px-4 py-3 text-white-700">{event.extendedProps?.nextAge} Años</td>
          </>
        ) : ( 
          <>
            <td className="px-4 py-3 text-white-800 font-medium ">{formatTimeTo12H(divideDateTimeStart?.time)}</td>
            <td className="px-4 py-3 text-white-700">{renderDescriptionComments()}</td>
          </>
        )}

        {!eventWithoutLocation && (
          <td className="px-4 py-3 text-white-700">{event.extendedProps?.location?.label}</td>
        )}
        <td className="px-4 py-3 text-white-700">{event.extendedProps?.category.label}</td>
        {(!isMeruBirthday && !event.extendedProps?.externalDate) && (
          <td className="px-4 py-3">
            <ButtonDelete setIsModalOpen={setIsModalOpen} id={event.id} />
        </td>)}
            {event.extendedProps?.isTemplate && <ButtonIsTemplate/> }
      </tr>
      <tr>
        <td>
          <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => handleDeleteEvent(event.id)}
            title="Eliminar Evento"
            message={`¿Está seguro de que desea eliminar "${event.title}"?`}
          />
        </td>
      </tr>
    </>
  );
}