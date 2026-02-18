import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLockers } from '../../context/LockerRoomContext';

import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import { lockerCategories } from '../../utils/StaticData/locker-room-utils.js';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

function LockerRoomRow({ locker }) {

  const navigate = useNavigate();
  const { deleteLocker } = useLockers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const lockerCategory = lockerCategories.find(c => c.key === locker.category);

  const selectedLocker = (locker) => {
    navigate("/empleados/vestuarios/lockers/ver", { 
      state: { data: locker } 
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
        onClick={() => selectedLocker(locker)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium ">{locker.status === 'Disponible' ? (
          <BuildingOfficeIcon className="w-6 h-6 text-[#dcfce7]" title='Locker Disponible'/>
        ) : (
          <BuildingOfficeIcon className="w-6 h-6 text-[#fee2e2]" title='Locker Ocupado'/>
        )}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{locker.code}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{lockerCategory?.value}</td>
        <td className="px-4 py-3 text-white-700">
           <ButtonDelete setIsModalOpen={() => handleDeleteClick(locker)} />
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