import React from 'react';
// import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { normalizeDateToString } from '../../utils/date-utils';
import { truncateText } from '../../utils/text-utils';

export default function EmployeeRow( {event, isMeruBirthday, eventWithLocation} ) {
  return (
    <tr
      key={event.id}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{event.title}</td>
      <td className="px-4 py-3 text-white-800 font-medium ">{normalizeDateToString(event.start)}</td>
      
      {isMeruBirthday ? (
        <td className="px-4 py-3 text-white-700">{event.extendedProps.department}</td>
      ) : ( 
      <td className="px-4 py-3 text-white-700">{truncateText(event.extendedProps.description)}</td>
      )}

      {!eventWithLocation && (
        <td className="px-4 py-3 text-white-700">{event.extendedProps.location}</td>
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