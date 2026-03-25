import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePadlocks } from '../../context/PadlockContext';

import { yupResolver } from '@hookform/resolvers/yup';
import { padlockValidationSchema } from '../../utils/Validations/padlockValidationSchema';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';
import { getDisabledClasses } from '../../utils/global-utils';  

import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import ErrorMessage from '../Shared/ErrorMessage.jsx';
import LabelFieldForm from "../Shared/LabelFieldForm";
import TitleHeader from "../Shared/TitleHeader";
import { STATUSES } from '../../utils/statusesConfig.js';

function PadlockForm ({ mode = 'create' }) {

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(padlockValidationSchema),
  });

  const { padlockData, createPadlock, updatePadlock } = usePadlocks();

  const { id } = useParams();  
  const navigate = useNavigate();
  const padlock = padlockData.find(e => e.id === Number(id));
  
  const createMode = mode === 'create'
  const viewMode = mode === 'view';
  const editMode =  mode === 'edit';
  const disabledClasses = getDisabledClasses(viewMode);
  
    useEffect(() => {
      if (padlock && (editMode || viewMode)) {
        reset(
          padlockReset(padlock)
        );
  
      } else if (createMode) {
        reset(
          padlockReset(null)
        );
      }
    }, [padlock, mode, reset]);
  
    const padlockReset = (padlock) => {
      return {
          serial: padlock?.serial ?? '',
          pass: padlock?.pass ?? '',
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
  
    const handlePassChange = (e) => {
      let value = e.target.value.toUpperCase().replace(/[^0-9]/g, '');

      const maskedValue = value
        .replace(/^([0-9]{2})([0-9]{2})?([0-9]{2})?/, (match, p1, p2, p3) => {
          let res = p1;
          if (p2) res += `-${p2}`;
          if (p3) res += `-${p3}`;
          return res;
        })
        .substring(0, 8);

      // Actualiza el valor
      setValue('pass', maskedValue);
    };
  
  
    return (
      <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
          {(viewMode && STATUSES.AVAILABLE === padlock?.status) && (
            <HeadFormButtons url={`/empleados/vestuarios/candados/editar/${padlock.id}`} data={[]} />
          )}
          
          <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
           
            <form onSubmit={handleSubmit(onSubmit, onError)}> 
              <div className="border-t border-b border-[#ffffff21] py-6 mb-4">
                  <div className='div-border'>
                    <div className="mt-6">     

                      <TitleHeader title={editMode ? ( 'Editar Padlock' ):( 'Datos Padlock')} dinamicClasses="mb-5" />
                      <div className="mx-auto w-64 mb-5"></div>
                      <div className='div-border'>
                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-8'>
                          
                          <LabelFieldForm field="Serial" simbol="*" />
                          <input 
                              readOnly={viewMode}
                              {...register('serial')} 
                              className={`px-3 py-2 rounded-lg filter-input border placeholder:text-gray-500 placeholder:italic ${disabledClasses}`}
                              placeholder='Ingrese serial'
                              maxLength={40}
                            />
                          {errors?.serial && <ErrorMessage msg={errors.serial.message} /> }  

                          <LabelFieldForm field="Contraseña Numérica" simbol="*" />
                            <input 
                              readOnly={viewMode}
                              {...register('pass')}
                              onChange={handlePassChange} 
                              type='text' 
                              className={`px-3 py-2 rounded-lg filter-input border placeholder:text-gray-500 placeholder:italic ${disabledClasses}`}
                              placeholder='Ejemplo: 55-44-23'
                            />
                            {errors?.pass && <ErrorMessage msg={errors.pass.message} /> }  

                          <LabelFieldForm field="Estatus" simbol="*" />
                          <div>
                            <select 
                              {...register('status')}
                              disabled={true}
                              className={`w-full px-3 py-2 rounded-lg filter-input cursor-not-allowed ${disabledClasses}`}
                            >
                              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                              <option className='bg-[#3c4042]' value="Disponible">Disponible</option>
                              <option className='bg-[#3c4042]' value="Asignado">Asignado</option>
                            </select>
                            {errors?.status && <ErrorMessage msg={errors.status.message} /> }  
                          </div>
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