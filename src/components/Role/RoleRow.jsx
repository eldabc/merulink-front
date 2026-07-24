import { useState } from 'react';
import { useRoles } from "../../context/RoleContext";
import { useNavigate } from 'react-router-dom';

import { getDisabledClasses } from '../../utils/global-utils';  
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';

export default function RoleRow({ role }) {

  const navigate = useNavigate();
  const { deleteRole } = useRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const blockBtn = role.employees?.length > 0 ? true : false;
  const disabledClasses = getDisabledClasses(blockBtn);
  const deleteBtnTitle = blockBtn ? 'No se puede eliminar, rol tiene Empleados asociados' : 'Eliminar';

  const handleSelectedRole = (id) => {
    navigate(`/empleados/roles/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedRole) return;

    await deleteRole(selectedRole);
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <>
    <tr
      key={role.id}
      onClick={() => handleSelectedRole(role.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-gray-200 font-medium">{role.label}</td>
      <td className="px-4 py-3 text-gray-300">
        <div className='bg-[#2f3d44a7] rounded-lg pl-2'>
        {role.permissionGroups?.map((group, gi) => (
          <div key={group.key || gi}>
            <span className="font-semibold text-sm text-gray-200">{group.label}:</span>{' '}
            {group.permissions.map((perm, pi) => (
              <span className='text-xs text-gray-500 hover:text-[#9fd8ff]' key={perm.key || pi}>
                {perm.label}{pi < group.permissions.length - 1 ? '. ' : ''}
              </span>
            ))}
          </div>
        ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <ButtonDelete 
          setIsModalOpen={() => handleDeleteClick(role)} 
          title={deleteBtnTitle}
          dinamicClasses={disabledClasses}
          disabled={blockBtn} 
        />
      </td>
    </tr>
    <ConfirmDialog 
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedRole(null);
      }}
      onConfirm={handleConfirmDelete}
      title="Eliminar Rol"
      message={`¿Está seguro que desea eliminar Rol "${selectedRole?.name}"?`}
    />
    </>
  );
}