import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryEvents } from '../../utils/StaticData/typeEvent-utils';
import { eventValidationSchema } from '../../utils/Validations/eventValidationSchema';
import { locations } from '../../utils/StaticData/location-utils';
import { useEvents } from '../../context/EventContext';
import { useEffect, useState } from 'react';
import { divideDateTime } from '../../utils/date-utils';
import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowLeft } from "lucide-react";

export default function EventForm({ mode = 'create', event = null, onBack }) { // , onSave, onCancel
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(eventValidationSchema),
  });
  
  const [yearlyEvent, setYearlyEvent] = useState(false);
  const [categoryType, setcategoryType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { createEvent, updateEvent } = useEvents();
  const viewMode = mode === 'view';
  const editMode =  mode === 'edit';

  let selectedType = watch('category');
  const isRepeatEvent = watch('repeatEvent');

  const navigate = useNavigate();

  const meruEventsFlag = selectedType === 'meru-events' || selectedType === 'wedding-nights' || selectedType === 'dinner-heights';
  const eventOneDayWithEndTime = selectedType === 'dinner-heights';
  const eventWithoutLocation = selectedType === 've-holidays' || selectedType === 'meru-birthdays';
  
  // Al seleccionar
  const handleEventChange = (e) => {
    e.stopPropagation();
    const selectedEventId = e.target.value;
  
    setValue('category', selectedEventId, { shouldValidate: true });

    const yearlyEventValue = handleCategoryType(selectedEventId);
    const defaultRepitedEvent = yearlyEventValue ? true : false;
    const defaultRepitedInterval = yearlyEventValue ? 'Anual' : '';
    // const handleStatusEvent = yearlyEventValue ? '' : 'Tentativo';
    if (yearlyEventValue) setYearlyEvent(true);


    setValue('repeatEvent', defaultRepitedEvent, { shouldValidate: true });
    setValue('repeatInterval', defaultRepitedInterval, { shouldValidate: true });
    // setValue('status', handleStatusEvent, { shouldValidate: true });

  };

  const handleCategoryType = (categoryType) => {
    return categoryType === 'meru-birthdays' || categoryType === 've-holidays';
  }

  useEffect(() => {
      if (event && (editMode || viewMode)) {
        
        const divideDateTimeStart = divideDateTime(event?.start);
        const divideDateTimeEnd = divideDateTime(event?.end);
        const categoryType = event?.extendedProps?.category;
        const yearlyEventValue = handleCategoryType(categoryType);
        
        reset({
          eventName: event?.title ??'',
          startDate: divideDateTimeStart?.date ?? null,
          startTime: divideDateTimeStart?.time ?? null,
          endDate: divideDateTimeEnd?.date ?? null,
          endTime: divideDateTimeEnd?.time ?? null,
          status: event?.extendedProps?.status ?? '',
          locationId: event?.extendedProps?.locationId ?? '',
          repeatEvent: event?.extendedProps?.repeatEvent ?? false,
          repeatInterval: event?.extendedProps?.repeatInterval ?? '',
          createAlert: event?.extendedProps?.createAlert ?? false,
          coloringDay: event?.extendedProps?.coloringDay ?? false,
          description: event?.extendedProps?.description ?? '',
          comments: event?.extendedProps?.comments ?? '',
          category: categoryType
        });

        setYearlyEvent(yearlyEventValue);
        setcategoryType(categoryType);

      } else if (mode === 'create') {
        reset({
          category: '',
          eventName: '',
          startDate: null,
          startTime: null,
          endDate: null,
          endTime: null,
          status: '',
          locationId: '',
          repeatEvent: false,
          repeatInterval: '',
          createAlert: false,
          coloringDay: false,
          description: '',
          comments: '',
          
        });
      }
  }, [event, mode, reset, setValue]);

    const onSubmit = async (data) => {
      let success = false;
      
      if (editMode && event) {
          console.log("Actualizando:", data);

          // Añadir ID que no viene en form
          const updatedData = {
            ...data,
            id: event.id
          };

          success = await updateEvent(updatedData);
      } else {
          console.log("Creando:", data);
          success = await createEvent(data);
      }

      if (success) {
        if (typeof onBack === 'function') onBack();
        else navigate(-1);
      }
    };

    const onError = (formErrors) => {
      console.warn('Form validation errors:', formErrors);
      if (!formErrors) return;
    };

    const renderCategoryEvents = () => {
      const excludedKeys = ["meru-birthdays", "google-calendar"];
      return categoryEvents
              .filter(typeEvent => !excludedKeys.includes(typeEvent.key))
              .map(typeEvent => (
                <option key={`category-${typeEvent.id}`} className='bg-[#3c4042]' value={typeEvent.key}>{typeEvent.label}</option>
            ));
    }

    const guestNextDate = (e) => {
      if (selectedType === 'wedding-nights') {
        const dateString = e.target.value;
        if (!dateString ) return;
        
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        const nextDateFormatted = date.toISOString().split('T')[0];
        
        setValue('endDate', nextDateFormatted, { 
          shouldValidate: true,
          shouldDirty: true
        });
      }else {
        setValue('endDate', null, { shouldValidate: true });
      }
    };

  if (isEditing){ return <EventForm mode="edit" event={event} onBack={() => { setIsEditing(false); if (typeof onBack === 'function') onBack(); }} />;}
    return (
      <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
        {(viewMode && categoryType !== 'meru-birthdays') && (
        <div className="buttons-bar flex gap-2 aling-items-right justify-end">
          <button onClick={() => setIsEditing(true)} className="buttons-bar-btn flex text-3xl font-semibold" title="Editar">
            <PencilIcon className="w-4 h-4 text-white-500" />
          </button>
          <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
              <ArrowLeft className="w-4 h-4 text-white-500" />
          </button>
        </div>
        )}
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <form onSubmit={handleSubmit(onSubmit, onError)}> 
          <div className="titles-table flex justify-center items-center mb-4">
          <div className="justify-center w-64">
            <div className='mt-5'>
              <h2 className="block text-2xl font-bold text-center"> Tipo de Evento: *</h2>
            </div>
            <div className='mt-5'>
              {viewMode ? (
                <div className="text-xl w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-300">
                  {categoryEvents.find(t => t.key === selectedType)?.label || 'Sin tipo'}
                </div>
              ) : (
                <select 
                  {...register('category' , { onChange: handleEventChange })}
                  className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
                    ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}
                >
                  <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                  {renderCategoryEvents()}
                </select>
              )}
            </div>
          </div>
          </div>
          <div className="border-t border-b border-[#ffffff21] py-6 mb-4">
            {selectedType && (
              <div className='border border-[#ffffff21]
                              md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                              md:[&>*:nth-child(2n)]:pl-4 p-7'
              >
                <h3 className="text-2xl font-bold mb-4 text-white">{editMode ? ( 'Editar Evento' ):( 'Datos Evento')}</h3>
                <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4'>
                  <div className="md:w-32 md:text-right">
                    <label className="block text-lg font-medium text-gray-300 mt-1">Nombre: *</label>
                  </div>

                  <div className="w-full max-w-2xl">
                    <input 
                      readOnly={viewMode}
                      {...register('eventName')} 
                      type='text' 
                      className={`w-full px-3 py-2 rounded-lg filter-input border ${errors?.eventName ? 'border-red-500' : ''}`} 
                    />
                    {errors?.eventName && <p className="text-red-400 text-xs mt-1">{errors.eventName.message}</p>}  
                  </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full
                                border border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:pl-4 p-7"
                >                    
                  <div>
                    <label className="block text-xl font-medium text-gray-300 mt-1"> Fecha {meruEventsFlag && !eventOneDayWithEndTime && 'Inicio'}: *</label>
                  </div>
                  <div>
                    <input 
                      readOnly={viewMode} 
                      {...register('startDate', {onChange: (e) => guestNextDate(e) })} type='date' className="w-full px-3 py-2 rounded-lg filter-input"  />
                    {errors?.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}  
                  </div>
                  {meruEventsFlag && (
                    <>
                      <div>
                        <label className="block text-xl font-medium text-gray-300 mt-1"> Hora Inicio: *</label>
                      </div>
                      <div>
                        <input 
                          readOnly={viewMode}
                          {...register('startTime')} type='time' className="w-full px-3 py-2 rounded-lg filter-input"  />
                        {errors?.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime.message}</p>}  

                      </div>
                    {!eventOneDayWithEndTime && ( 
                    <>
                      <div>
                        <label className="block text-xl font-medium text-gray-300 mt-1"> Fecha Fin: *</label>
                      </div>
                      <div>
                        <input 
                          readOnly={viewMode}
                          {...register('endDate')} type='date' className="w-full px-3 py-2 rounded-lg filter-input"  />
                        {errors?.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>}  
                      </div> 
                    </>
                  )}
                      <div>
                        <label className="block text-xl font-medium text-gray-300 mt-1"> Hora Fin: *</label>
                      </div>
                      <div>
                        <input 
                          readOnly={viewMode}
                          {...register('endTime')} type='time' className="w-full px-3 py-2 rounded-lg filter-input"  />
                        {errors?.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime.message}</p>}  

                      </div> 
                       <div>
                        <label className="block text-xl font-medium text-gray-300 mt-1"> Estado: *</label>
                      </div>
                      <div className='items-center gap-2'>
                        <select 
                          disabled= {viewMode}
                          {...register('status')} // , { onChange: handleEventChange }
                          className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.repeatInterval ? 'border-red-500' : ''}
                            ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}>
                            <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                            <option className='bg-[#3c4042]' value='Tentativo'>Tentativo</option>
                            <option className='bg-[#3c4042]' value='Confirmado'>Confirmado</option>
                          </select>
                        {errors?.status && <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>}  
                      </div>
                    </> 
                  )}
                  {!eventWithoutLocation && (
                    <>
                    <div>
                      <label className="block text-xl font-medium text-gray-300 mt-1"> Ubicación: *</label>
                    </div>
                    <div>
                      <select 
                        disabled= {viewMode}
                        {...register('locationId')}
                        className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.locationId ? 'border-red-500' : ''}
                          ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}>
                        <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                          {locations.map(location => (
                            <option key={`location-${location.id}`} className='bg-[#3c4042]' value={location.id}>{location.label}</option>
                          ))}
                      </select>
                      {errors?.locationId && <p className="text-red-400 text-xs mt-1">{errors.locationId.message}</p>}  
                    </div> 
                    </> 
                  )}
                  <div>
                    <label className="block text-xl font-medium text-gray-300 mt-1"> Se repite: </label>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <input 
                      disabled={viewMode}
                      {...register('repeatEvent')}  type='checkbox' className="w-6 h-6  rounded filter-input text-gray-300 "  />
                    <div>
                      <select 
                        disabled= {viewMode || !isRepeatEvent}
                        {...register('repeatInterval')}
                        className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.repeatInterval ? 'border-red-500' : ''}
                          ${viewMode || !isRepeatEvent ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}
                      >
                          <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                          <option className='bg-[#3c4042]' value='Anual'>Anual</option>
                          <option className='bg-[#3c4042]' value='Mensual'>Mensual</option>
                          <option className='bg-[#3c4042]' value='Quincenal'>Quincenal</option>
                          {selectedType === 'executive-mod' && ( <option className='bg-[#3c4042]' value='Semanal'>Semanal</option> )}
                      </select>
                      {errors?.repeatInterval && <p className="text-red-400 text-xs mt-1">{errors.repeatInterval.message}</p>}  
                    </div>
                  </div> 
                  
                  <div>
                    <label className="block text-xl font-medium text-gray-300 mt-1"> Crear Alerta: </label>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <input 
                      disabled={viewMode} 
                      type='checkbox' {...register('createAlert')} className="w-6 h-6  rounded filter-input text-gray-300 "  />
                    {errors?.createAlert && <p className="text-red-400 text-xs mt-1">{errors.createAlert.message}</p>}  
                  </div>

                  <div>
                    <label className="block text-xl font-medium text-gray-300 mt-1"> Resaltar Día: </label>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <input 
                      disabled={viewMode}
                      type='checkbox' {...register('coloringDay')} className="w-6 h-6  rounded filter-input text-gray-300 "  />
                    {errors?.coloringDay && <p className="text-red-400 text-xs mt-1">{errors.coloringDay.message}</p>}  
                  </div>
                </div>
                <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:pl-4 p-7'
                >
                  {!yearlyEvent  && (
                    <>
                    <div className="md:w-32 md:text-right">
                      <label className="block text-lg font-medium text-gray-300 mt-1">Descripción: </label>
                    </div>
                    
                    <div className="w-full max-w-2xl">
                      <textarea
                        readOnly={viewMode}
                        {...register('description')}
                        placeholder="Ingrese detalles adicionales..."
                        className={`w-full h-24 md:h-32 p-3 rounded-lg filter-input outline-none transition-all resize-none ${
                          errors.description ? 'border-red-500' : ''
                        }`}
                      />
                      {errors?.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}  
                    </div>
                    </>
                  )}
                  <div className="md:w-32 md:text-right">
                    <label className="block text-lg font-medium text-gray-300 mt-1">Comentarios: </label>
                  </div>
                  
                  <div className="w-full max-w-2xl">
                    <textarea
                      readOnly={viewMode}
                      {...register('comments')}
                      placeholder="Ingrese comentarios, cambios, observaciones..."
                      className={`w-full h-24 md:h-32 p-3 rounded-lg filter-input outline-none transition-all resize-none ${
                        errors.comments ? 'border-red-500' : ''
                      }`}
                    />
                    {errors?.comments && <p className="text-red-400 text-xs mt-1">{errors.comments.message}</p>}  
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => typeof onBack === 'function' ? onBack() : navigate(-1)} className="px-6 py-2 font-semibold">Cancelar</button>
            {mode !== 'view' && (
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 font-semibold">
                {editMode ? 'Guardar cambios' : 'Crear Evento'}
              </button>
            )}
          </div>
        </form>
      </div>
      </div>
    );
}