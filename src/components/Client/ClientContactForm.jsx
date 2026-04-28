import LabelFieldForm from "../Shared/LabelFieldForm";
import ErrorMessage from "../Shared/ErrorMessage";
import Toggle from "../Shared/Toggle";

function ClientContactForm({ register, errors, viewMode, disabledClasses, setValue, watch  } ) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full div-border">                    
      {/* <LabelFieldForm field={`Fecha ${(meruEventsFlag && !eventOneDayWithEndTime) ? 'Inicio' : ''}`} simbol="*" /> */}
      <div>
        <input 
          readOnly={viewMode} type='date'
          {...register('startDate', {onChange: (e) => guestNextDate(e) })}
          className={`w-full px-3 py-2 rounded-lg filter-input  ${disabledClasses}`} 
        />
        {errors?.startDate && <ErrorMessage msg={errors.startDate.message} /> }  
      </div>
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

        <LabelFieldForm field="Hora Inicio" simbol="*" />
        <div>
          <input 
            readOnly={viewMode} type='time'
            {...register('startTime', { onChange: (e) => { handleNextTime(e)} })} 
            className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          />
          {errors?.startTime && <ErrorMessage msg={errors.startTime.message} /> }
        </div>

        <LabelFieldForm field="Hora Fin" simbol="*" />
        <div>
          <input 
            readOnly={viewMode} type='time'
            {...register('endTime')} 
            className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          />
          {errors?.endTime && <ErrorMessage msg={errors.endTime.message} /> }
        </div> 
  
        <LabelFieldForm field="Estado" simbol="*" />
        <div className='items-center gap-2'>
          <Toggle   
            readOnly={viewMode}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          {errors?.status && <ErrorMessage msg={errors.status.message} /> }  
        </div>

      <LabelFieldForm field="Ubicación" simbol="*" />
      <div>
        {/* <select 
          disabled= {viewMode}
          {...register('locationId')}
          className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
        >    
            <option className="bg-[#3c4042]" value=""> {globalLoading ? "Cargando..." : "Seleccionar..."} </option>
            {locations.map(location => (
              <option key={`location-${location.id}`} className='bg-[#3c4042]' value={location.id}>{location.label}</option>
            ))}
        </select> */}
        {errors?.locationId && <ErrorMessage msg={errors.locationId.message} /> }  
      </div> 



      <LabelFieldForm field="Se repite" />
      <div className='flex flex-row items-center gap-2'>
        <input 
          disabled={viewMode }
          {...register('repeatEvent')}  type='checkbox' className={`w-6 h-6 rounded filter-input text-gray-300 ${disabledClasses} `}  
        />
        <div>
          <select 
            disabled= {viewMode}
            {...register('repeatInterval')}
            className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
          >
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value='Anual'>Anual</option>
              <option className='bg-[#3c4042]' value='Mensual'>Mensual</option>
              <option className='bg-[#3c4042]' value='Quincenal'>Quincenal</option>
          </select>
          {errors?.repeatInterval && <ErrorMessage msg={errors.repeatInterval.message} /> }  
        </div>
      </div> 
  

  
  
      <LabelFieldForm field="Crear Alerta" />
      <div className='flex flex-row items-center gap-2'>
        <input 
          disabled={viewMode}  type='checkbox'  
          {...register('createAlert')} className={`w-6 h-6 rounded filter-input text-gray-300 ${disabledClasses}`}
        />
        {errors?.createAlert && <ErrorMessage msg={errors.createAlert.message} /> }  
      </div>
  
      <LabelFieldForm field="Resaltar Día" />
      <div className='flex flex-row items-center gap-2'>
        <input 
          disabled={viewMode}  type='checkbox'
          {...register('coloringDay')} className={`w-6 h-6 rounded filter-input text-gray-300 ${disabledClasses}`}
        />
        {errors?.coloringDay && <ErrorMessage msg={errors.coloringDay.message} /> }  
      </div>
      </>
    </div>
  );
}

export default ClientContactForm;