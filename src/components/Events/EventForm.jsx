import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEvents } from '../../context/EventContext';
import { useGlobalData } from '../../context/GlobalDataContext.jsx';

import { eventValidationSchema } from '../../utils/Validations/eventValidationSchema';
import { divideDateTime, getNextHour } from '../../utils/date-utils';
import { getDisabledClasses } from '../../utils/global-utils';  
import { getPathByCategory, EVENT_CAT } from '../../utils/eventConfig.js';
// import { checkEventWithoutLocation } from '../../utils/Events/events-utils.js'

import HeadFormButtons from '../Shared/HeadFormButtons.jsx';
import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import OptionSelect from '../Shared/OptionSelect.jsx';
import SpanText from '../Shared/SpanText.jsx';
import TabButtonsManager from './tabs/TabButtonsManager.jsx';
import EventTemplates from './tabs/EventTemplates.jsx';
import EventFormContent from './EventFormContent.jsx';

export default function EventForm({ mode = 'create' }) {
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(eventValidationSchema),
      mode: 'onChange',
      reValidateMode: 'onChange'
  });
  
  const [createdBy, setCreatedBy] = useState('Sistema');
  const [activeTab, setActiveTab] = useState('formEvent');
  const [event, setEvent] = useState(null);
  const [templateInfo, setTemplateInfo] = useState([]);

  const {
    loading,
    eventData,
    createEvent, 
    updateEvent, 
    handleGoogleEvents, 
    isTemplate, 
    config,
    setIsTemplate, templateName, setTemplateName, setSelectedCategory, loadEventById 
  } = useEvents();

  const { globalLoading, loadEventCategories, categoryEvents, getLocations, locations  } = useGlobalData();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const disabled = event?.extendedProps?.status === 'Finalizado' ? true : false;

  const createMode =  mode === 'create';
  const viewMode = mode === 'view';
  const editMode =  mode === 'edit';

  const selectedCategory = watch('category');
  const isRepeatEvent = watch('repeatEvent');

  const meruEventsFlag = selectedCategory === EVENT_CAT.M_BIRTHDAYS.key || selectedCategory === EVENT_CAT.W_NIGHTS.key || selectedCategory === EVENT_CAT.D_HEIGHTS.key; //'meru-events' 'wedding-nights' 'dinner-heights'
  const eventOneDayWithEndTime = selectedCategory === EVENT_CAT.D_HEIGHTS.key; //'dinner-heights';
  const isGoogleCategory = selectedCategory === EVENT_CAT.G_CALENDAR.key; //'google-calendar'
  const disabledClasses = getDisabledClasses(viewMode, globalLoading);
 
  useEffect(() => {
    if(categoryEvents.length === 0){
      loadEventCategories();
    }
  }, []); 

  useEffect(() => { 
    if (config.hasLocation && locations.length === 0) {
      getLocations();
    }
  }, [config?.hasLocation, event]);

  useEffect(() => {
    if (id) {
      const isCompoundId = isNaN(id); 

      if (isCompoundId) {
        const data = eventData.find(e => e.id === id);
        // console.log("eventData:", data);
        setEvent(data);
      } else {
        const fetchEvent = async () => {
          const data = await loadEventById(id); 
          setEvent(data);
        };
        
          fetchEvent();
      }     
    }
  }, [id]);

  // Actualizar contexto cuando cambia el valor en form
  useEffect(() => {
    if (typeof selectedCategory !== 'undefined') {
      setSelectedCategory(selectedCategory);
    }
  }, [selectedCategory]); 
  
  // Al seleccionar
  const handleEventChange = (e) => {
    const selectedEventId = e.target.value;

    if (selectedEventId === 'banking-mondays') {
      setValue('category', '');
      return navigate('/eventos/lunes-bancarios/nuevo'); 
    }
    setValue('endDate', null, { shouldValidate: false });

  };

  const updatedData = (data, event) => { 
    return  { ...data, id: event.id }; 
  }

  const eventReset = (category, event) => {
    const divideDateTimeStart = divideDateTime(event?.start);
    const divideDateTimeEnd = divideDateTime(event?.end);
    const isTemplateValue = event?.extendedProps?.isTemplate ?? false;
    const templateNameValue = event?.extendedProps?.templateName ?? '';

    setIsTemplate(isTemplateValue);
    setTemplateName(templateNameValue);
    return {
        eventName: event?.title ?? '',
        startDate: divideDateTimeStart?.date ?? null,
        startTime: divideDateTimeStart?.time ?? null,
        endDate: divideDateTimeEnd?.date ?? null,
        endTime: divideDateTimeEnd?.time ?? null,
        status: event?.extendedProps?.status ?? '',
        locationId: event?.extendedProps?.location?.id ?? '',
        repeatEvent: event?.extendedProps?.repeatEvent ?? false,
        repeatInterval: event?.extendedProps?.repeatInterval ?? '',
        createAlert: event?.extendedProps?.createAlert ?? false,
        coloringDay: event?.extendedProps?.coloringDay ?? false,
        description: event?.extendedProps?.description ?? '',
        comments: event?.extendedProps?.comments ?? '',
        category: event?.extendedProps?.category.key, //category
        isTemplate: isTemplateValue,
        templateName: templateNameValue
      }
  }

  useEffect(() => {
        // console.log("locations", locations);
        // console.log("locations.length", locations.length);
        // console.log("event?.extendedProps?.templateInfo", event?.extendedProps?.templateInfo);

    // if (locations && locations.length > 0 && event) {
      if (event && (editMode || viewMode)) {

        let createdBy = event.extendedProps?.createdBy;
        if (isGoogleCategory) createdBy = 'Sistema';
        setTemplateInfo(event?.extendedProps?.templateInfo);

        setCreatedBy(createdBy);      
        reset( eventReset('', event) );

      } else if (createMode) {
        reset( eventReset('', null) );
      }
    // }
  }, [event, mode, reset, setTemplateName, setIsTemplate, locations]);

  const onSubmit = async (data) => {
    let success = false;
    data = { 
      ...data, 
      createdBy: createdBy, 
      isTemplate: isTemplate,
      templateName: templateName
    }

    if (isGoogleCategory) {
      success = await  handleGoogleEvents(updatedData(data,event));
    } else if (editMode && event) {
      success = await updateEvent(updatedData(data,event));
    } else {
      success = await createEvent(data);
    }

    if (success) {
      const targetPath = getPathByCategory(selectedCategory);
      navigate(`/eventos/${targetPath}`, { 
        state: { justChanged: true }
      });
    }
  };

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };

  const renderCategoryEvents = () => {
    const excludedKeys = [EVENT_CAT.M_BIRTHDAYS.key, EVENT_CAT.G_CALENDAR.key]; //"meru-birthdays", "google-calendar"
    return categoryEvents
            .filter(typeEvent => !excludedKeys.includes(typeEvent.key))
            .map(typeEvent => (
              <option key={`category-${typeEvent.id}`} className='bg-[#3c4042]' value={typeEvent.key}>{typeEvent.label}</option>
          ));
  }

  const guestNextDate = (e) => {
    const dateString = e.target.value;
    if (!dateString ) return;
    
    const date = new Date(dateString);
    
    if (selectedCategory === EVENT_CAT.W_NIGHTS.key) { //'wedding-nights'
      date.setDate(date.getDate() + 1);
    }
    const nextDateFormatted = date.toISOString().split('T')[0];
    
    setValue('endDate', nextDateFormatted, { 
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleNextTime = (e) => {
    if (selectedCategory === EVENT_CAT.D_HEIGHTS.key) {//'dinner-heights'
      const nextHour = getNextHour(e.target.value);
      setValue('endTime', nextHour, { shouldValidate: true });
    }
  }

  const applyTemplate = (templateData) => {
    const data = { 
                  ...templateData, 
                  start: null, 
                  end: null, 
                  extendedProps: { 
                    ...templateData.extendedProps, 
                    isTemplate: false,
                    templateName: ''
                  } 
                }
    const eventFormated = eventReset(selectedCategory, data);
      reset(eventFormated);
    
    // Volver a pestaña del formulario
    setActiveTab('formEvent');
  };

  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
      {loading ? (
        <div className='flex justify-center items-center mt-20'>
          <SpanText text="Cargando Datos Evento..." dinamicClasses="justify-center" />
        </div>
      ) : (
        <>
        {(viewMode && selectedCategory !== EVENT_CAT.M_BIRTHDAYS.key) && <HeadFormButtons url={`/eventos/editar/${event?.id}`} data={[]} disabled={disabled} /> }
        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <form onSubmit={handleSubmit(onSubmit, onError)}> 
            <div className="titles-table ml-5">
              <div className="justify-center w-64">
                <div className='mt-5'>
                  <h3 className="text-xl font-bold mb-4 text-white"> Tipo de Evento: *</h3>
                </div>
                <div className='mt-5'>
                  {viewMode || editMode ? (
                    <div className={`text-xl w-full px-2 py-2 rounded-lg ${event?.extendedProps?.category?.color ?? 'bg-[#2f3d44]'} text-center text-white-600 border border-gray-300 hover:border-[#9fd8ff]`}>
                      {event?.extendedProps?.category?.label || 'Sin tipo'}
                      {/* {categoryEvents.find(t => t.key === selectedCategory)?.label || 'Sin tipo'} */}
                    </div>
                  ) : (
                    <select 
                      {...register('category' , { onChange: handleEventChange })}
                      disabled={globalLoading}
                      className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
                    >
                      <option className="bg-[#3c4042]" value=""> {globalLoading ? "Cargando..." : "Seleccionar..."} </option>
                      {renderCategoryEvents()}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {selectedCategory && (
              <div className='div-border'>

                <TabButtonsManager 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  event={event}
                  mode={mode}
                />

                <div className="mt-6">     
                  {activeTab === 'formEvent' && (
                    <EventFormContent
                      register={register}
                      errors={errors}
                      viewMode={viewMode}
                      editMode={editMode}
                      config={config}
                      meruEventsFlag={meruEventsFlag}
                      eventOneDayWithEndTime={eventOneDayWithEndTime}
                      isRepeatEvent={isRepeatEvent}
                      isGoogleCategory={isGoogleCategory}
                      createdBy={createdBy}
                      guestNextDate={guestNextDate}
                      handleNextTime={handleNextTime}
                      setValue={setValue}
                      disabledClasses={disabledClasses}
                      globalLoading={globalLoading}
                      locations={locations}
                      templateInfo={templateInfo}
                    />
                  )}
                  {activeTab === 'eventTemplates' && ( <EventTemplates applyTemplate={applyTemplate} selectedCategory={selectedCategory} setActiveTab={setActiveTab}  /> )}
                </div>
                
              </div>
            )}

            <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} /> 
            
          </form>
        </div>
        </>
      )}
      
    </div>
  );
}