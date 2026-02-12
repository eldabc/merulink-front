import { useState } from "react";
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';

function LockerRoomRow({ locker }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <tr
        key={locker.id}
        onClick={() => selectedlocker(locker.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium ">{locker.status}</td>
        <td className="px-4 py-3 text-white-800 font-medium">{locker.code}</td>
        <td className="px-4 py-3 text-white-800 font-medium ">{locker.category}</td>
        <td className="px-4 py-3 text-white-700">
           <ButtonDelete setIsModalOpen={setIsModalOpen} id={locker.id} />
        </td>
      </tr>
      <tr>
        <td>
          <ConfirmDialog 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => handleDeletelocker(locker.id)}
            title="Eliminar locker"
            message={`¿Estás seguro de que deseas eliminar Locker "${locker.code}"?`}
          />
        </td>
      </tr>
    </>
  );
}

export default LockerRoomRow;