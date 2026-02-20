import { useNavigate } from 'react-router-dom';

import ButtonDelete from '../Shared/ButtonDelete';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';

function LockerAssignRow({ lockerAssign }){
 
  const navigate = useNavigate();

  const selectedPadlock = (lockerAssign) => {
    navigate("/empleados/vestuarios/candados/ver", { 
      state: { data: lockerAssign } 
    }); 
  };

  return (
    <>
      <tr
        key={lockerAssign.id}
        onClick={() => selectedPadlock(lockerAssign)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign.status === 'Disponible' ? (
          <LockOpenIcon className='w-6 h-6 text-[#dcfce7]' title='Candado Disponible'/>
        ) : (
          <LockClosedIcon className='w-6 h-6 text-[#fee2e2]' title='Candado Asignado'/>
        ) }</td>
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign.assignCode}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign?.assignDate}</td>
        <td className="px-4 py-3 text-white-700">
          <ButtonDelete setIsModalOpen={() => handleDeleteClick(lockerAssign)} />
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
  );
}

export default LockerAssignRow;
