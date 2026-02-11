import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryEvents } from '../../utils/StaticData/typeEvent-utils';
import { eventValidationSchema } from '../../utils/Validations/eventValidationSchema';
import { useEvents } from '../../context/EventContext';
import { useEffect, useState } from 'react';
import { divideDateTime, getNextHour } from '../../utils/date-utils';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';
import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import TabButtonsManager from './tabs/TabButtonsManager.jsx';
import EventTemplates from './tabs/EventTemplates.jsx';
import EventFormContent from './EventFormContent.jsx';

export default function EventForm({ mode = 'create', onBack }) {
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(eventValidationSchema),
      mode: 'onChange',
      reValidateMode: 'onChange'
  });
  
  const [categoryType, setcategoryType] = useState('');
  const [createdBy, setCreatedBy] = useState('Sistema');
  const [activeTab, setActiveTab] = useState('formEvent');
  const { createEvent, updateEvent, handleGoogleEvents, isTemplate, setIsTemplate, templateName, setTemplateName, setSelectedCategory } = useEvents();
  
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.data;
  const disabled = event?.extendedProps?.status === 'Finalizado' ? true : false;

  const createMode =  mode === 'create';
  const viewMode = mode === 'view';
  const editMode =  mode === 'edit';

  const selectedCategory = watch('category');
  const isRepeatEvent = watch('repeatEvent');

  const meruEventsFlag = selectedCategory === 'meru-events' || selectedCategory === 'wedding-nights' || selectedCategory === 'dinner-heights';
  const eventOneDayWithEndTime = selectedCategory === 'dinner-heights';
  const isGoogleCategory = selectedCategory === 'google-calendar'
  const isMeruBirthdays = selectedCategory === 'meru-birthdays'
  const eventWithoutLocation = selectedCategory === 've-holidays' || isMeruBirthdays || isGoogleCategory || selectedCategory === 'executive-mod';
 
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
        locationId: event?.extendedProps?.locationId ?? '',
        repeatEvent: event?.extendedProps?.repeatEvent ?? false,
        repeatInterval: event?.extendedProps?.repeatInterval ?? '',
        createAlert: event?.extendedProps?.createAlert ?? false,
        coloringDay: event?.extendedProps?.coloringDay ?? false,
        description: event?.extendedProps?.description ?? '',
        comments: event?.extendedProps?.comments ?? '',
        category: category,
        isTemplate: isTemplateValue,
        templateName: templateNameValue
      }
  }

  useEffect(() => {
    if (event && (editMode || viewMode)) {
        
      const categoryTypeExtracted = event?.extendedProps?.category;
      let createdBy = event.extendedProps?.createdBy;

      if (isGoogleCategory) createdBy = 'Sistema';

      setCreatedBy(createdBy);      
      reset(
        eventReset(categoryTypeExtracted, event)
      );

      setcategoryType(categoryTypeExtracted);

    } else if (createMode) {
      reset(
        eventReset('', null)
      );

      setcategoryType('');
    }
  }, [event, mode, reset, setTemplateName, setIsTemplate]);

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
        if (createMode) navigate(-1);
        else navigate(-2);
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
      const dateString = e.target.value;
      if (!dateString ) return;
      
      const date = new Date(dateString);
      
      if (selectedCategory === 'wedding-nights') {
        date.setDate(date.getDate() + 1);
      }
      const nextDateFormatted = date.toISOString().split('T')[0];
      
      setValue('endDate', nextDateFormatted, { 
        shouldValidate: true,
        shouldDirty: true
      });
    };

    const handleNextTime = (e) => {
      if (selectedCategory === 'dinner-heights') {
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
        {(viewMode && categoryType !== 'meru-birthdays') && <HeadFormButtons url="/eventos/editar" data={event} disabled={disabled} /> }
        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <form onSubmit={handleSubmit(onSubmit, onError)}> 
            <div className="titles-table flex justify-center items-center mb-4">
            <div className="justify-center w-64">
              <div className='mt-5'>
                <h2 className="block text-2xl font-bold text-center"> Tipo de Evento: *</h2>
              </div>
              <div className='mt-5'>
                {viewMode || editMode ? (
                  <div className="text-xl w-full px-3 py-2 rounded-lg bg-[#2f3d44] text-center text-gray-300">
                    {categoryEvents.find(t => t.key === selectedCategory)?.label || 'Sin tipo'}
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
              {selectedCategory && (
                <div className='border border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                                md:[&>*:nth-child(2n)]:pl-4 p-7'
                >
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
                        meruEventsFlag={meruEventsFlag}
                        eventOneDayWithEndTime={eventOneDayWithEndTime}
                        isRepeatEvent={isRepeatEvent}
                        isGoogleCategory={isGoogleCategory}
                        createdBy={createdBy}
                        guestNextDate={guestNextDate}
                        handleNextTime={handleNextTime}
                        setValue={setValue}
                      />
                    )}
                    {activeTab === 'eventTemplates' && ( <EventTemplates applyTemplate={applyTemplate} selectedCategory={selectedCategory}  /> )}
                  </div>
                </div>
              )}
            </div>
            <FooterFormButtons onBack={onBack} isSubmitting={isSubmitting} mode={mode} navigate={navigate} />
          </form>
        </div>
      </div>
    );
}