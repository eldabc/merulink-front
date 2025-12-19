import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryLegend } from '../../utils/StaticData/typeEvent-utils';
import { eventValidationSchema } from '../../utils/Validations/eventValidationSchema';
import { locations } from '../../utils/StaticData/location-utils';
import { useEffect } from 'react';

export default function EventForm({ mode = 'create', event = null }) { // , onSave, onCancel
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(eventValidationSchema),
  });
  const selectedType = watch('typeEventId');
  const isRepeatEvent = watch('repeatEvent');
  // Al seleccionar
  const handleEventChange = (e) => {
    const selectedEventId = e.target.value;
  
    setValue('typeEventId', selectedEventId, { shouldValidate: true });

  };

  useEffect(() => {
      if (event && mode === 'edit' || mode === 'view') {
        // reset({
        //   code: event?.code ?? '',
        //   eventName: event?.eventName ?? '',
        //   departmentId: event?.departmentId ?? '',
        // });
      } else if (mode === 'create') {
        reset({
          typeEventId: '',
          // eventName: '',
          // departmentId: '',
        });
      }
    }, [event, mode, reset]);

    return (
      <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        {/* <form onSubmit={handleSubmit(onSubmit, onError)}> */}
          <h2 className="text-2xl font-bold">Registrar Fecha  </h2>       
          {/* {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )} */}
          <div className="titles-table flex justify-center items-center mb-4">
          <div className="text-sm justify-center w-64">
            <div>
              <label className="block text-xl text-center font-medium text-gray-300 mt-1 mb-2"> Tipo de Evento: *</label>
            </div>
            <div>
            <select 
              disabled= {mode === 'view'}
              {...register('typeEventId' , { onChange: handleEventChange })}
              className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.typeEventId ? 'border-red-500' : ''}
                ${mode === 'view' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-900'}`}>
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                {categoryLegend.map(typeEvent => (
                  <option key={`typeEventId-${typeEvent.id}`} className='bg-[#3c4042]' value={typeEvent.id}>{typeEvent.label}</option>
                ))}
            </select>
            {errors?.typeEventId && <p className="text-red-400 text-xs mt-1">{errors.typeEventId.message}</p>}  
            </div>
          </div>
          </div>
          <div className="rounded-lg shadow">
            {selectedType && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? ( 'Editar Evento' ):( 'Datos Evento')}</h3>
                <div className='flex flex-row justify-center gap-4 mb-4'>
                  <label className="block text-xl font-medium text-gray-300 mt-1"> Nombre: *</label>
                {/* </div>
                <div> */}
                  <input type='text' className="gap-2 w-2xl px-3 py-2 rounded-lg filter-input text-gray-300 bg-white text-gray-900"  />
                </div>
              <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">   
                <div>
                  <label className="block text-xl font-medium text-gray-300 mt-1"> Inicio: *</label>
                </div>
                <div>
                  <input type='datetime-local' className="w-full px-3 py-2 rounded-lg filter-input text-gray-300 bg-white text-gray-900"  />
                </div>
                
                <div>
                  <label className="block text-xl font-medium text-gray-300 mt-1"> Fin: *</label>
                </div>
                <div>
                  <input type='datetime-local' className="w-full px-3 py-2 rounded-lg filter-input text-gray-300 bg-white text-gray-900"  />
                </div> 

                  <div>
                  <label className="block text-xl font-medium text-gray-300 mt-1"> Ubicación: *</label>
                </div>
                <div>
                  <select 
                    disabled= {mode === 'view'}
                    {...register('location')} // , { onChange: handleEventChange }
                    className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.location ? 'border-red-500' : ''}
                      ${mode === 'view' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-900'}`}>
                    <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                      {locations.map(location => (
                        <option key={`location-${location.id}`} className='bg-[#3c4042]' value={location.id}>{location.label}</option>
                      ))}
                  </select>
                  {errors?.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}  
                </div> 

                <div>
                  <label className="block text-xl font-medium text-gray-300 mt-1"> Se repite: *</label>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <input type='checkbox' {...register('repeatEvent')} className="w-6 h-6  rounded filter-input text-gray-300 bg-white text-gray-900"  />
                  <select 
                    disabled= {mode === 'view' || !isRepeatEvent}
                    {...register('repeatInterval')} // , { onChange: handleEventChange }
                    className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.repeatInterval ? 'border-red-500' : ''}
                      ${mode === 'view' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-900'}`}>
                    <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                      <option className='bg-[#3c4042]' value='Anual'>Anual</option>
                      <option className='bg-[#3c4042]' value='Mensual'>Mensual</option>
                      <option className='bg-[#3c4042]' value='Quincesal'>Quincesal</option>
                  </select>
                  {errors?.repeatInterval && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}  
                </div> 

                <div>
                  <label className="block text-xl font-medium text-gray-300 mt-1"> Crear Alerta: *</label>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <input type='checkbox' {...register('createAlert')} className="w-6 h-6  rounded filter-input text-gray-300 bg-white text-gray-900"  />
                </div>
              </div>
            </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {/* <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button>
            {mode !== 'view' && (
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                {mode === 'edit' ? 'Guardar cambios' : 'Crear Cargo'}
              </button>
            )} */}
          </div>
          {/* </form> */}
      </div>
    );
}