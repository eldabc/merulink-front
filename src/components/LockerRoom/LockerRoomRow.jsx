import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLockers } from '../../context/LockerRoomContext';

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import { lockerCategories } from '../../utils/StaticData/locker-room-utils.js';
import { getStatusColor } from '../../utils/status-utils';

function LockerRoomRow({ locker }) {

  const navigate = useNavigate();
  const { deleteLocker } = useLockers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const lockerCategory = lockerCategories.find(c => c.key === locker.category);

  const selectedLocker = (id) => {
    navigate(`/empleados/vestuarios/lockers/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (template) => {
      setSelectedTemplate(template);
      setIsModalOpen(true);
    };
  
  const handleConfirmDelete = async () => {
    if (!selectedTemplate) return;

    await deleteLocker(selectedTemplate);
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <>
      <tr
        key={locker.id}
        onClick={() => selectedLocker(locker.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium ">{locker.status === 'Disponible' ? (
          <span className={getStatusColor(locker.status)} title='Locker Disponible'>Disponible</span>
        ) : (
          <span className={getStatusColor(locker.status)} title='Locker Ocupado'>Ocupado</span>
        )}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{locker.code}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{locker.category?.name}</td>
        <td className="px-4 py-3 text-white-700">
          {locker.status === 'Disponible' && (
           <ButtonDelete setIsModalOpen={() => handleDeleteClick(locker)} />
          )}
        </td>
      </tr>
      <tr>
        <td>
          <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTemplate(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar Locker"
            message={`¿Estás seguro de que deseas eliminar Locker "${selectedTemplate?.code}"?`}
          />
        </td>
      </tr>
    </>
  );
}

export default LockerRoomRow;