import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryEvents } from '../../utils/StaticData/typeEvent-utils';
import { eventValidationSchema } from '../../utils/Validations/eventValidationSchema';
import { locations } from '../../utils/StaticData/location-utils';
import { useEvents } from '../../context/EventContext';
import { useEffect, useState } from 'react';
import { divideDateTime, getNextHour } from '../../utils/date-utils';
import HeadFormButtons from '../Shared/HeadFormButtons.jsx';
import FooterFormButtons from '../Shared/FooterFormButtons.jsx';
import ErrorMessage from '../Shared/ErrorMessage.jsx';
import InfoToggleSeccion from '../Shared/InfoToggleSecction.jsx'
import TabButtonsManager from './tabs/TabButtonsManager.jsx';
import EventTemplates from './tabs/EventTemplates.jsx';
import EventFormContent from './EventFormContent.jsx';

export default function EventForm({ mode = 'create', onBack }) {
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(eventValidationSchema),
      mode: 'onChange',
      reValidateMode: 'onChange'
  });
  
  const [yearlyEvent, setYearlyEvent] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [categoryType, setcategoryType] = useState('');
  const [createdBy, setCreatedBy] = useState('Sistema');
  const [activeTab, setActiveTab] = useState('formEvent');
  const { createEvent, updateEvent, handleGoogleEvents } = useEvents();
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.data;
  const disabled = event?.extendedProps?.status === 'Finalizado' ? true : false;

  const viewMode = mode === 'view';
  const editMode =  mode === 'edit';

  let selectedCategory = watch('category');
  // const selectedStartTime = watch('startTime');
  const isRepeatEvent = watch('repeatEvent');

  const meruEventsFlag = selectedCategory === 'meru-events' || selectedCategory === 'wedding-nights' || selectedCategory === 'dinner-heights';
  const eventOneDayWithEndTime = selectedCategory === 'dinner-heights';
  const isGoogleCategory = selectedCategory === 'google-calendar'
  const isMeruBirthdays = selectedCategory === 'meru-birthdays'
  const eventWithoutLocation = selectedCategory === 've-holidays' || isMeruBirthdays || isGoogleCategory || selectedCategory === 'executive-mod';
  // Al seleccionar
  const handleEventChange = (e) => {
    e.stopPropagation();
    const selectedEventId = e.target.value;

    if (selectedEventId === 'banking-mondays') {
      setValue('category', '');
      return navigate('/eventos/lunes-bancarios/nuevo'); 
    }
  
    setValue('category', selectedEventId, { shouldValidate: true });

    const yearlyEventValue = handleYearlyEvent(selectedEventId);

    setYearlyEvent(yearlyEventValue);

    const defaultRepitedEvent = yearlyEventValue ? true : false;
    const defaultRepitedInterval = yearlyEventValue ? 'Anual' : '';


    setValue('repeatEvent', defaultRepitedEvent, { shouldValidate: true });
    setValue('repeatInterval', defaultRepitedInterval, { shouldValidate: true });

    setValue('endDate', null, { shouldValidate: false });
  };

  const handleYearlyEvent = (categoryType) => {
    return categoryType === 'meru-birthdays' || categoryType === 've-holidays' || categoryType === 'google-calendar';
  }

  const updatedData = (data, event) => { 
    return  { ...data, id: event.id }; 
  }

  useEffect(() => {
    if (event && (editMode || viewMode)) {
        
      const divideDateTimeStart = divideDateTime(event?.start);
      const divideDateTimeEnd = divideDateTime(event?.end);
      const categoryTypeExtracted = event?.extendedProps?.category;
      const yearlyEventValue = handleYearlyEvent(categoryTypeExtracted);
      let createdBy = event.extendedProps?.createdBy;

      if (isGoogleCategory) createdBy = 'Sistema';

      setCreatedBy(createdBy);

      reset({
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
        category: categoryTypeExtracted
      });

      setYearlyEvent(yearlyEventValue);
      setcategoryType(categoryTypeExtracted);

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

      setYearlyEvent(false);
      setcategoryType('');
    }
  }, [event, mode, reset]);

    const onSubmit = async (data) => {
      let success = false;
      data = { ...data, extendedProps: { createdBy: createdBy } }

      if (isGoogleCategory) {
        success = await  handleGoogleEvents(updatedData(data,event));
      } else if (editMode && event) {
        success = await updateEvent(updatedData(data,event));
      } else {
        success = await createEvent(data);
      }

      if (success) {
        if (mode === 'create') navigate(-1);
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
                  />
                  <div className="mt-6">     
                    {activeTab === 'formEvent' && (
                      <EventFormContent
                        register={register}
                        errors={errors}
                        event={event}
                        viewMode={viewMode}
                        editMode={editMode}
                        selectedCategory={selectedCategory}
                        meruEventsFlag={meruEventsFlag}
                        eventOneDayWithEndTime={eventOneDayWithEndTime}
                        isRepeatEvent={isRepeatEvent}
                        yearlyEvent={yearlyEvent}
                        isGoogleCategory={isGoogleCategory}
                        isMeruBirthdays={isMeruBirthdays}
                        eventWithoutLocation={eventWithoutLocation}
                        isTemplate={isTemplate}
                        setIsTemplate={setIsTemplate}
                        createdBy={createdBy}
                        guestNextDate={guestNextDate}
                        handleNextTime={handleNextTime}
                        handleYearlyEvent={handleYearlyEvent}
                      />
                    )}
                    {activeTab === 'eventTemplates' && ( <EventTemplates selectedCategory={selectedCategory}  /> )}
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