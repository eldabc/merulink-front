import React from 'react';
import { useEvents } from '../../context/EventContext';
// import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function EmployeeRow( {event, stringCategory} ) {
  const { setSelectedEvent } = useEvents();
  // Obtener la función del contexto
  const { toggleEmployeeField } = useEvents(); 

  return (
    <tr
      key={event.id}
      onClick={() => setSelectedEvent(event.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{event.title}</td>
      <td className="px-4 py-3 text-white-800 font-medium">{event.start}</td>
      <td className="px-4 py-3 text-white-700">{event.start}</td>
      <td className="px-4 py-3 text-white-700">{event.extendedProps.location}</td>
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