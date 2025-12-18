import React from 'react';
import { useEvents } from '../../context/EventContext';
// import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function EmployeeRow( {event} ) {
  // Obtener la función del contexto
  const { toggleEmployeeField } = useEvents(); 
    console.log("EventRow event:", event);
  return (
    <tr
      key={event.id}
      onClick={() => setSelectedEvent(event.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{event.start}</td>
      <td className="px-4 py-3 text-white-700">{event.start}</td>
      <td className="px-4 py-3 text-white-700">{event.extendedProps.location}</td>
      <td className="px-4 py-3">
        <button 
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toggleStatusEvent(event.id);
          // }}
          type="button" className={`tags-work-btn }`}>
         <XMarkIcon className='w-5 h-5 text-red-400' />
        </button>
      </td>
    </tr>
  );
}