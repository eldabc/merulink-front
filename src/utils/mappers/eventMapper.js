import { formatDateToEvent } from '../date-utils';
import { findFixedEvents } from '../Events/events-utils';

export const mapEventToBackend = (formData) => {

   let isFixed = false;
   let labelCategory = '';

   const allDay = (formData.category === 'meru-birthdays' || formData.category === 'google-calendar' || formData.category === 'executive-mod' 
       || formData.category === 'banking-mondays' || formData.category === 've-holidays'
      ) ? true : false;

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
        status: formData.status,
        repeat_event: formData.repeatEvent,
        repeat_interval: formData.repeatInterval,
        create_alert: formData.createAlert,
        coloring_day: formData.coloringDay,
        description: formData.description ?? '',
        comments: formData.comments ?? '',
        is_fixed: isFixed,
        created_by: formData.createdBy, // debería ser id de usuario
      },
      category_key: formData.category, // aqui no se tiene id pues se usa el key en back se busca id
      special_label: labelCategory, // ver como manejar este label spacial en google-events que se extrajeron
      location_id: formData.locationId,
      is_template: formData.isTemplate,
      template_name: formData.isTemplate ? formData.templateName : '', // va para tabla aparte
      
    };
  }