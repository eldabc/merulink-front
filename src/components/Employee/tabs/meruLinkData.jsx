import { useEffect, useState, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useEmployees } from '../../../context/EmployeeContext';
import { useAuth } from '../../../context/AuthContext';
import { getRoles } from '../../../services/masterDataService';

import { PasswordInputEye } from '../../togglePasswordVisibility';
import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from '../../Shared/ErrorMessage';
import OptionSelect from '../../Shared/OptionSelect';
import SpanText from '../../Shared/SpanText';

export default function MeruLinkData({ createMode, viewMode, isEmployeeActive, disabledClasses, register, errors, employee, watch, setValue }) {
  
  const { loadingFieldChange, toggleEmployeeField, toggleResetPass } = useEmployees();
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingResetPass, setLoadingResetPass] = useState(false);
  
  const useMeruLinkWatch = watch('useMeruLink');
  const firstNameWatch = watch('firstName');
  const lastNameWatch = watch('lastName');
  const checkedPerms = watch('permissions') || [];
  const roleIdWatch = watch('roleId');
  const ciWatch = watch('ci');

  const isBlocked = viewMode || !isEmployeeActive;
  const hasUserCreated = !!employee?.userName;

  const CRUD_HEADERS = ['create', 'view', 'edit', 'delete'];
  const CRUD_LABELS = { create: 'Crear', view: 'Ver', edit: 'Editar', delete: 'Eliminar' };
  
  // Rol seleccionado para mostrar texto en edit/view
  const selectedRole = roles.find((r) => r.value === Number(roleIdWatch));
  const roleNameText = selectedRole?.label || employee?.roleSnapshot?.roleName;

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

  // Precargar roleSnapshot en modo edit/view
  useEffect(() => { 
    if (createMode) return;
    const snapshot = employee?.roleSnapshot;
    if (!snapshot) return;

    setValue('roleId', snapshot.roleId);
    setValue('permissions', snapshot.permissions);
  }, [employee?.roleSnapshot]);

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

  // Al cambiar el select de rol, precargar sus permisos
  const handleRoleChange = useCallback((e) => {
    const roleId = Number(e.target.value);
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

  const handleResetPass = async () => {
    setLoadingResetPass(true);
    await toggleResetPass(employee);
    setLoadingResetPass(false);
  };
  
  // console.log("hasUserCreated", hasUserCreated)
  return (
    <>
      <div className="flex items-center gap-4 mb-4 pl-4">
        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
          <span className="text-sm">¿Usa MeruLink?</span>
            {loadingFieldChange.loading && loadingFieldChange.field === 'use_meru_link' ? (
              <SpanText text="Cargando..." />
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
              <div className='bg-[#ffffff21] rounded-xl p-6'>
                
                {/* Fila: Nombre de Usuario */}
                <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2'>
                  <LabelFieldForm field="Nombre Usuario" simbol="*" />
                  <div className='w-full md:w-auto md:ml-auto'>
                    <input 
                      readOnly={viewMode}
                      placeholder='Ingrese nombre usuario'
                      {...register('userName')} 
                      className={`w-full md:w-64 px-3 py-2 rounded-lg filter-input ${disabledClasses}`} 
                    />
                    {errors.userName && <ErrorMessage msg={errors.userName.message} />}
                  </div>
                </div>

                {/* Fila: Contraseña */}
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                  <LabelFieldForm field="Contraseña" simbol="*" />
                  <div className='w-full md:w-64 md:ml-auto'>
                    <PasswordInputEye register={register} errors={errors} viewMode={viewMode} hasUserCreated={hasUserCreated} />
                  </div>
                </div>

                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3'>
                  <LabelFieldForm field="Rol" simbol="*" />
                  <div className='w-full md:w-64 md:ml-auto'>
                    <select
                      {...register('roleId')}
                      disabled={!isEmployeeActive || viewMode}
                      value={roleIdWatch || ''}
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

                {/* Reset */}
                <div className="flex items-start md:justify-end mt-3 gap-2">
                  {hasUserCreated ? (
                    loadingResetPass ? (
                      <SpanText text="Cargando..." />
                    ) : (
                      <Link 
                        onClick={(e) => { if (user.isAdmin) handleResetPass(); else e.preventDefault(); }} 
                        title='Restablecer contraseña con cédula del empleado'
                        className="text-gray-300! text-[14px] hover:text-[#9fd8ff]! transition-colors duration-300"
                      >
                        Resetear contraseña
                      </Link>
                    )
                  ) : (
                    <>
                      <input
                        disabled={viewMode}
                        type="checkbox"
                        {...register('changePassNextLogin')}
                        className={`w-5 h-5 ${disabledClasses}`}
                      />
                      <label className="text-sm text-gray-300 hover:text-[#9fd8ff]">
                        {hasUserCreated ? '' : 'Cambia la contraseña al próximo inicio.'}
                      </label>
                    </>
                  )}      
                </div>
              </div>
            </div>

            {roleIdWatch && useMeruLinkWatch && (
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
                                  <input
                                    disabled={isBlocked}
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => togglePerm(permName)}
                                    className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                                  />
                                </div>
                              </td>
                            );
                          })}
                          {/* Columna de especiales del módulo */}
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 items-start w-max mx-auto">
                              {mod.specials.map((sp) => {
                                const isChecked = checkedPerms.includes(sp.key);
                                return (
                                  <label key={sp.key} className="flex items-start gap-1.5 text-xs text-gray-300 cursor-pointer">
                                    <input
                                      disabled={isBlocked}
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => togglePerm(sp.key)}
                                      className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer"
                                    />
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