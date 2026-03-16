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
                      <div className='div-border'>
                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4'>
                          <div className="bg-[#2f3d44] p-5 rounded-2xl border border-white/5 shadow-inner">
                            <label className="text-[#9fd8ff] text-xs uppercase tracking-widest font-bold mb-4 block">
                              Configuración de Secuencia de Apertura
                            </label>
                            
                            <div className="space-y-4">
                              {fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-4 animate-in fade-in slide-in-from-left-2">
                                  <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr_1fr] gap-4 flex-1">
                                    <div className="flex flex-col gap-2">
                                      <span className="text-gray-400 text-[10px] uppercase ml-1">Paso</span>
                                      <div className="flex items-center justify-center bg-[#3c4042] text-[#9fd8ff] font-bold rounded-lg h-[46px] w-[50px] border border-white/10 shadow-md">
                                        #{index + 1}
                                      </div>  
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <span className="text-gray-400 text-[10px] uppercase ml-1">Acción</span>
                                      <select 
                                        {...register(`unlockSequence.${index}.action`)} 
                                        className="input-locker w-full"
                                      >
                                        <option value="girar">Girar 🔄</option>
                                        <option value="presionar">Presionar 🔘</option>
                                        <option value="halar">Halar ⬆️</option>
                                      </select>
                                        {errors?.unlockSequence?.[index]?.action && <ErrorMessage msg={errors.unlockSequence?.[index]?.action.message} /> }  
                                    </div>

                                    <div className="flex flex-col gap-2">
                                      <span className="text-gray-400 text-[10px] uppercase ml-1">Dirección</span>
                                      <select 
                                        {...register(`unlockSequence.${index}.direction`)} 
                                        className="input-locker w-full"
                                      >
                                        <option value="derecha">Derecha ➡️</option>
                                        <option value="izquierda">Izquierda ⬅️</option>
                                        <option value="arriba">Arriba ⬆️</option>
                                        <option value="abajo">Abajo ⬇️</option>
                                      </select>
                                        {errors?.unlockSequence?.[index]?.direction && <ErrorMessage msg={errors.unlockSequence?.[index]?.direction.message} /> }  
                                    </div>

                                    <div className="flex flex-col gap-2">
                                      <span className="text-gray-400 text-[10px] uppercase ml-1">Cantidad</span>
                                      <div className="flex gap-2">
                                        <input 
                                          {...register(`unlockSequence.${index}.amount`)}
                                          type="number" 
                                          min="1"
                                          className="input-locker w-full placeholder:opacity-50 placeholder:text-lg"
                                          placeholder='Ingresa cantidad'
                                        />  
                                        {/* Eliminar paso (solo si hay más de uno) */}
                                        <div className='w-10 mr-3'>
                                        {fields.length > 1 && (
                                          <button 
                                            type="button" 
                                            onClick={() => remove(index)}
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 rounded-lg transition-colors"
                                          >
                                            ✕
                                          </button>
                                        )}
                                        </div>
                                      </div>
                                      {errors?.unlockSequence?.[index]?.amount && <ErrorMessage msg={errors.unlockSequence?.[index]?.amount.message} /> }
                                    </div>
                                  </div>
                                </div>
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

                        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 div-border'>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2 md:col-span-1">
                              <LabelFieldForm field="Modelo del Dispositivo" simbol="*" />
                              <input 
                                {...register('modelName')}
                                type="text" 
                                placeholder="Ej: Lock Pro V2"
                                className="input-locker w-full placeholder:opacity-50 placeholder:text-lg" 
                              />
                              {errors?.modelName && <ErrorMessage msg={errors.modelName.message} /> }  
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                              <LabelFieldForm field="Instrucciones de Reinicio" simbol="*" />
                              <textarea 
                                {...register('resetInstructions')}
                                placeholder="Describe cómo resetear el candado..."
                                rows="4"
                                className="input-locker w-full py-2 placeholder:opacity-50 placeholder:text-lg"
                              />
                              {errors?.resetInstructions && <ErrorMessage msg={errors.resetInstructions.message} /> }  
                            </div>
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