import { useNavigate } from 'react-router-dom';

import ButtonDelete from '../Shared/ButtonDelete';
import { getStatusColor } from '../../utils/status-utils';


function LockerAssignRow({ lockerAssign }){
 
  const navigate = useNavigate();

  const selectedLockerAssign = (lockerAssign) => {
    navigate("/empleados/vestuarios/casilleros/ver", { 
      state: { data: lockerAssign } 
    }); 
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Disponible':
        return <span className={getStatusColor(lockerAssign?.locker?.status)} title='Locker Disponible'>Disponible</span>;
      case 'Ocupado':
        return <span className={getStatusColor(lockerAssign?.locker?.status)} title='Locker Ocupado'>Ocupado</span>;
      case 'Emparejado':
        return <span className={getStatusColor(status)} title="Emparejado">Emparejado</span>;
    }
  };

  return (
    <>
      <tr
        key={lockerAssign.id}
        onClick={() => selectedLockerAssign(lockerAssign)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium">
          {getStatusLabel(lockerAssign?.locker?.status)}
        </td>
        
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.locker?.code}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.locker?.padlock?.serial}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.assignCode}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign?.assignDate}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign?.locker?.category.name}
          
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
