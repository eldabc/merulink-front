import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { normalizeDateToString } from '../../utils/date-utils';
import { truncateText } from '../../utils/text-utils';

export default function EmployeeRow( {event, isMeruBirthday, eventWithLocation, setSelectedEvent} ) {
 const renderDescriptionComments = () => {
    return event.extendedProps?.description ? truncateText(event.extendedProps?.description, 50) : truncateText(event.extendedProps?.comments, 50);
  }
  return (
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
        <button 
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toggleStatusEvent(event.id);
          // }}
          title='Eliminar Evento'
          type="button" className={`tags-work-btn }`}>
         <XMarkIcon className='w-5 h-5 text-red-400' />
        </button>
      </td>
    </tr>
  );
}