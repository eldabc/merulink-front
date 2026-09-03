import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLockers } from '../../context/LockerRoomContext';

import { yupResolver } from '@hookform/resolvers/yup';
import { lockerValidationSchema } from '../../utils/Validations/lockerValidationSchema';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';
import LockerFormContent from './LockerFormContent.jsx';
import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import ErrorMessage from '../Shared/ErrorMessage.jsx';
import { lockerCategories } from '../../utils/StaticData/locker-room-utils.js';

function LockerRoomForm({ mode = 'create' }) {
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(lockerValidationSchema),
  });
  const { lockerData, createLocker, updateLocker } = useLockers();
  
  const navigate = useNavigate();
  const { id } = useParams();
  const locker = lockerData.find(e => e.id === Number(id));
  const selectedCategory = watch('category');

  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode =  mode === 'edit';

  useEffect(() => {
    if (locker && (editMode || viewMode)) {
      reset(
        lockerReset(locker)
      );

    } else if (createMode) {
      reset(
        lockerReset(null)
      );
    }
  }, [locker, mode, reset]);

  const lockerReset = (locker) => {
    const lockerCode = locker?.code ?? '';
    const [categoryKey, code] = lockerCode.split("-");
    return {
        code: code,
        category: locker?.category?.key ?? '',
        status: locker?.status ?? (createMode ? 'Disponible' : null),
    }

  }

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };

  const onSubmit = async (data) => {
    let success = false;

    if (editMode && locker) {
      const dataEdit = { 
        ...data, 
        id: locker.id, 
      }
      success = await updateLocker(dataEdit);
    } else {
      success = await createLocker(data);
    }

    if (success) {
      if (createMode) navigate(-1);
      else navigate(-2);
    }
  };

  const handleCategoryChange = (e) => {
  };


  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto p-2 rounded-lg">
        {(viewMode) && <HeadFormButtons url={`/empleados/vestuarios/lockers/editar/${locker?.id}`} data={[]} /> }
        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <form onSubmit={handleSubmit(onSubmit, onError)}> 
            <div className="titles-table">
            <div className="justify-center w-64">
              <div className='mt-5'>
                <h2 className="block text-2xl font-bold text-center"> Categoría: *</h2>
              </div>
              <div className='mt-5'>
                {viewMode || editMode ? (
                  <div className="text-xl w-full px-3 py-2 rounded-lg bg-[#2f3d44] text-center text-gray-300">
                    {locker?.category?.name}
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
                    {lockerCategories.map((item) => (
                      <option key={`category-${item.id}`}  className='bg-[#3c4042]' value={item.key}>{item.value}</option>                
                    ))}
                  </select>
                    {errors?.category && <ErrorMessage msg={errors.category.message} /> } 
                  </>
                )}
              </div>
            </div>
            </div>
            <div className="border-t border-b border-[#ffffff21] py-6 mb-4">
                <div className='border border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:pl-4 p-7'
                >
                  <div className="mt-6">     
                    <LockerFormContent
                      register={register}
                      errors={errors}
                      selectedCategory={selectedCategory}
                      viewMode={viewMode}
                      editMode={editMode}
                    />
                  </div>
                </div>
            </div>
            <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} permissions={["create-lockers", "edit-lockers"]} />
          </form>
        </div>
      </div>
  );
  
}

export default LockerRoomForm;