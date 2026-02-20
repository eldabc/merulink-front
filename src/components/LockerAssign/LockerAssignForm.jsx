import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLockerAssigns } from '../../context/LockerAssignContext.jsx';

import { yupResolver } from '@hookform/resolvers/yup';
import { lockerAssignValidationSchema } from '../../utils/Validations/lockerAssignValidationSchema';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';

import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import ErrorMessage from '../Shared/ErrorMessage.jsx';
import LabelFieldForm from "../Shared/LabelFieldForm";
import { lockerCategories, lockers } from '../../utils/StaticData/locker-room-utils.js';
import TitleHeader from '../Shared/TitleHeader';

function LockerAssignForm({ mode = 'create' }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(lockerAssignValidationSchema),
    });
    const { createLockerAssign, updateLockerAssign, getLockers, getPadlocks, getEmployeesByCategory } = useLockerAssigns();
    
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCategory = watch('category');
    const selectedLocker = watch('lockerId');
    const selectedPadlock = watch('padlockId')
    const lockerAssign = location.state?.data;
    const [availableLockers, setAvailableLockers] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [availablePadlocks, setAvailablePadlocks] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    const createMode = mode === 'create'
    const viewMode = mode === 'view';
    const editMode =  mode === 'edit';

    useEffect(() => {
      const fetchData = async () => {
        if (selectedCategory) {
          setLoadingData(true);
          
          const data = await getLockers(selectedCategory);
          
          setAvailableLockers(data);
          setLoadingData(false);

          fetchEmployeesInBackground(selectedCategory);

        } else {
          setAvailableLockers([]);
          setAvailableEmployees([]);
        }
      };

      const fetchEmployeesInBackground = async (category) => {
        setLoadingEmployees(true);
        try {
          const empData = await getEmployeesByCategory(category);
          setAvailableEmployees(empData);
        } finally {
          setLoadingEmployees(false);
        }
      };

      fetchData();


    }, [selectedCategory]);

    useEffect(() => {
      const fetchPadlocks = async () => {
        if (selectedCategory && availableLockers?.length > 0) {
          setLoadingData(true);
          
          const data = await getPadlocks();

          setAvailablePadlocks(data);
          setLoadingData(false);
        } else {
          setAvailablePadlocks([]);
        }
      };

      fetchPadlocks();
    }, [availableLockers]);

    useEffect(() => {
      if (lockerAssign && (editMode || viewMode)) {
        reset(
          lockeAssignReset(lockerAssign)
        );
  
      } else if (createMode) {
        reset(
          lockeAssignReset(null)
        );
      }
    }, [lockerAssign, mode, reset]);
  
    const lockeAssignReset = (lockerAssign) => {
      return {
          category: lockerAssign?.category ?? null,
          lockerId: lockerAssign?.lockerId ?? null,
          employeeId: lockerAssign?.employeeId ?? null,
      }
  
    }
  
    const onError = (formErrors) => {
      console.warn('Form validation errors:', formErrors);
      if (!formErrors) return;
    };
  
    const onSubmit = async (data) => {
      let success = false;
  
      if (editMode && lockerAssign) {
        const dataEdit = { 
          ...data, 
          id: lockerAssign.id, 
        }
        success = await updateLockerAssign(dataEdit);
      } else {
        success = await createLockerAssign(data);
      }
  
      if (success) {
        if (createMode) navigate(-1);
        else navigate(-2);
      }
    };

  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
          {(viewMode) && <HeadFormButtons url="/empleados/vestuarios/candados/editar" data={lockerAssign} /> }
          
          <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
            <form onSubmit={handleSubmit(onSubmit, onError)}> 
              <div className="flex flex-row justify-start mb-4 ml-2 gap-2.5">
                {lockerAssign && (
                  <>
                  <LabelFieldForm field="Código" simbol="*" />
                  <div className="">
                      <input type="text" value={lockerAssign?.assignCode ?? ''} className='mt-2 rounded-lg filter-input' disabled={true}/> 
                  </div>
                  <LabelFieldForm field="Fecha" simbol="*" />
                  <div className="">
                      <input type="text" value={lockerAssign?.assignDate ?? ''} className='mt-2 rounded-lg filter-input' disabled={true}/> 
                  </div>
                  </>
                )}
              </div>
              <div className="border-t border-b border-[#ffffff21] py-6 mb-4">
                  <div className='border border-[#ffffff21]
                                  md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                  md:[&>*:nth-child(2n)]:pl-4 p-7'
                  >
                    <div className="mt-6">    
                      <TitleHeader title={editMode ? ( 'Editar Emparejar Casillero' ):( 'Emparejar Casillero')} />
                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border border-[#ffffff21]
                                        md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                        md:[&>*:nth-child(2n)]:pl-4 p-7'
                        >
                          <LabelFieldForm field="Categoría" simbol="*" />
                          <div className="">
                            <select 
                              {...register('category')} //, { onChange: handleCategoryChange }
                              disabled={viewMode }
                              className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
                              ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}
                            >
                              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                              {lockerCategories.map((item) => (
                                <option key={`category-${item.id}`}  className='bg-[#3c4042]' value={item.key}>{item.value}</option>                
                              ))}
                            </select>
                              {errors?.category && <ErrorMessage msg={errors.category.message} /> } 
                          </div>

                          <LabelFieldForm field="Locker" simbol="*" />
                          <div className="max-w-2xl">
                            <select 
                              {...register('lockerId')}
                              disabled={viewMode || !selectedCategory || loadingData}
                              className={`text-xl w-64 px-3 py-2 rounded-lg filter-input text-gray-300
                                ${(viewMode || !selectedCategory || loadingData) ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-[#2a2d2e]'}`}
                            >
                              <option className="bg-[#3c4042]" value="">
                                {loadingData ? "Cargando..." : "Seleccionar..."}
                              </option>
                              
                              {availableLockers.map((item) => (
                                <option key={item.id} value={item.id} className='bg-[#3c4042]'>
                                  {item.code}
                                </option>
                              ))}
                            </select>

                            {errors?.lockerId && <ErrorMessage msg={errors.lockerId.message} /> }  
                          </div>


                          <LabelFieldForm field="Candado" simbol="*" />
                          <div className="max-w-2xl">
                            <select 
                              {...register('padlockId')}
                              disabled={viewMode || !selectedCategory || loadingData || !selectedLocker}
                              className={`text-xl w-64 px-3 py-2 rounded-lg filter-input text-gray-300
                                ${(viewMode || !selectedCategory || loadingData || !selectedLocker) ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-[#2a2d2e]'}`}
                            >
                              <option className="bg-[#3c4042]" value=""> {loadingData ? "Cargando..." : "Seleccionar..."} </option>
                              
                              {availablePadlocks.map((item) => (
                                <option key={item.id} value={item.id} className='bg-[#3c4042]'>
                                  {item.serial}
                                </option>
                              ))}
                            </select>

                            {errors?.padlockId && <ErrorMessage msg={errors.padlockId.message} /> }  
                          </div>
                        </div>
                      
                      {(selectedCategory && selectedLocker && selectedPadlock) && (
                        <>
                        <TitleHeader title={editMode ? ( 'Editar Asignación de Casillero' ):( 'Asignar Casillero')} />
                          <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border border-[#ffffff21]
                                          md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                          md:[&>*:nth-child(2n)]:pl-4 p-7'
                          >
                            <LabelFieldForm field="Empleado" simbol="*" />
                            <div className='max-w-2xl'>
                              <select 
                                {...register('employeeId')}
                                disabled={viewMode || loadingEmployees}
                                className={`text-xl w-64 px-3 py-2 rounded-lg filter-input text-gray-300
                                  ${(viewMode || loadingEmployees) ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-[#2a2d2e]'}`}
                              >
                                <option className="bg-[#3c4042]" value=""> {loadingEmployees ? "Cargando..." : "Seleccionar..."} </option>
                                
                                {availableEmployees.map((item) => (
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