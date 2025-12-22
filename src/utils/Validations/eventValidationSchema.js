import * as yup from 'yup';

// Validation schema for Position form
export const eventValidationSchema = yup.object().shape({
   
  typeEventId: yup
    .string()
    .required('Tipo de evento es requerido'),
    // .matches(/^[0-9]+$/, 'Solo se permiten números.')
    // .max(4, 'Debe contener máximo 4 dígitos')
    // .min(3, 'Debe contener mínimo 3 dígitos'), 
    
  eventName: yup
    .string()
    .required('Nombre del evento es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\/]+$/, "Solo se permiten letras y los signos '-','/'.")
    .max(40, 'Debe contener máximo 40 dígitos'),

  startDate: yup
    .date()
    .required('Fecha de inicio es requerida'),

  startTime: yup.string()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .when('typeEventId', {
    is: 'meru-events',
    then: (schema) => schema.required('La hora de inicio es obligatoria para este evento'),
    otherwise: (schema) => schema.notRequired(),
  }),
    
  endDate: yup.date()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .when('typeEventId', {
    is: 'meru-events',
    then: (schema) => schema.required('La fecha de fin es obligatoria para este evento'),
    otherwise: (schema) => schema.notRequired(),
  }),

  endTime: yup.string()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .when('typeEventId', {
    is: 'meru-events',
    then: (schema) => schema.required('La hora culminación es obligatoria para este evento'),
    otherwise: (schema) => schema.notRequired(),
  }),

  location: yup.date()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .when('typeEventId', {
    is: (val) => val === 'meru-events' || val === 'wedding-nights' || val === 'dinner-heights',
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
    
});
