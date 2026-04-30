import * as yup from 'yup';
import { STATUS_EVENTS } from '../StaticData/event-utils';
import { EVENT_CAT } from '../eventConfig';

// Validation schema for Events form
export const eventValidationSchema = yup.object().shape({
  category: yup
    .string()
    .required('Tipo de evento es requerido'),
    
  eventName: yup
    .string()
    .required('Nombre del evento es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\/]+$/, "Solo se permiten letras y los signos '-','/'.")
    .max(100, 'Debe contener máximo 100 dígitos'),

  startDate: yup
  .date()
  .required('Fecha de inicio es requerida')
  .when('category', {
    is: (val) => val !== 've-holidays' && val !== 'google-calendar',
    then: (schema) => schema.min(
      new Date(new Date().setHours(0, 0, 0, 0)), 
      'La fecha de inicio no puede ser anterior a la actual'
    ),
    otherwise: (schema) => schema,
  }),

  startTime: yup.string()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .when('category', {
    is: (val) => [EVENT_CAT.M_EVENTS.key, EVENT_CAT.W_NIGHTS.key, EVENT_CAT.D_HEIGHTS.key, EVENT_CAT.E_MOD.key].includes(val),
    then: (schema) => schema.required('La hora de inicio es obligatoria para este evento'),
    otherwise: (schema) => schema.notRequired(),
  }),
    
  endDate: yup.date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(yup.ref('startDate'), 'La fecha de fin no puede ser anterior a la de inicio')
    .when('category', {
      is: (val) => [EVENT_CAT.M_EVENTS.key, EVENT_CAT.E_MOD.key].includes(val),
      then: (schema) => schema.required('La fecha de fin es obligatoria'),
      otherwise: (schema) => schema.notRequired(),
    }),

  endTime: yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('category', {
      is: (val) => [EVENT_CAT.M_EVENTS.key, EVENT_CAT.W_NIGHTS.key, EVENT_CAT.E_MOD.key].includes(val),
      then: (schema) => schema
        .required('La hora culminación es obligatoria')
        // Valida que la hora fin sea mayor a la de inicio 
        .test('is-after-startTime', 'La hora de fin debe ser posterior a la de inicio', function(value) {
          const { startTime, startDate, endDate } = this.parent;
          
          const isSameDay = startDate?.getTime() === endDate?.getTime();
          
          if (isSameDay && startTime && value) {
            return value > startTime; // Compara "HH:mm"
          }
          return true;
        }),
      otherwise: (schema) => schema.notRequired(),
    }),

  locationId: yup.string()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .when('category', {
    is: (val) => val === EVENT_CAT.M_EVENTS.key || val === EVENT_CAT.W_NIGHTS.key || val === EVENT_CAT.D_HEIGHTS.key,
    then: (schema) => schema.required('La ubicación es obligatoria para este evento'),
    otherwise: (schema) => schema.notRequired(),
  }),

  repeatEvent: yup.boolean()
  .nullable()
  .optional(),

  repeatInterval: yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('repeatEvent', {
      is: true, // Si repeatEvent es true (está clicado)
      then: (schema) => schema
        .required('Debe indicar el intervalo de repetición'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  createAlert: yup.boolean(),

  description: yup.string()
  .nullable()
  .optional(),

  comments: yup.string()
  .nullable()
  .optional(),

  status: yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('category', {
      is: (val) => val === EVENT_CAT.M_EVENTS.key || val === EVENT_CAT.W_NIGHTS.key || val === EVENT_CAT.D_HEIGHTS.key,
      then: (schema) => schema.required('El estado es requerido'),
      otherwise: (schema) => schema.notRequired(),
    })
   .oneOf([STATUS_EVENTS.tentative, STATUS_EVENTS.confirmed], 'Estado inválido'),
    
  coloringDay: yup.boolean(),

  isTemplate: yup.boolean(),

  templateName: yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('isTemplate', {
      is: true, // Si isTemplate es true (está clickeado)
      then: (schema) => schema
        .required('Debe ingresar el nombre de la plantilla'),
      otherwise: (schema) => schema.notRequired(),
    }),

  // Validación de event contacts
    contacts: yup.array().of(
      yup.object().shape({
        id: yup.number(),
  
        firstName: yup
          .string()
          .required('Nombre del contacto es requerido')
          .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
          
        lastName: yup
          .string()
          .required('Apellido del contacto es requerido')
          .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
        
        email: yup.string().email('Email inválido').required('Email es requerido'),
                
        phone: yup
          .string()
          .required('Teléfono es requerido')
          .matches(/^[0-9-]+$/, 'Solo se permiten números.'),
          
      })
    ),
  
});
