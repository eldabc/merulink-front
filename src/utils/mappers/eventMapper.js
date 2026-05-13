
import { formatDateToEvent } from '../date-utils';
import { findFixedEvents } from '../Events/events-utils';
import { EVENT_CAT } from '../eventConfig.js';
import { sanitizePhone } from "../global-utils";
import { buildRRule } from '../eventConfig.js';

export const mapEventToBackend = (formData) => {
  // console.log("Mapping event data for backend:", formData?.eventType);

  const isFixed = findFixedEvents(formData); 
  const status = formData.status ? formData.status : 'Creado';

  const allDay = (formData.category === EVENT_CAT.M_BIRTHDAYS.key || formData.category === EVENT_CAT.G_CALENDAR.key 
      || formData.category === EVENT_CAT.E_MOD.key || formData.category === EVENT_CAT.B_MONDAYS.key 
      || formData.category === EVENT_CAT.VE_HOLIDAYS.key
  ) ? true : false;

  const rrule = buildRRule(
    formData.repeatInterval,
    null
  );

    return {
      id: formData.id ? formData.id : Date.now(),
      title: formData.eventName,
      start: formatDateToEvent(formData.startDate, formData.startTime),
      end: formData.endDate ? formatDateToEvent(formData.endDate, formData.endTime) : null,
      all_day: allDay,
      
      ...(formData.category === EVENT_CAT.G_CALENDAR.key && {
          external_source: EVENT_CAT.G_CALENDAR.key,
          external_id: formData.id, // En este caso este es el ID que viene de Google
        }),

      repeat_event: formData.repeatEvent,
      repeat_interval: formData.repeatInterval,

      extended_props: {
        status: status,
        event_type: formData?.eventType,
        create_alert: formData.createAlert,
        coloring_day: formData.coloringDay,
        description: formData.description ?? '',
        comments: formData.comments ?? '',
        is_fixed: isFixed,
        created_by: formData.createdBy, // debería ser id de usuario

        ...(formData.category === EVENT_CAT.G_CALENDAR.key && {
          special_label: 'Festivo Almacenamiento Local',
        }),
      },
      
      category_key: formData.category, // front trabaja con el key, en back se busca id
      location_id: formData.locationId,
      is_template: formData.isTemplate,
      template_name: formData.isTemplate ? formData.templateName : '', // va para eventTemplate
      
      contacts: formData.contacts?.map(contact => ({
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact?.email ?? null,
        phones: contact.phones?.map(p => {
          // Unir code + number ("0414" + "000-0000")
          const fullPhone = `${p.code}${p.number}`;
          
          return {
            phone_number: sanitizePhone(fullPhone),
          };
        }) || []
      })) || []
      
    };
  }