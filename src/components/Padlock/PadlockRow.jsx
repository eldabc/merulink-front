import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePadlocks } from '../../context/PadlockContext';

import ButtonDelete from '../Shared/ButtonDelete';
import { STATUSES, statusConfig } from '../../utils/statusesConfig.js';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import ConfirmDialog from '../Shared/ConfirmDialog';

function PadlockRow({ padlock }) {

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, deletePadlock } = usePadlocks();
  const [selectedPadlock, setSelectedPadlock] = useState(null);
  
  const currentStatus = statusConfig[padlock.status];

  const handleSelectedPadlock = (id) => {
    navigate(`/empleados/vestuarios/candados/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (padlock) => {
    setSelectedPadlock(padlock);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPadlock) return;

    await deletePadlock(selectedPadlock);
    setIsModalOpen(false);
    setSelectedPadlock(null);
  };

  return (
    <>
      <tr
        key={padlock.id}
        onClick={() => handleSelectedPadlock(padlock.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium">
          {STATUSES.AVAILABLE === padlock.status ? (
            <LockOpenIcon className='w-6 h-6 text-[#dcfce7]' title={currentStatus.title.padlock}/>
          ) : (
            <LockClosedIcon className='w-6 h-6 text-[#fee2e2]' title={currentStatus.title}/>
          ) }
        </td>
        <td className="px-4 py-3 text-white-800 font-medium">{padlock.serial}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{padlock?.pass}</td>
        <td className="px-4 py-3 text-white-700">
          {(STATUSES.AVAILABLE === padlock.status && !loading) && (
           <ButtonDelete setIsModalOpen={() => handleDeleteClick(padlock)} />
          )}
        </td>
      </tr>
      <tr>
        <td>
          <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); }}
            onConfirm={handleConfirmDelete}
            title="Eliminar Candado"
            message={`¿Estás seguro de que deseas eliminar Candado "${padlock?.serial}"?`}
          />
        </td>
      </tr>
    </>
  )
}
export default PadlockRow;