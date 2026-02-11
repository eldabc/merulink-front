import ErrorMessage from '../Shared/ErrorMessage.jsx';
import InfoToggleSeccion from '../Shared/InfoToggleSecction.jsx'
import { locations } from '../../utils/StaticData/location-utils';
import { useEvents } from '../../context/EventContext';
import { useEffect } from 'react';

export default function EventFormContent({ 
  register, 
  errors,  
  viewMode, 
  editMode,
  meruEventsFlag,
  eventOneDayWithEndTime,
  isRepeatEvent,
  isGoogleCategory,
  createdBy,
  guestNextDate,
  handleNextTime,
  setValue
}) {

  const { config } = useEvents();
  const yearlyEvent = config?.isYearly;

  useEffect(() => {
    const yearlyEventValue = config?.isYearly;
    if (yearlyEventValue) {
      const defaultRepitedEvent = yearlyEventValue ? true : false;
      const defaultRepitedInterval = yearlyEventValue ? 'Anual' : '';

      setValue('repeatEvent', defaultRepitedEvent, { shouldValidate: true });
      setValue('repeatInterval', defaultRepitedInterval, { shouldValidate: true });
    }    
  }, [config, setValue]);

  return (
    <>
      <h3 className="text-2xl font-bold mb-4 text-white">{editMode ? ( 'Editar Evento' ):( 'Datos Evento')}</h3>
      <InfoToggleSeccion
        createdBy={createdBy}
        showTemplateToggle={!isGoogleCategory}
        readOnly={viewMode}
        register={register}
        errors={errors}
        setValue={setValue}
      />
      <div className='border border-[#ffffff21]
                      md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                      md:[&>*:nth-child(2n)]:pl-4 p-7'
      >
        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4'>
          <div className="md:w-32 md:text-right">
            <label className="block text-lg font-medium text-gray-300 mt-1">Nombre: *</label>
          </div>

          <div className="w-full max-w-2xl">
            <input 
              readOnly={viewMode}
              {...register('eventName')} 
              type='text' 
              className={`w-full px-3 py-2 rounded-lg filter-input border`} 
            />
            {errors?.eventName && <ErrorMessage msg={errors.eventName.message} /> }  
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
            {errors?.startDate && <ErrorMessage msg={errors.startDate.message} /> }  
          </div>

          {config?.hasEndDate && ( 
            <>
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1"> Fecha Fin: *</label>
              </div>
              <div>
                <input 
                  readOnly={viewMode}
                  {...register('endDate')} type='date' className="w-full px-3 py-2 rounded-lg filter-input"  />
                {errors?.endDate && <ErrorMessage msg={errors.endDate.message} />}  
              </div> 
            </>
          )}

          {config?.hasStartTime && (
            <>
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1"> Hora Inicio: *</label>
              </div>
              <div>
                <input 
                  readOnly={viewMode}
                  {...register('startTime', { onChange: (e) => { handleNextTime(e)} })} type='time' className="w-full px-3 py-2 rounded-lg filter-input"  />
                {errors?.startTime && <ErrorMessage msg={errors.startTime.message} /> }
              </div>
            </>
          )}

          {config?.hasEndTime && (
            <>
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1"> Hora Fin: *</label>
              </div>
              <div>
                <input 
                  readOnly={viewMode}
                  {...register('endTime')} type='time' className="w-full px-3 py-2 rounded-lg filter-input"  />
                {errors?.endTime && <ErrorMessage msg={errors.endTime.message} /> }
              </div> 
            </>
          )}

          {config?.hasStatus && (
            <>
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1"> Estado: *</label>
              </div>
              <div className='items-center gap-2'>
                <select 
                  disabled= {viewMode}
                  {...register('status')}
                  className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
                    ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}>
                  <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                  <option className='bg-[#3c4042]' value='Tentativo'>Tentativo</option>
                  <option className='bg-[#3c4042]' value='Confirmado'>Confirmado</option>
                </select>
                {errors?.status && <ErrorMessage msg={errors.status.message} /> }  
              </div>
            </> 
          )}

          {config?.hasLocation && (
            <>
            <div>
              <label className="block text-xl font-medium text-gray-300 mt-1"> Ubicación: *</label>
            </div>
            <div>
              <select 
                disabled= {viewMode}
                {...register('locationId')}
                className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
                  ${viewMode ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}>
                <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                  {locations.map(location => (
                    <option key={`location-${location.id}`} className='bg-[#3c4042]' value={location.id}>{location.label}</option>
                  ))}
              </select>
              {errors?.locationId && <ErrorMessage msg={errors.locationId.message} /> }  
            </div> 
            </> 
          )}

          {config?.hasRepeatEvent && (
            <>
            <div>
              <label className="block text-xl font-medium text-gray-300 mt-1"> Se repite: </label>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <input 
                disabled={viewMode || yearlyEvent}
                {...register('repeatEvent')}  type='checkbox' className="w-6 h-6  rounded filter-input text-gray-300 "  />
              <div>
                <select 
                  disabled= {viewMode || !isRepeatEvent || yearlyEvent}
                  {...register('repeatInterval')}
                  className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300
                  ${viewMode || !isRepeatEvent ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : ''}`}
                >
                    <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                    <option className='bg-[#3c4042]' value='Anual'>Anual</option>
                    <option className='bg-[#3c4042]' value='Mensual'>Mensual</option>
                    <option className='bg-[#3c4042]' value='Quincenal'>Quincenal</option>

                    {isGoogleCategory && (<option className='bg-[#3c4042]' value='Rotativo'>Rotativo</option>)}
                </select>
                {errors?.repeatInterval && <ErrorMessage msg={errors.repeatInterval.message} /> }  
              </div>
            </div> 
            </>
          )}

        
          {config?.hasCreateAlert  && (
            <>
            <div>
              <label className="block text-xl font-medium text-gray-300 mt-1"> Crear Alerta: </label>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <input 
                disabled={viewMode} 
                type='checkbox' {...register('createAlert')} className="w-6 h-6  rounded filter-input text-gray-300 "  />
              {errors?.createAlert && <ErrorMessage msg={errors.createAlert.message} /> }  
            </div>
            </>
          )}

          {config?.hasColorinDay  && (
            <>
            <div>
              <label className="block text-xl font-medium text-gray-300 mt-1"> Resaltar Día: </label>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <input 
                disabled={viewMode}
                type='checkbox' {...register('coloringDay')} className="w-6 h-6  rounded filter-input text-gray-300 "  />
              {errors?.coloringDay && <ErrorMessage msg={errors.coloringDay.message} /> }  
            </div>
            </>
          )}
        </div>
        
        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border border-[#ffffff21]
                        md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                        md:[&>*:nth-child(2n)]:pl-4 p-7'
        >
          {config?.hasDescription  && (
            <>
            <div className="md:w-32 md:text-right">
              <label className="block text-lg font-medium text-gray-300 mt-1">Descripción: </label>
            </div>
            <div className="w-full max-w-2xl">
              <textarea
                readOnly={viewMode}
                {...register('description')}
                placeholder="Ingrese detalles adicionales..."
                className={`w-full h-24 md:h-32 p-3 rounded-lg filter-input outline-none transition-all resize-none`}
              />
              {errors?.description && <ErrorMessage msg={errors.description.message} /> }  
            </div>
            </>
          )}

          {config?.hasComments && (
            <>
            <div className="md:w-32 md:text-right">
              <label className="block text-lg font-medium text-gray-300 mt-1">Comentarios: </label>
            </div>
            <div className="w-full max-w-2xl">
              <textarea
                readOnly={viewMode}
                {...register('comments')}
                placeholder="Ingrese comentarios, cambios, observaciones..."
                className={`w-full h-24 md:h-32 p-3 rounded-lg filter-input outline-none transition-all resize-none`}
              />
              {errors?.comments && <ErrorMessage msg={errors.comments.message} /> }  
            </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
