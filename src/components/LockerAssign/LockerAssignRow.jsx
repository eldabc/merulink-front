import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import ButtonReset from '../Shared/ButtonReset';
import { getStatusColor } from '../../utils/status-utils';
import ConfirmDialog from '../Shared/ConfirmDialog';
import { useLockerAssigns } from '../../context/LockerAssignContext';


function LockerAssignRow({ lockerAssign }){
 
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resetLockerAssign } = useLockerAssigns();  

  const selectedLockerAssign = (lockerAssign) => {
    // TODO: segun permisos debe navegar a 'ver' o 'editar', por ahora va a editar
    navigate("/empleados/vestuarios/casilleros/editar", { 
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

  const handleConfirmReset = async (id) => {
    await resetLockerAssign(id);
    setIsModalOpen(false);
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
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.employee?.name}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{lockerAssign?.assignCode}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign?.assignDate}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerAssign?.locker?.category.name}
          
        </td>
        <td className="px-4 py-3 text-white-700">
          {lockerAssign?.locker?.status !== 'Disponible' && (
            <ButtonReset setIsModalOpen={setIsModalOpen} title={lockerAssign?.locker?.code} />
          )}
        </td>
      </tr>
      <tr>
        <td>
          <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); }}
            onConfirm={() => handleConfirmReset(lockerAssign.id)}
            title="Resetear Locker"
            message={`¿Estás seguro de que deseas resetear Locker "${lockerAssign?.locker?.code}"?`}
            btnText={`Resetear ${lockerAssign?.locker?.code} `}
          />
        </td>
      </tr>
    </>
  );
}

export default LockerAssignRow;
