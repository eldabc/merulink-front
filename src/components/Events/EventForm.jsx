import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryLegend } from '../../utils/StaticData/typeEvent-utils';
import { eventValidationSchema } from '../../utils/Validations/eventValidationSchema';
import { useEffect } from 'react';

export default function EventForm({ mode = 'create', event = null }) { // , onSave, onCancel
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(eventValidationSchema),
  });
  const selectedType = watch('typeEventId');
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
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">    
            </div>
          </div>
         )}
        </div>
      </div>
    );
}