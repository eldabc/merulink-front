import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Shield, ChevronRight, Check } from 'lucide-react';
import { useRoles } from '../../context/RoleContext';

import { roleValidationSchema } from '../../utils/Validations/roleValidationSchema';
import { getDisabledClasses } from '../../utils/global-utils';  

import Counter from '../Shared/Counter';
import TitleHeader from '../Shared/TitleHeader';
import LabelFieldForm from '../Shared/LabelFieldForm';
import InputGeneric from '../Shared/InputGeneric';
import ErrorMessage from '../Shared/ErrorMessage';
import FooterFormButtons from '../Shared/FooterFormButtons';
import HeadFormButtons from '../Shared/HeadFormButtons';
import SpanText from '../Shared/SpanText';

function RoleForm ({ mode = 'create', role }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allPermissions, getRole, createRole, updateRole } = useRoles();

  const methods = useForm({ resolver: yupResolver(roleValidationSchema) });
    
  // Desestructuración de methods
  const { 
    register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting }
  } = methods;

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState(new Set());
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [roleResult, setRoleResult] = useState(null);
  
  // Cada vez que cambien los permisos seleccionados, sincronizar con el formulario
  useEffect(() => {
    setValue('permissions', [...selectedPermissions]);
    trigger('permissions');
  }, [selectedPermissions]);
  
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';
  const disabledClasses = getDisabledClasses(loading, viewMode);

  useEffect(() => {
    const getPermissions = async () => {
      const response = await allPermissions();
      setModules(response || []);
      setLoading(false);
    };

    getPermissions();
  }, []);

  useEffect(() => {
    if (id && !isNaN(id)) {
      const getRoleById = async () => {
        const data = await getRole(id); 
        setRoleResult(data);
      };
      
      getRoleById();
    }
  }, [id]);

  // Pre-seleccionar permisos view/edit
  useEffect(() => {
    if (!roleResult?.data || modules.length === 0) return;

    const roleData = roleResult.data;
    const permSet = new Set(roleData.permissions || []);

    setSelectedPermissions(permSet);
    setValue('roleName', roleData.label);

    // Expandir módulos que tengan al menos un permiso del rol
    const moduleKeys = new Set();
    modules.forEach(mod => {
      if (mod.permissions.some(p => permSet.has(p.key))) {
        moduleKeys.add(mod.key);
      }
    });
    setSelectedModules(moduleKeys);

  }, [roleResult, modules]);

  const toggleModule = (moduleKey) => {
    setSelectedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleKey)) {
        next.delete(moduleKey);
        // Al desmarcar el módulo, también se quitan sus permisos
        const mod = modules.find(m => m.key === moduleKey);
        if (mod) {
          const permKeys = mod.permissions.map(p => p.key);
          setSelectedPermissions(prevPerms => {
            const newPerms = new Set(prevPerms);
            permKeys.forEach(k => newPerms.delete(k));
            return newPerms;
          });
        }
      } else {
        next.add(moduleKey);
      }
      return next;
    });
  };

  const togglePermission = (permKey) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permKey)) {
        next.delete(permKey);
      } else {
        next.add(permKey);
      }
      return next;
    });
  };

  const changeRoleLabel = (e) => {
    const cleaned = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    const capitalized = cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
    setValue('roleName', capitalized, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data) => {
    // console.log("data submit", data);
    let success = false;
    const dataChanges = { ...data, permissions: [...selectedPermissions] };
    console.log("dataChanges", dataChanges)
    // TODO: implementar createRole / updateRole
    if (editMode && role) { 
      success = await updateRole(dataChanges);
    } else {
      success = await createRole(dataChanges);
    }

    if (success) {
      navigate(`/empleados/roles`);
    }
  };

  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">  
      
      {(viewMode) && <HeadFormButtons url={`/empleados/cargos/editar/${role?.id}`} data={[]} /> }
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='mx-auto mt-6 w-full'>
              <TitleHeader title={editMode ? ( 'Editar Rol' ):( 'Datos del Rol')} dinamicClasses="!mb-5" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mb-3 div-border">

                  <LabelFieldForm field="Nombre Rol" simbol="*"/>
                <div>
                  <div className="flex flex-col">
                    <input
                      readOnly={viewMode}
                      {...register('roleName')}
                      placeholder='Ingrese nombre del Rol'
                      className={`md:w-full px-1 py-1 rounded-lg filter-input ${disabledClasses}`}
                      onChange={(e) => changeRoleLabel(e) }
                    />
                    {errors?.roleName?.message && <ErrorMessage msg={errors?.roleName?.message} />}
                  </div>
                </div>
              </div>

              {/* === Sección de Permisos === */}
              <div className="div-border mt-1">
                <div className={`bg-[#2a2e30] rounded-lg p-2`}>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ffffff21]">
                    <Shield className="w-5 h-5 text-[#9fd8ff]" />
                    <h3 className="text-base font-bold text-white">Permisos</h3>
                    <span className="ml-auto text-xs text-gray-400 bg-[#ffffff0d] px-2 py-0.5 rounded-full">
                      <Counter number={selectedPermissions.size} /> seleccionados
                    </span>
                      
                  </div>

                  {loading ? (
                    <SpanText text="Cargando permisos..." />
                  ) : modules.length === 0 ? (
                    <SpanText text="No hay permisos disponibles" />
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-4 min-h-[300px]">
                      {/* === Columna 1: Lista de Módulos === */}
                      <div className="shrink-0 w-full lg:w-64">
                        <div className="bg-[#ffffff08] border border-[#ffffff15] rounded-lg p-3 h-full">
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ffffff15]">
                            <Shield className="w-4 h-4 text-green-400/70" />
                            <h4 className="text-sm font-semibold text-gray-300">Módulos</h4>
                          </div>

                          <div className='mb-3'>
                            {errors?.permissions?.message && <ErrorMessage msg={errors?.permissions?.message} />}
                          </div>

                          <div className={`space-y-0.5 ${disabledClasses}`}>
                            {modules.map((mod) => {
                              const isChecked = selectedModules.has(mod.key);
                              return (
                                <div
                                  key={mod.key}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                                    isChecked
                                      ? 'bg-[#9fd8ff15] border border-[#9fd8ff40]'
                                      : 'hover:bg-[#ffffff0f] border border-transparent'
                                  }`}
                                >
                                  <Shield className="w-4 h-4 text-green-400/70 shrink-0" />
                                  <span className="text-sm text-gray-200 truncate flex-1 font-medium">
                                    {mod.label}
                                  </span>
                                  
                                  <Counter number={mod.permissions.length} />

                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => !viewMode && toggleModule(mod.key)}
                                    className={`w-4 h-4 rounded border-gray-500 bg-transparent cursor-pointer shrink-0 accent-[#9fd8ff] ${disabledClasses}`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* === Columna 2: Permisos de módulos seleccionados === */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 flex-1 min-h-[300px] content-start">
                        {[...selectedModules].map((moduleKey) => {
                          const mod = modules.find(m => m.key === moduleKey);
                          if (!mod) return null;
                          return (
                            <div key={mod.key} className="bg-[#ffffff08] border border-[#ffffff15] rounded-lg p-3 overflow-y-auto">
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ffffff15]">
                                <Shield className="w-4 h-5 text-[#9fd8ff]" />
                                <h4 className="text-sm font-semibold text-gray-300 truncate">
                                  {mod.label}
                                </h4>
                              </div>
                              <div className={`space-y-0.5 ${disabledClasses}`}>
                                {mod.permissions.map((perm) => {
                                  const isChecked = selectedPermissions.has(perm.key);
                                  return (
                                    <label
                                      key={perm.key}
                                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-200 border ${
                                        isChecked
                                          ? 'bg-[#9fd8ff15] border-[#9fd8ff40]'
                                          : 'hover:bg-[#ffffff0f] border-transparent'
                                      }`}
                                    >
                                      <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                                          isChecked
                                            ? 'bg-[#9fd8ff] border-[#9fd8ff]'
                                            : 'border-gray-500 bg-transparent'
                                        } ${disabledClasses}`}
                                        onClick={() => !viewMode && togglePermission(perm.key)}
                                      >
                                        {isChecked && <Check className="w-3.5 h-3.5 text-gray-900" />}
                                      </div>
                                      <span className={`text-sm ${isChecked ? 'text-gray-200' : 'text-gray-400'}`}> {perm.label} </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                        {[...selectedModules].length === 0 && (
                          <div className="flex items-center justify-center w-full col-span-full min-h-[300px] text-gray-500 text-sm">
                            Marca un módulo para ver sus permisos
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />
            </div>
          </div>
        </div>
      </form>
      </FormProvider>
    </div>

  );
}

export default RoleForm;