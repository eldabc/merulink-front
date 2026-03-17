import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePadlockPatterns } from '../../context/PadlockPatternContext';

import { yupResolver } from '@hookform/resolvers/yup';
import { padlockPatternValidationSchema } from '../../utils/Validations/padlockPatternValidationSchema';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';

import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import ErrorMessage from '../Shared/ErrorMessage.jsx';
import LabelFieldForm from "../Shared/LabelFieldForm";
import PadlockPatternSteps from "../Shared/PadlockPatternSteps";
import ResetInstructions from '../Shared/ResetInstructions.jsx';


function PadlockPatternForm ({ mode = 'create' }) {
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(padlockPatternValidationSchema),
        defaultValues: {
          unlockSequence: [{ action: 'girar', direction: 'derecha', amount: 1 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "unlockSequence"
    });
    const { padlockPatternData, createPadlockPattern, updatePadlockPattern } = usePadlockPatterns();
  
    const { id } = useParams();  
    const navigate = useNavigate();
    const padlockPattern = padlockPatternData.find(e => e.id === Number(id));

    const createMode = mode === 'create'
    const viewMode = mode === 'view';
    const editMode =  mode === 'edit';
  
    useEffect(() => {
      if (padlockPattern && (editMode || viewMode)) {
        reset(
          padlockPatternReset(padlockPattern)
        );
  
      } else if (createMode) {
        reset(
          padlockPatternReset(null)
        );
      }
    }, [padlockPattern, mode, reset]);
  
    const padlockPatternReset = (padlockPattern) => {
      return {
        modelName: padlockPattern?.modelName ?? '',
        resetInstructions: padlockPattern?.resetInstructions ?? '',
        unlockSequence: padlockPattern?.unlockSequence ?? fields,
      }
  
    }
  
    const onError = (formErrors) => {
      console.warn('Form validation errors:', formErrors);
      if (!formErrors) return;
    };
  
    const onSubmit = async (data) => {
      let success = false;
  
      if (editMode && padlockPattern) {
        const dataEdit = { 
          ...data, 
          id: padlockPattern.id, 
        }
        success = await updatePadlockPattern(dataEdit);
      } else {
        success = await createPadlockPattern(data);
      }
  
      if (success) {
        navigate(-1);
      }
    };
  
    return (
      <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
          {viewMode && (
            <HeadFormButtons url={`/empleados/vestuarios/candados/editar/${padlockPattern.id}`} data={[]} />
          )}
          
          <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
            <form onSubmit={handleSubmit(onSubmit, onError)}> 
              <div className="titles-table flex justify-center items-center mb-4"></div>
              <div className="border-t border-b border-[#ffffff21] py-6 mb-4">
                  <div className='div-border'>
                    <div className="mt-6">     
                      <h3 className="text-2xl font-bold mb-4 text-white">{editMode ? ( 'Editar Patrón' ):( 'Datos del Patrón')}</h3>
                      <div className="flex flex-col md:flex-row gap-2 md:col-span-1">
                        <LabelFieldForm field="Modelo/Nombre del Candado" simbol="*" />
                        <input 
                          {...register('modelName')}
                          type="text" 
                          placeholder="Ej: Lock Pro V2"
                          className="input-locker w-full placeholder:opacity-50 " 
                        />
                        {errors?.modelName && <ErrorMessage msg={errors.modelName.message} /> }  
                      </div>
                      <ResetInstructions register={register} errors={errors} />

                      <div className='div-border'>
                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4'>
                          <div className="bg-[#2f3d44] p-5 rounded-2xl border border-white/5 shadow-inner">
                            <label className="text-[#9fd8ff] text-xs uppercase tracking-widest font-bold mb-4 block">
                              Configura los pasos siguientes
                            </label>
                            
                            <div className="space-y-4">
                              {fields.map((field, index) => (
                                <PadlockPatternSteps
                                  key={field.id}
                                  field={field}
                                  index={index}
                                  register={register}
                                  errors={errors}
                                  showAddBtn={fields.length > 1}
                                />
                              ))}
                            </div>

                            {/* Botón Añadir */}
                            <button
                              type="button"
                              onClick={() => append({ action: 'girar', direction: 'derecha', amount: 1 })}
                              className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#9fd8ff] hover:text-white hover:bg-[#4a4f52] px-4 py-2 rounded-xl border border-white/10 transition-all active:scale-95"
                            >
                              <span className="text-lg">+</span> Añadir nuevo paso
                            </button>
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

export default PadlockPatternForm;