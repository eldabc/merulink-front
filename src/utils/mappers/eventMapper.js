import { formatDateToEvent } from '../date-utils';
import { findFixedEvents } from '../Events/events-utils';

export const mapEventToBackend = (formData) => {

   let isFixed = false;
   
//    const typeEvent = categoryEvents.find(te => te.key === formData.category);
//    const getEventLocationById = formData.locationId ? getLocationById(formData.locationId) : null;
   
   let allDay = false;
   let labelCategory = '';
   if (formData.category === 'meru-birthdays' || formData.category === 'google-calendar' || formData.category === 'executive-mod' 
       || formData.category === 'banking-mondays' || formData.category === 've-holidays'
      ) { allDay = true; }

   if (formData.category === 'google-calendar') {
    isFixed = findFixedEvents(formData); 
    labelCategory = 'Festivo Almacenamiento Local'
   }

    return {
      id: formData.id ? formData.id : Date.now(),
      title: formData.eventName,
      start: formatDateToEvent(formData.startDate, formData.startTime),
      end: formData.endDate ? formatDateToEvent(formData.endDate, formData.endTime) : null,
      all_day: allDay,
      extended_props: {
        // category: formData.category,
        category_key: formData.category,
        special_label: labelCategory,
        status: formData.status,
        location_id: formData.locationId,
        // location_name: getEventLocationById ? getEventLocationById.label : '',
        repeat_event: formData.repeatEvent,
        repeat_interval: formData.repeatInterval,
        create_alert: formData.createAlert,
        coloring_day: formData.coloringDay,
        description: formData.description,
        comments: formData.comments,
        is_fixed: isFixed,
        created_by: formData.createdBy,
        // is_template: formData.isTemplate,
        template_name: formData.isTemplate ? formData.templateName : '',
      },
      
      
    };
  }