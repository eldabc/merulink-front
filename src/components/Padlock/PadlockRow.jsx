import { useNavigate } from 'react-router-dom';

import ButtonDelete from '../Shared/ButtonDelete';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';

function PadlockRow({ padlock }) {

  const navigate = useNavigate();

  const selectedPadlock = (padlock) => {
  navigate("/empleados/vestuarios/candados/ver", { 
    state: { data: padlock } 
  }); 
  };
  return (
    <>
      <tr
        key={padlock.id}
        onClick={() => selectedPadlock(padlock)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium ">{padlock.status === 'Disponible' ? (
          <LockOpenIcon className='w-5 h-5 ' title='Candado Disponible'/>
        ) : (
          <LockClosedIcon className='w-5 h-5 text-gray-500' title='Candado Asignado'/>
        ) }</td>
        <td className="px-4 py-3 text-white-800 font-medium">{padlock.serial}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{padlock?.pass}</td>
        <td className="px-4 py-3 text-white-700">
          <ButtonDelete setIsModalOpen={() => handleDeleteClick(padlock)} />
        </td>
      </tr>
      <tr>
        <td>
          {/* <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTemplate(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar Locker"
            message={`¿Estás seguro de que deseas eliminar Locker "${selectedTemplate?.code}"?`}
          /> */}
        </td>
      </tr>
    </>
  )
}
export default PadlockRow;