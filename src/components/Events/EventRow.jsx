import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';

import { truncateText } from '../../utils/text-utils';
import { divideDateTime, normalizeDateToString, formatTimeTo12H } from '../../utils/date-utils'; //, getNextHour

import ButtonDelete from '../Shared/ButtonDelete';
import ButtonIsTemplate from '../Shared/ButtonIsTemplate';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function EventRow( {event, isMeruBirthday, eventWithoutLocation, isEventWithStatus} ) {

  const { deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const divideDateTimeStart = divideDateTime(event?.start);
  const isNotConfirmedEvent = event?.extendedProps?.status && event?.extendedProps?.status !== 'Confirmado';
  const isNotExternalEvent = !event.extendedProps?.externalDate;
  const blockBtn = isNotConfirmedEvent ? false : true;
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar evento con Estatus Confirmado' : 'Eliminar';

  const renderDescriptionComments = () => {
    const description = event.extendedProps?.description ? event.extendedProps?.description : '';
    const comments = event.extendedProps?.comments ? event.extendedProps?.comments : '';

    return event.extendedProps?.description ? truncateText(description, 50) : truncateText(comments, 50);
  }

  const handleDeleteEvent = (event) => {
    deleteEvent(event);
  }

  const selectedEvent = (id) => {
    navigate(`/eventos/ver/${id}`, { 
      // state: { data: event } 
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
        
        {isEventWithStatus && <td className="px-4 py-3 text-white-700">{event.extendedProps?.status}</td> }

        {(!isMeruBirthday && isNotExternalEvent || isNotConfirmedEvent ) && (
          <td className="px-4 py-3">
              <ButtonDelete 
                setIsModalOpen={setIsModalOpen}
                title={deleteBtnTitle}
                dinamicClasses={blockBtn && 'cursor-not-allowed opacity-50'}
                disabled={blockBtn} 
                id={event.id} />
          </td>
        )}

        {event.extendedProps?.isTemplate && <ButtonIsTemplate/> }
      </tr>
      <tr>
        <td>
          <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => handleDeleteEvent(event)}
            title="Eliminar Evento"
            message={`¿Está seguro de que desea eliminar "${event.title}"?`}
          />
        </td>
      </tr>
    </>
  );
}