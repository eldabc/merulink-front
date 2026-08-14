import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLockerAssigns } from '../../context/LockerAssignContext.jsx';

import { yupResolver } from '@hookform/resolvers/yup';
import { lockerAssignValidationSchema } from '../../utils/Validations/lockerAssignValidationSchema';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';

import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import ErrorMessage from '../Shared/ErrorMessage.jsx';
import LabelFieldForm from "../Shared/LabelFieldForm";

function LockerAssignForm({ mode = 'create' }) {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(lockerAssignValidationSchema),
    });
    const { lockerAssignData, createLockerAssign, updateLockerAssign, getPadlocks, getEmployeesByCategory, getDepartments } = useLockerAssigns();
    
    const navigate = useNavigate();
    const selectedPadlock = watch('padlockId');
    const selectedDepartment = watch('departmentId');

    const { id } = useParams();
    const lockerAssign = lockerAssignData.find(a => Number(a.id) === Number(id));

    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [filteredEmployees, setfilteredEmployees] = useState([]);
    const [availablePadlocks, setAvailablePadlocks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [availableDepartments, setAvailableDepartments] = useState([]);

    const viewMode = mode === 'view';
    const editMode =  mode === 'edit';

    // Carga inicial unificada
    useEffect(() => { 
      setLoadingEmployees(true);

      const loadFormData = async () => {
        try {
          // Ejecuta las peticiones en paralelo para mantener el orden en form
          const [padlocksData, employeesData, departmentsData] = await Promise.all([
            getPadlocks(lockerAssign),
            getEmployeesByCategory(lockerAssign),
            getDepartments()
          ]);

          setAvailablePadlocks(padlocksData);
          setAvailableEmployees(employeesData);
          setAvailableDepartments(departmentsData);

        } catch (error) {
          console.error("Error cargando dependencias del formulario", error);
        } finally {
          setLoadingData(false);
          setLoadingEmployees(false);
        }
      };

      loadFormData();
    }, [lockerAssign, mode ]); //reset

    useEffect(() => {
      
      if (!selectedDepartment && !loadingData) { 
        console.log("!selectedDepartment")
        setfilteredEmployees([]);
        return;
      }
      setLoadingEmployees(true);

      const filteredEmp = availableEmployees.filter(e => String(e.department.id) === String(selectedDepartment));     
      setfilteredEmployees(filteredEmp);  

      if (selectedDepartment !== lockerAssign?.employee?.department.id) setLoadingEmployees(false);

    }, [selectedDepartment, availableEmployees]);

    useEffect(() => {
      if (!loadingData && lockerAssign && (editMode || viewMode)) {
        reset({
          lockerId: lockerAssign.locker?.id ?? null,
          padlockId: lockerAssign.locker?.padlock?.id ?? '',
          departmentId: lockerAssign.employee?.department.id ?? (selectedDepartment ?? ''),
          employeeId: lockerAssign.employee?.id ?? '',
        });
        setLoadingEmployees(false);
      }
    }, [availableEmployees]); //filteredEmployees
  
    const onError = (formErrors) => {
      console.warn('Form validation errors:', formErrors);
      if (!formErrors) return;
    };
  
    const onSubmit = async (data) => {
      // console.log("submit", data);
      let success = false;
      const padlockSelected = availablePadlocks.find(p => String(p.id).trim() === String(data.padlockId).trim());
      const employeeSelected = availableEmployees.find(p => String(p.id).trim() === String(data.employeeId).trim());
      const departmentelected = availableDepartments.find(p => String(p.id).trim() === String(data.departmentId).trim());

      if (editMode && lockerAssign) {
        const dataEdit = {
          ...lockerAssign,
          padlock: {
            ...padlockSelected
          },
          employee: {
            ...employeeSelected,
            departmentName: departmentelected?.departmentName
          }
        }
        success = await updateLockerAssign(dataEdit);
      } else {
        success = await createLockerAssign(data);
      }
  
      if (success) {
        navigate(-1);
      }
    };

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto p-2 rounded-lg">
          {(viewMode) && <HeadFormButtons url={`/empleados/vestuarios/casilleros/editar/${lockerAssign?.id}`} data={[]} /> }
          
          <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
            <form onSubmit={handleSubmit(onSubmit, onError)}> 
              <div className="w-full text-white rounded-lg shadow-md p-1 flex flex-col sm:flex-row sm:justify-end sm:space-x-8 ">
                {lockerAssign?.employee?.id && (
                  <>
                   <div className="flex items-center space-x-2">
                  <LabelFieldForm field="Código Asignación" />
                  <div className="">
                      <span className="px-2 py-1 rounded bg-[#505253] text-sm font-medium">
                        {lockerAssign?.assignCode ?? ''}
                      </span>
                  </div>
                  </div>
                   <div className="flex items-center space-x-2">
                  <LabelFieldForm field="Fecha" />
                  <div className="">
                      <span className="px-2 py-1 rounded bg-[#505253] text-sm font-medium">
                        {lockerAssign?.assignDate ?? ''}
                      </span>
                  </div>
                  </div>
                  </>
                )}
              </div>
              <div className="border-t border-b border-[#ffffff21] py-6 mb-4">
                  <div className='div-border'>
                    <div className="w-full bg-[#2f3d44] text-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-start sm:space-x-8">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Código:</span>
                        <span className="text-lg font-semibold">{lockerAssign?.locker?.code}</span>
                      </div>

                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <span className="text-sm text-gray-300">Estatus:</span>
                        <span className="px-2 py-1 rounded bg-[#505253] text-sm font-medium">
                          {lockerAssign?.locker?.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <span className="text-sm text-gray-300">Categoría:</span>
                        <span className="px-2 py-1 rounded bg-[#505253] text-sm font-medium">
                          {lockerAssign?.locker?.category?.name}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6">    
                      <h3 className='text-xl font-bold'>{lockerAssign?.locker?.padlock?.id ? ( 'Editar Emparejar Casillero' ):( 'Emparejar Casillero')}</h3>
                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border div-border'>

                          <LabelFieldForm field="Candado" simbol="*" />
                          <div className="max-w-2xl">
                            <select 
                              {...register('padlockId')}
                              disabled={viewMode || loadingData}
                              className={`text-xl w-64 px-3 py-2 rounded-lg filter-input text-gray-300
                                ${(viewMode || loadingData) && 'opacity-50 cursor-not-allowed'}`}
                            >
                              <option value="" className="bg-[#3c4042]"> {loadingData ? "Cargando..." : "Seleccionar..."} </option>
                              
                              {availablePadlocks.map((item) => (
                                <option key={item.id} value={item.id} className='bg-[#3c4042]'>
                                  {item.serial}
                                </option>
                              ))}
                            </select>

                            {errors?.padlockId && <ErrorMessage msg={errors.padlockId.message} /> }  
                          </div>
                        </div>
                      
                      {(selectedPadlock && !loadingData) && (
                        <>
                        <h3 className='text-xl font-bold'>{lockerAssign?.employee?.id ? ( 'Editar Asignación de Casillero' ):( 'Asignar Casillero')}</h3>
                          <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border div-border'>
                            
                            <LabelFieldForm field="Departamento" simbol="*" />
                            <div className='max-w-2xl'>
                              <select 
                                {...register('departmentId')}
                                disabled={viewMode || loadingData}
                                className={`text-xl w-64 px-3 py-2 rounded-lg filter-input text-gray-300
                                  ${(viewMode || loadingData) && 'opacity-50 cursor-not-allowed'}`}
                              >
                                <option className="bg-[#3c4042]" value=""> {loadingData ? "Cargando..." : "Seleccionar..."} </option>
                                
                                {availableDepartments.map((item) => (
                                  <option key={item.id} value={item.id} className='bg-[#3c4042]'>
                                    {item.departmentName}
                                  </option>
                                ))}
                              </select>
                              {errors?.departmentId && <ErrorMessage msg={errors.departmentId.message} /> }  
                            </div>

                            <LabelFieldForm field="Empleado" simbol="*" />
                            <div className='max-w-2xl'>
                              <select 
                                {...register('employeeId')}
                                disabled={viewMode || loadingEmployees || !selectedDepartment}
                                className={`text-xl w-64 px-3 py-2 rounded-lg filter-input text-gray-300
                                  ${(viewMode || loadingEmployees || !selectedDepartment) && 'opacity-50 cursor-not-allowed'}`}
                              >
                                <option className="bg-[#3c4042]" value=""> {loadingEmployees ? "Cargando..." : "Seleccionar..."} </option>
                                
                                {filteredEmployees.map((item) => (
                                  <option key={item.id} value={item.id} className='bg-[#3c4042]'>
                                    {item.firstName} {item.lastName}
                                  </option>
                                ))}
                              </select>
                              {errors?.employeeId && <ErrorMessage msg={errors.employeeId.message} /> }  
                            </div>
                          </div>
                        </>
                      )}
                    </div> 
                  </div>
              </div>
              <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />
            </form>
          </div>
        </div>
  );
}

export default LockerAssignForm;