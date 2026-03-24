import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLockers } from '../../context/LockerRoomContext';

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import { getStatusColor } from '../../utils/status-utils';
import { STATUSES, statusConfig } from '../../utils/statusesConfig.js';

function LockerRoomRow({ locker }) {

  const navigate = useNavigate();
  const { deleteLocker } = useLockers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState(null);
  
  const currentStatus = statusConfig[locker.status];

  const handleSelectedLocker = (id) => {
    navigate(`/empleados/vestuarios/lockers/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (template) => {
    setSelectedLocker(template);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedLocker) return;

    await deleteLocker(selectedLocker);
    setIsModalOpen(false);
    setSelectedLocker(null);
  };

  return (
    <>
      <tr
        key={locker.id}
        onClick={() => handleSelectedLocker(locker.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium ">
          <span className={getStatusColor(locker.status)} title={currentStatus.title.locker}>
            {currentStatus.label}
          </span>
        </td>
        <td className="px-4 py-3 text-white-800 font-medium">{locker.code}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{locker.category?.name}</td>
        <td className="px-4 py-3 text-white-700">
          {STATUSES.AVAILABLE === locker.status && (
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
              setSelectedLocker(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar Locker"
            message={`¿Estás seguro de que deseas eliminar Locker "${selectedLocker?.code}"?`}
          />
        </td>
      </tr>
    </>
  );
}

export default LockerRoomRow;