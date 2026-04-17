import { useEffect } from 'react';
// import { useGlobalData } from '../../context/GlobalDataContext.jsx';

import { getDisabledClasses } from '../../utils/global-utils';  

import ErrorMessage from '../Shared/ErrorMessage.jsx';
import InfoToggleSeccion from '../Shared/InfoToggleSecction.jsx';
import LabelFieldForm from '../Shared/LabelFieldForm';

export default function EventFormContent({ 
  register, 
  errors,  
  viewMode, 
  editMode,
  config,
  meruEventsFlag,
  eventOneDayWithEndTime,
  isRepeatEvent,
  isGoogleCategory,
  createdBy,
  guestNextDate,
  handleNextTime,
  setValue,
  disabledClasses,
  globalLoading,
  locations
}) {

  const yearlyEvent = config?.isYearly;
  const repeatEventDisabledClasses = getDisabledClasses(yearlyEvent, !isRepeatEvent);
  
  useEffect(() => {
    const yearlyEventValue = config?.isYearly;
    if (yearlyEventValue) {
      const defaultRepitedEvent = yearlyEventValue ? true : false;
      const defaultRepitedInterval = yearlyEventValue ? 'Anual' : '';

      setValue('repeatEvent', defaultRepitedEvent, { shouldValidate: true });
      setValue('repeatInterval', defaultRepitedInterval, { shouldValidate: true });
    }
    
  }, [config]);


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
      <div className='div-border'>
        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4'>

          <LabelFieldForm field="Nombre" simbol="*" />
          <div className="w-full max-w-2xl">
            <input 
              readOnly={viewMode}
              {...register('eventName')} 
              type='text' 
              className={`w-full px-3 py-2 rounded-lg filter-input border ${disabledClasses}`} 
            />
            {errors?.eventName && <ErrorMessage msg={errors.eventName.message} /> }  
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full div-border">                    

          <LabelFieldForm field={`Fecha ${(meruEventsFlag && !eventOneDayWithEndTime) ? 'Inicio' : ''}`} simbol="*" />
          <div>
            <input 
              readOnly={viewMode} type='date'
              {...register('startDate', {onChange: (e) => guestNextDate(e) })}
              className={`w-full px-3 py-2 rounded-lg filter-input  ${disabledClasses}`} 
            />
            {errors?.startDate && <ErrorMessage msg={errors.startDate.message} /> }  
          </div>

          {config?.hasEndDate && ( 
            <>
              <LabelFieldForm field="Fecha Fin" simbol="*" />
              <div>
                <input 
                  readOnly={viewMode} type='date'
                  {...register('endDate')}
                  className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}  
                />
                {errors?.endDate && <ErrorMessage msg={errors.endDate.message} />}  
              </div> 
            </>
          )}

          {config?.hasStartTime && (
            <>
              <LabelFieldForm field="Hora Inicio" simbol="*" />
              <div>
                <input 
                  readOnly={viewMode} type='time'
                  {...register('startTime', { onChange: (e) => { handleNextTime(e)} })} 
                  className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                />
                {errors?.startTime && <ErrorMessage msg={errors.startTime.message} /> }
              </div>
            </>
          )}

          {config?.hasEndTime && (
            <>
              <LabelFieldForm field="Hora Fin" simbol="*" />
              <div>
                <input 
                  readOnly={viewMode} type='time'
                  {...register('endTime')} 
                  className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                />
                {errors?.endTime && <ErrorMessage msg={errors.endTime.message} /> }
              </div> 
            </>
          )}

          {config?.hasStatus && (
            <>
              <LabelFieldForm field="Estado" simbol="*" />
              <div className='items-center gap-2'>
                <select 
                  disabled= {viewMode}
                  {...register('status')}
                  className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
                >
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
            <LabelFieldForm field="Ubicación" simbol="*" />
            <div>
              <select 
                disabled= {viewMode}
                {...register('locationId')}
                className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
              >    
                  <option className="bg-[#3c4042]" value=""> {globalLoading ? "Cargando..." : "Seleccionar..."} </option>
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
            <LabelFieldForm field="Se repite" />
            <div className='flex flex-row items-center gap-2'>
              <input 
                disabled={viewMode || yearlyEvent}
                {...register('repeatEvent')}  type='checkbox' className={`w-6 h-6 rounded filter-input text-gray-300 ${disabledClasses} `}  
              />
              <div>
                <select 
                  disabled= {viewMode || !isRepeatEvent || yearlyEvent}
                  {...register('repeatInterval')}
                  className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses} ${repeatEventDisabledClasses}`}
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
            <LabelFieldForm field="Crear Alerta" />
            <div className='flex flex-row items-center gap-2'>
              <input 
                disabled={viewMode}  type='checkbox'  
                {...register('createAlert')} className={`w-6 h-6 rounded filter-input text-gray-300 ${disabledClasses}`}
              />
              {errors?.createAlert && <ErrorMessage msg={errors.createAlert.message} /> }  
            </div>
            </>
          )}

          {config?.hasColorinDay  && (
            <>
            <LabelFieldForm field="Resaltar Día" />
            <div className='flex flex-row items-center gap-2'>
              <input 
                disabled={viewMode}  type='checkbox'
                {...register('coloringDay')} className={`w-6 h-6 rounded filter-input text-gray-300 ${disabledClasses}`}
              />
              {errors?.coloringDay && <ErrorMessage msg={errors.coloringDay.message} /> }  
            </div>
            </>
          )}
        </div>
        
        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 div-border'>
          {config?.hasDescription  && (
            <>
            <LabelFieldForm field="Descripción" />
            <div className="w-full max-w-2xl">
              <textarea
                readOnly={viewMode}
                {...register('description')}
                placeholder="Ingrese detalles adicionales..."
                className={`w-full h-24 md:h-32 p-3 rounded-lg filter-input outline-none transition-all resize-none ${disabledClasses}`}
              />
              {errors?.description && <ErrorMessage msg={errors.description.message} /> }  
            </div>
            </>
          )}

          {config?.hasComments && (
            <>
            <LabelFieldForm field="Comentarios" />
            <div className="w-full max-w-2xl">
              <textarea
                readOnly={viewMode}
                {...register('comments')}
                placeholder="Ingrese comentarios, cambios, observaciones..."
                className={`w-full h-24 md:h-32 p-3 rounded-lg filter-input outline-none transition-all resize-none ${disabledClasses}`}
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
