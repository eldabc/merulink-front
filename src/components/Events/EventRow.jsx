import React, { useState } from "react";
import { useEvents } from '../../context/EventContext';
import { normalizeDateToString } from '../../utils/date-utils';
import { truncateText } from '../../utils/text-utils';
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function EventRow( {event, isMeruBirthday, eventWithLocation, setSelectedEvent} ) {
  const { deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderDescriptionComments = () => {
    return event.extendedProps?.description ? truncateText(event.extendedProps?.description, 50) : truncateText(event.extendedProps?.comments, 50);
  }

  const handleDeleteEvent = (id) => {
    deleteEvent(id);
  }
  return (
    <>
      <tr
        key={event.id}
        onClick={() => setSelectedEvent(event.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium">{event.title}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{normalizeDateToString(event.start)}</td>
        
        {isMeruBirthday ? (
          <td className="px-4 py-3 text-white-700">{event.extendedProps.departmentName}</td>
        ) : ( 
        <td className="px-4 py-3 text-white-700">{renderDescriptionComments()}</td>
        )}

        {!eventWithLocation && (
          <td className="px-4 py-3 text-white-700">{event.extendedProps.locationName}</td>
        )}
        <td className="px-4 py-3 text-white-700">{event.extendedProps.categoryDisplayName}</td>
        <td className="px-4 py-3">
          {!isMeruBirthday && <ButtonDelete setIsModalOpen={setIsModalOpen} id={event.id} /> }
        </td>
      </tr>
      <tr>
        <td>
          <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => handleDeleteEvent(event.id)}
            title="Eliminar Evento"
            message={`¿Estás seguro de que deseas eliminar "${event.title}"?`}
          />
        </td>
      </tr>
    </>
  );
}