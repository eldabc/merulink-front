import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePositions } from '../../context/PositionContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function PositionRow({ position }) {

  const navigate = useNavigate();

   const handleSelectedPosition = (id) => {
    navigate(`/empleados/cargos/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  return (
    <tr
      key={position.id}
      onClick={() => handleSelectedPosition(position.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{position.code}</td>
      <td className="px-4 py-3 text-white-700">{position.name}</td>
      <td className="px-4 py-3">
        <button 
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toggleStatusPosition(position.id);
          // }}
          type="button" className={`tags-work-btn }`}>
         <XMarkIcon className='w-5 h-5 text-red-400' />
        </button>
      </td>
    </tr>
  );
}