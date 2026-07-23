import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Shield, ChevronRight, Check } from 'lucide-react';
import { useRoles } from '../../context/RoleContext';

import { roleValidationSchema } from '../../utils/Validations/roleValidationSchema';

import TitleHeader from '../Shared/TitleHeader';
import LabelFieldForm from '../Shared/LabelFieldForm';
import InputGeneric from '../Shared/InputGeneric';
import ErrorMessage from '../Shared/ErrorMessage';
import Counter from '../Shared/Counter';
import FooterFormButtons from '../Shared/FooterFormButtons';

function RoleForm ({ mode = 'create', role }) {
  const navigate = useNavigate();
  const { allPermissions } = useRoles();

  const methods = useForm({ resolver: yupResolver(roleValidationSchema) });
    
  // Desestructuración de methods
  const { 
    register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting }
  } = methods;

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  
  // Cada vez que cambien los permisos seleccionados, sincronizar con el formulario
  useEffect(() => {
    setValue('permissions', [...selectedPermissions]);
    trigger('permissions');
  }, [selectedPermissions]);
  
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';

  useEffect(() => {
    const getPermissions = async () => {
      const response = await allPermissions();
      setModules(response || []);
      setLoading(false);
    };

    getPermissions();
  }, [])

  const handleModuleClick = (moduleKey) => {
    setSelectedModule(selectedModule?.key === moduleKey ? null : modules.find(m => m.key === moduleKey));
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

  const onSubmit = async (data) => {
    // console.log("data submit", data);
    let success = false;
    const dataChanges = { ...data, permissions: [...selectedPermissions] };
    console.log("dataChanges", dataChanges)
    // TODO: implementar createRole / updateRole
    // if (editMode && shift) { 
    //   success = await updateShift(dataChanges);
    // } else {
    //   success = await createShift(dataChanges);
    // }

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
            <div className='mx-auto mt-6 w-full max-w-5xl'>
              <TitleHeader title={editMode ? ( 'Editar Rol' ):( 'Datos del Rol')} dinamicClasses="!mb-5" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mb-3 div-border">

                  <LabelFieldForm field="Nombre Rol" simbol="*"/>
                <div>
                  <div className="flex flex-col">
                    <input
                      readOnly={viewMode}
                      {...register('roleName')}
                      placeholder='Ingrese nombre del Rol'
                      className={`md:w-full px-1 py-1 rounded-lg filter-input`}
                    />
                    {errors?.roleName?.message && <ErrorMessage msg={errors?.roleName?.message} />}
                  </div>
                </div>
              </div>

              {/* === Sección de Permisos === */}
              <div className="div-border mt-1">
                <div className="bg-[#2a2e30] rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ffffff21]">
                    <Shield className="w-5 h-5 text-[#9fd8ff]" />
                    <h3 className="text-base font-bold text-white">Permisos</h3>
                    <span className="ml-auto text-xs text-gray-400 bg-[#ffffff0d] px-2 py-0.5 rounded-full">
                      <Counter number={selectedPermissions.size} /> seleccionados
                    </span>
                      
                  </div>

                  {loading ? (
                    <p className="text-sm text-gray-500 text-center py-4">Cargando permisos...</p>
                  ) : modules.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No hay permisos disponibles</p>
                  ) : (
                    <div className="flex gap-4 items-center min-h-[300px] justify-center">
                      {/* === Columna 1: Lista de Módulos === */}
                      <div className="shrink-0 w-64">
                        <div className="bg-[#ffffff08] border border-[#ffffff15] rounded-lg p-3 h-full">
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ffffff15]">
                            <Shield className="w-4 h-4 text-green-400/70" />
                            <h4 className="text-sm font-semibold text-gray-300">Módulos</h4>
                          </div>

                          <div className='mb-3'>
                            {errors?.permissions?.message && <ErrorMessage msg={errors?.permissions?.message} />}
                          </div>

                          <div className="space-y-0.5">
                            {modules.map((mod) => {
                              const isSelected = selectedModule?.key === mod.key;
                              return (
                                <button
                                  key={mod.key}
                                  type="button"
                                  onClick={() => handleModuleClick(mod.key)}
                                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                                    isSelected
                                      ? 'bg-[#9fd8ff15] border border-[#9fd8ff40]'
                                      : 'hover:bg-[#ffffff0f] border border-transparent'
                                  }`}
                                >
                                  <Shield className="w-4 h-4 text-green-400/70 shrink-0" />
                                  <span className="text-sm text-gray-200 truncate flex-1 font-medium">
                                    {mod.label}
                                  </span>
                                  
                                  <Counter number={mod.permissions.length} />

                                  <ChevronRight
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${
                                      isSelected ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* === Columna 2: Permisos del módulo seleccionado === */}
                      <div
                        className={`transition-all duration-500 ease-out overflow-hidden ${
                          selectedModule
                            ? 'w-80 opacity-100 ml-0'
                            : 'w-0 opacity-0 -ml-4'
                        }`}
                      >
                        {selectedModule && (
                          <div className="bg-[#ffffff08] border border-[#ffffff15] rounded-lg p-3 h-full min-w-[280px] overflow-y-auto">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ffffff15]">
                              <Shield className="w-4 h-5 text-[#9fd8ff]" />
                              <h4 className="text-sm font-semibold text-gray-300 truncate">
                                {selectedModule.label}
                              </h4>
                            </div>
                            <div className="space-y-0.5">
                              {selectedModule.permissions.map((perm) => {
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
                                      }`}
                                      onClick={() => togglePermission(perm.key)}
                                    >
                                      {isChecked && <Check className="w-3.5 h-3.5 text-gray-900" />}
                                    </div>
                                    <span className={`text-sm ${isChecked ? 'text-gray-200' : 'text-gray-400'}`}>
                                      {perm.label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
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