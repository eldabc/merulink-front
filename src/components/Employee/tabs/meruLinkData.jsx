import { useEffect, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { useEmployees } from '../../../context/EmployeeContext';
import { PasswordInputEye } from '../../togglePasswordVisibility.jsx';
import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from '../../Shared/ErrorMessage.jsx';

const CRUD_ACTIONS = ['create', 'view', 'edit', 'delete'];
// const CRUD_LABELS = { create: 'Crear', view: 'Ver', edit: 'Editar', delete: 'Eliminar' };

/**
 * Parsea un array de nombres de permisos (ej: "create-schedules")
 * y devuelve un objeto agrupado por módulo con columnas CRUD + especiales.
 */
function parsePermissions(permissionNames = []) {
  const modules = {};

  for (const perm of permissionNames) {
    // Todo lo que va después del último guion es el módulo
    const lastDash = perm.lastIndexOf('-');
    if (lastDash === -1) continue;

    const action = perm.substring(0, lastDash);
    const module = perm.substring(lastDash + 1);

    if (!modules[module]) {
      modules[module] = { create: false, view: false, edit: false, delete: false, specials: [] };
    }

    if (CRUD_ACTIONS.includes(action)) {
      modules[module][action] = true;
    } else {
      modules[module].specials.push(perm);
    }
  }

  return modules;
}

// Iconos para check / cross (aceptan className)
const CheckIcon = ({ className = "w-5 h-5 text-green-400" }) => <Check className={className} />;
const CrossIcon = ({ className = "w-5 h-5 text-gray-600" }) => <X className={className} />;
 
export default function MeruLinkData({ createMode, viewMode, isEmployeeActive, disabledClasses, register, errors, employee, watch, setValue }) {
  console.log("employee", employee)
  const { loadingFieldChange, toggleEmployeeField } = useEmployees();
  const useMeruLinkWatch = watch('useMeruLink');
  const firstNameWatch = watch('firstName');
  const lastNameWatch = watch('lastName');
  const ciWatch = watch('ci');

  // Labels traducidos desde el backend
  const moduleLabels = employee?.moduleLabels || {};
  const specialLabels = employee?.specialLabels || {};
  const permissionLabels = employee?.permissionLabels || {};

  // Parsear permisos: agrupar por módulo con columnas CRUD + especiales
  const permissionModules = useMemo(() => {
    return parsePermissions(employee?.permissions || []);
  }, [employee?.permissions]);

  // Recolectar todos los permisos especiales de todos los módulos
  const allSpecials = useMemo(() => {
    const specials = [];
    for (const mod of Object.values(permissionModules)) {
      specials.push(...mod.specials);
    }
    return specials;
  }, [permissionModules]);

  const moduleEntries = Object.entries(permissionModules);
  const hasData = moduleEntries.length > 0;

  useEffect (() => {
    if (createMode && useMeruLinkWatch) {
      if (!firstNameWatch || !lastNameWatch) return;

      const firstName = (firstNameWatch || '').toLowerCase().trim();
      const lastName = (lastNameWatch || '').toLowerCase().trim();
      setValue('userName', `${firstName.charAt(0)}.${lastName}`);
      setValue('userPass', (ciWatch || '').replace(/\./g, ''));
    }
  }, [useMeruLinkWatch, firstNameWatch, lastNameWatch]);

    return (
      <>
        <div className="flex items-center gap-4 mb-4 pl-4">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <span className="text-sm">¿Usa MeruLink?</span>
              {loadingFieldChange.loading && loadingFieldChange.field === 'use_meru_link' ? (
                <span className="text-xs text-gray-500 italic">Cargando...</span>
              ) : (
                <input 
                  disabled={!isEmployeeActive}// || viewMode
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
         
              <div className='w-full mt-2.5'>
                <h2 className='text-center p-2.5 text-xl font-bold'>Meru Link permisos {employee?.firstName} {employee?.lastName}</h2>

                {!hasData ? (
                  <p className="text-center text-gray-500 text-sm py-4">Sin permisos asignados.</p>
                ) : (
                  <>
                    {/* Tabla CRUD */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse text-sm sm:text-base">
                        <thead>
                          <tr className="tr-thead-table">
                            <th className="px-4 py-3 text-left font-semibold">Módulo</th>
                            <th className="px-4 py-3 text-center font-semibold">Crear</th>
                            <th className="px-4 py-3 text-center font-semibold">Ver</th>
                            <th className="px-4 py-3 text-center font-semibold">Editar</th>
                            <th className="px-4 py-3 text-center font-semibold">Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {moduleEntries.map(([module, cols]) => (
                            <tr key={module} className="border-b tr-table">
                              <td className="px-4 py-3 text-white font-medium">
                                {moduleLabels[module] || module}
                              </td>
                              {CRUD_ACTIONS.map((action) => (
                                <td key={action} className="px-4 py-3">
                                  <div className="flex justify-center items-center">
                                    {cols[action] ? <CheckIcon /> : <CrossIcon />}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Permisos especiales */}
                    {allSpecials.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-2 px-1">
                          Permisos especiales
                        </h3>
                        <div className="bg-[#ffffff0a] rounded-lg border border-[#ffffff21] p-3">
                          <ul className="list-none space-y-1">
                            {allSpecials.map((perm) => (
                              <li key={perm} className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckIcon />
                                <span>{permissionLabels[perm] || specialLabels[perm] || perm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
            </>
          )}
        </div>
      </>
    );
};