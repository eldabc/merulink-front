import { useNavigate } from 'react-router-dom';

import ButtonDelete from '../Shared/ButtonDelete';
import { getStatusColor } from '../../utils/status-utils';


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
        <td className="px-4 py-3 text-white-800 font-medium">
          {lockerAssign?.locker?.status === 'Disponible' ? (
            <span className={getStatusColor(lockerAssign?.locker?.status)} title='Locker Disponible'>Disponible</span>
          ) : (
            <span className={getStatusColor(lockerAssign?.locker?.status)} title='Locker Ocupado'>Ocupado</span>
          ) }
          </td>
        
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.locker?.code}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.locker?.padlock?.serial}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.assignCode}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign?.assignDate}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign?.locker?.category.categoryName}
          
        </td>
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
