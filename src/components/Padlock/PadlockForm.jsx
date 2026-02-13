import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePadlocks } from '../../context/PadlockContext';

import { yupResolver } from '@hookform/resolvers/yup';
import { padlockValidationSchema } from '../../utils/Validations/padlockValidationSchema';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';

import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import ErrorMessage from '../Shared/ErrorMessage.jsx';
// import { padlockCategories } from '../../utils/StaticData/padlock-utils.js';
import LabelFieldForm from "../Shared/LabelFieldForm";


function PadlockForm ({ mode = 'create' }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(padlockValidationSchema),
    });
    const { createPadlock, updatePadlock } = usePadlocks();
    
    const navigate = useNavigate();
    const location = useLocation();
    const selectedCategory = watch('category');
    const padlock = location.state?.data;
    
    const createMode = mode === 'create'
    const viewMode = mode === 'view';
    const editMode =  mode === 'edit';
    // const padlockCategory = padlockCategories.find(c => c.key === padlock?.category);
  
    useEffect(() => {
      if (padlock && (editMode || viewMode)) {
        reset(
          padlockReset(padlockCategory, padlock)
        );
  
      } else if (createMode) {
        reset(
          padlockReset('', null)
        );
      }
    }, [padlock, mode, reset]);
  
    const padlockReset = (category, padlock) => {
      return {
          serial: padlock?.serial ?? '',
          category: padlock?.category ?? '',
          status: padlock?.status ?? (createMode ? 'Disponible' : null),
      }
  
    }
  
    const onError = (formErrors) => {
      console.warn('Form validation errors:', formErrors);
      if (!formErrors) return;
    };
  
    const onSubmit = async (data) => {
      let success = false;
  
      if (editMode && padlock) {
        const dataEdit = { 
          ...data, 
          id: padlock.id, 
        }
        success = await updatePadlock(dataEdit);
      } else {
        success = await createPadlock(data);
      }
  
      if (success) {
        if (createMode) navigate(-1);
        else navigate(-2);
      }
    };
  
    const handleCategoryChange = (e) => {
    };
  
  
    return (
      <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
          {(viewMode) && <HeadFormButtons url="/empleados/vestuarios/padlocks/editar" data={padlock} /> }
          
          <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
            <form onSubmit={handleSubmit(onSubmit, onError)}> 
              <div className="titles-table flex justify-center items-center mb-4">
              <div className="justify-center w-64">
                <div className='mt-5'>
                  <h2 className="block text-2xl font-bold text-center"> Serial: *</h2>
                </div>
                <div className='mt-5'>
                   <input 
                      readOnly={viewMode}
                      {...register('serial')} 
                      type='text' 
                      className={`w-full px-3 py-2 rounded-lg filter-input border`} 
                    />
                  {errors?.serial && <ErrorMessage msg={errors.serial.message} /> }  

                  {/* {viewMode || editMode ? (
                    <div className="text-xl w-full px-3 py-2 rounded-lg bg-[#2f3d44] text-center text-gray-300">
                      {padlockCategory?.value}
                    </div>
                  ) : (
                    <>
                    <select 
                      {...register('category', { onChange: handleCategoryChange } )}
                      disabled={viewMode}
                      className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
                      ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}
                    >
                      <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                      {padlockCategories.map((item) => (
                        <option key={`category-${item.id}`}  className='bg-[#3c4042]' value={item.key}>{item.value}</option>                
                      ))}
                    </select>
                      {errors?.category && <ErrorMessage msg={errors.category.message} /> } 
                    </>
                  )} */}
                </div>
              </div>
              </div>
              <div className="border-t border-b border-[#ffffff21] py-6 mb-4">
                  <div className='border border-[#ffffff21]
                                  md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                  md:[&>*:nth-child(2n)]:pl-4 p-7'
                  >
                    <div className="mt-6">     
                      <h3 className="text-2xl font-bold mb-4 text-white">{editMode ? ( 'Editar Padlock' ):( 'Datos Padlock')}</h3>
                      <div className='border border-[#ffffff21]
                                      md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                      md:[&>*:nth-child(2n)]:pl-4 p-7'
                      >
                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4'>
                          
                          <LabelFieldForm field="Código" simbol="*" />
                          <div className="w-full max-w-2xl">
                            <input 
                              readOnly={viewMode}
                              {...register('pass')} 
                              type='text' 
                              className={`w-full px-3 py-2 rounded-lg filter-input border`} 
                            />
                            {errors?.pass && <ErrorMessage msg={errors.pass.message} /> }  
                          </div>

                          <LabelFieldForm field="Estatus" simbol="*" />
                          <div>
                            <select 
                              {...register('status')}
                              disabled={createMode || viewMode || editMode}
                              className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
                                ${viewMode || createMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}
                                
                            >
                              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                              <option className='bg-[#3c4042]' value="Disponible">Disponible</option>
                              <option className='bg-[#3c4042]' value="Ocupado">Asignado</option>
                            </select>
                            {errors?.status && <ErrorMessage msg={errors.status.message} /> }  
                          </div>
                        </div>

                      
                        
                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border border-[#ffffff21]
                                        md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                        md:[&>*:nth-child(2n)]:pl-4 p-7'
                        >
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />
            </form>
          </div>
        </div>
    );
};

export default PadlockForm;