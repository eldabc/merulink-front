import { useEffect, useState, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { useEmployees } from '../../../context/EmployeeContext';
import { PasswordInputEye } from '../../togglePasswordVisibility.jsx';
import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from '../../Shared/ErrorMessage.jsx';
import OptionSelect from '../../Shared/OptionSelect';
import { getRoles } from '../../../services/masterDataService';

// Iconos para check / cross (solo para modo view)
const CheckIcon = ({ className = "w-5 h-5 text-green-400" }) => <Check className={className} />;
const CrossIcon = ({ className = "w-5 h-5 text-gray-600" }) => <X className={className} />;

export default function MeruLinkData({ createMode, viewMode, isEmployeeActive, disabledClasses, register, errors, employee, watch, setValue }) {
  const { loadingFieldChange, toggleEmployeeField } = useEmployees();
  const useMeruLinkWatch = watch('useMeruLink');
  const firstNameWatch = watch('firstName');
  const lastNameWatch = watch('lastName');
  const ciWatch = watch('ci');

  const [roles, setRoles] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const checkedPerms = watch('permissions') || [];
  const isBlocked = viewMode || !isEmployeeActive;

  // Cargar roles + todos los permisos disponibles al activar useMeruLink
  useEffect(() => {
    if (!useMeruLinkWatch) return;
    setLoadingRoles(true);
    getRoles()
      .then((res) => {
        setRoles(res.data || []);
        setAllModules(res.allModules || []);
      })
      .catch(() => console.error('Error al cargar roles'))
      .finally(() => setLoadingRoles(false));
  }, [useMeruLinkWatch]);

  // Precargar roleSnapshot en modo edición
  useEffect(() => {
    if (createMode || viewMode) return;
    const snapshot = employee?.roleSnapshot;
    if (!snapshot) return;

    setValue('roleId', snapshot.roleId);
    setValue('permissions', snapshot.permissions);
    setSelectedRoleId(snapshot.roleId);
  }, [employee?.roleSnapshot]);

  // Al cambiar el select de rol, precargar sus permisos
  const handleRoleChange = useCallback((e) => {
    const roleId = Number(e.target.value);
    setSelectedRoleId(roleId);
    setValue('roleId', roleId);

    const role = roles.find((r) => r.value === roleId);
    setValue('permissions', role?.permissions || []);
  }, [roles, setValue]);

  // Toggle de un permiso en el array
  const togglePerm = useCallback((perm) => {
    if (isBlocked) return;
    const current = checkedPerms;
    const next = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm];
    setValue('permissions', next);
  }, [checkedPerms, setValue, isBlocked]);

  // Autocompletar username/password
  useEffect(() => {
    if (createMode && useMeruLinkWatch) {
      if (!firstNameWatch || !lastNameWatch) return;
      const firstName = (firstNameWatch || '').toLowerCase().trim();
      const lastName = (lastNameWatch || '').toLowerCase().trim();
      setValue('userName', `${firstName.charAt(0)}.${lastName}`);
      setValue('userPass', (ciWatch || '').replace(/\./g, ''));
    }
  }, [useMeruLinkWatch, firstNameWatch, lastNameWatch]);

  // Rol seleccionado (para mostrar texto en edit/view)
  const selectedRole = roles.find((r) => r.value === selectedRoleId);
  const roleNameText = selectedRole?.label || employee?.roleSnapshot?.roleName || '';

  const CRUD_HEADERS = ['create', 'view', 'edit', 'delete'];
  const CRUD_LABELS = { create: 'Crear', view: 'Ver', edit: 'Editar', delete: 'Eliminar' };

  return (
    <>
      <div className="flex items-center gap-4 mb-4 pl-4">
        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
          <span className="text-sm">¿Usa MeruLink?</span>
            {loadingFieldChange.loading && loadingFieldChange.field === 'use_meru_link' ? (
              <span className="text-xs text-gray-500 italic">Cargando...</span>
            ) : (
              <input 
                disabled={!isEmployeeActive}
                type="checkbox"
                {...register('useMeruLink')}
                className={`w-4 h-4 rounded ${!isEmployeeActive && disabledClasses}`}
                onClick={() => !createMode && toggleEmployeeField(employee, "use_meru_link")}
              />
            )}
        </label>
      </div>
      <div className="border border-[#ffffff21] p-5 mt-6">
        {useMeruLinkWatch && (
          <>
            <div className="col-span-full mx-auto w-full max-w-lg rounded-xl p-6 md:p-4">
              <div className='bg-[#ffffff21] rounded-xl p-6 md:p-2"'>
                <div className='flex flex-col md:flex-row md:items-center mb-4 gap-2'>
                  <LabelFieldForm field="Nombre Usuario" simbol="*" />
                  <div className='w-full md:w-auto md:flex-1'>
                      <input 
                        readOnly={viewMode}
                        placeholder='Ingrese nombre usuario'
                        {...register('userName')} className={`w-full md:w-64 px-3 py-2 rounded-lg filter-input ${disabledClasses}`} 
                      />
                    {errors.userName && <ErrorMessage msg={errors.userName.message} />}
                  </div>
                </div>
                <div className='flex flex-col md:flex-row md:items-center gap-2'>
                  <LabelFieldForm field="Contraseña" simbol="*" />
                  <div className='md:ml-10 w-full md:flex-1'>
                    <PasswordInputEye register={register} errors={errors} viewMode={viewMode} hasUserCreated={!!employee?.userName} />
                  </div>
                </div>

                {/* Select de Rol (visible en create/edit) */}
                {!viewMode && (
                  <div className='flex flex-col md:flex-row md:items-center gap-2 mt-3'>
                    <LabelFieldForm field="Rol" simbol="*" />
                    <div className='md:ml-10 w-full md:flex-1'>
                      <select
                        disabled={!isEmployeeActive}
                        value={selectedRoleId || ''}
                        onChange={handleRoleChange}
                        className={`w-full md:w-64 px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                      >
                        <option className="bg-[#3c4042]" value="">{loadingRoles ? 'Cargando...' : 'Seleccionar rol'}</option>
                        {roles.map((role) => (
                          <option className="bg-[#3c4042]" key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors.roleId && <ErrorMessage msg={errors.roleId.message} />}
                    </div>
                  </div>
                )}

                {/* Texto informativo del rol (edit/view) */}
                {!createMode && roleNameText && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                    <span className="font-medium text-gray-300">Rol asignado:</span>
                    <span className="text-[#9fd8ff]">{roleNameText}</span>
                  </div>
                )}

                <div className="flex items-start mt-3 gap-2">
                  <input
                    disabled={viewMode}
                    type="checkbox"
                    {...register('changePassNextLogin')}
                    className={`w-4 mt-1 ${disabledClasses}`}
                  />
                  <label className="text-sm text-gray-300">
                    Cambia la contraseña al próximo inicio.
                  </label>
                </div>
              </div>
            </div>

            {selectedRoleId && useMeruLinkWatch && (
              <div className='w-full mt-2.5'>
                <h2 className='text-center p-2.5 text-xl font-bold'>
                  Permisos - {roleNameText}
                </h2>

                {/* Tabla de módulos CRUD + Especiales */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm sm:text-base">
                    <thead>
                      <tr className="tr-thead-table">
                        <th className="px-4 py-3 text-left font-semibold">Módulo</th>
                        {CRUD_HEADERS.map((action) => (
                          <th key={action} className="px-4 py-3 text-center font-semibold">
                            {CRUD_LABELS[action]}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-center font-semibold">Permisos Especiales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allModules.map((mod) => (
                        <tr key={mod.key} className="border-b tr-table">
                          <td className="px-4 py-3 text-white font-medium">{mod.label}</td>
                          {CRUD_HEADERS.map((action) => {
                            const permName = mod[action];
                            if (!permName) {
                              return (
                                <td key={action} className="px-4 py-3 text-center text-gray-600 text-xs">
                                  —
                                </td>
                              );
                            }
                            const isChecked = checkedPerms.includes(permName);
                            return (
                              <td key={action} className="px-4 py-3">
                                <div className="flex justify-center items-center">
                                  {isBlocked ? (
                                    isChecked ? <CheckIcon /> : <CrossIcon />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => togglePerm(permName)}
                                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                                    />
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          {/* Columna de especiales del módulo */}
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 items-start">
                              {mod.specials.map((sp) => {
                                const isChecked = checkedPerms.includes(sp.key);
                                return (
                                  <label key={sp.key} className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                                    {isBlocked ? (
                                      isChecked ? <CheckIcon className="w-3.5 h-3.5" /> : <CrossIcon className="w-3.5 h-3.5" />
                                    ) : (
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => togglePerm(sp.key)}
                                        className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer"
                                      />
                                    )}
                                    <span className="whitespace-nowrap">{sp.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};