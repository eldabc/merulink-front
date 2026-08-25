import { useState } from 'react';
import { useRoles } from "../../context/RoleContext";
import { useNavigate } from 'react-router-dom';

import { getDisabledClasses } from '../../utils/global-utils';  
import ButtonDelete from '../Shared/ButtonDelete';
import ConfirmDialog from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';
import HasPermission from '../Shared/HasPermission';

// Clase del badge según la acción del permiso (create/view/edit/delete/especial)
const permissionBadgeClass = (key = '') => {
  const action = String(key).split('-')[0];
  switch (action) {
    case 'create': return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
    case 'view':   return 'border-sky-400/30 bg-sky-400/10 text-sky-300';
    case 'edit':   return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
    case 'delete': return 'border-rose-400/30 bg-rose-400/10 text-rose-300';
    default:       return 'border-slate-400/30 bg-slate-400/10 text-slate-300';
  }
};

export default function RoleRow({ role }) {

  const navigate = useNavigate();
  const { deleteRole } = useRoles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const hasEmployees = role.employeeCount > 0;
  const disabledClasses = getDisabledClasses(hasEmployees);
  const deleteBtnTitle = hasEmployees
    ? 'No se puede eliminar, rol tiene Empleados asociados'
    : 'Eliminar';

  const handleSelectedRole = (id) => {
    navigate(`/empleados/roles/ver/${id}`); 
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
        <div className="space-y-3 rounded-xl bg-[#2f3d44a7] p-3">
          {role.permissionGroups?.map((group, gi) => (
            <div key={group.key || gi} className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#9fd8ff]">
                {group.label}:
              </span>
              <span className="rounded-full bg-white/5 px-1.5 py-px text-[10px] text-gray-400">
                {group.permissions.length}
              </span>
              {group.permissions.map((perm, pi) => (
                <span
                  key={perm.key || pi}
                  className={`rounded-md border px-2 py-0.5 text-[11px] font-medium leading-4 ${permissionBadgeClass(perm.key)}`}
                >
                  {perm.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </td>
      <td className="px-4 py-3">
        <HasPermission permissions={["delete-roles"]} fallback={<SpanText text="Sin acciones" />}>
          <ButtonDelete 
            setIsModalOpen={() => handleDeleteClick(role)} 
            title={deleteBtnTitle}
            dinamicClasses={disabledClasses}
            disabled={hasEmployees} 
          />
        </HasPermission>
      </td>
    </tr>
    <tr>
      <td>
        <ConfirmDialog 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRole(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Rol"
          message={`¿Está seguro que desea eliminar Rol "${selectedRole?.label}"?`}
        />
      </td>
    </tr>
    </>
  );
}