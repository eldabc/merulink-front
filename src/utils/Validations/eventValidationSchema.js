import * as yup from 'yup';

// Validation schema for Position form
export const eventValidationSchema = yup.object().shape({
   
  typeEventId: yup
    .string()
    .required('Tipo de evento es requerido'),
    
  eventName: yup
    .string()
    .required('Nombre del evento es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\/]+$/, "Solo se permiten letras y los signos '-','/'.")
    .max(40, 'Debe contener máximo 40 dígitos'),

  startDate: yup
  .date()
  .required('Fecha de inicio es requerida')
  .when('typeEventId', {
    is: (val) => val !== 've-holidays',
    then: (schema) => schema.min(
      new Date(new Date().setHours(0, 0, 0, 0)), 
      'La fecha de inicio no puede ser anterior a la actual'
    ),
    otherwise: (schema) => schema,
  }),

  startTime: yup.string()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .when('typeEventId', {
    is: (val) => ['meru-events', 'wedding-nights'].includes(val),
    then: (schema) => schema.required('La hora de inicio es obligatoria para este evento'),
    otherwise: (schema) => schema.notRequired(),
  }),
    
  endDate: yup.date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(yup.ref('startDate'), 'La fecha de fin no puede ser anterior a la de inicio')
    .when('typeEventId', {
      is: 'meru-events',
      then: (schema) => schema.required('La fecha de fin es obligatoria'),
      otherwise: (schema) => schema.notRequired(),
    }),

  endTime: yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('typeEventId', {
      is: (val) => ['meru-events', 'wedding-nights'].includes(val),
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

  description: yup.string()
  .nullable()
  .optional(),

  comments: yup.string()
  .nullable()
  .optional(),

  status: yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('typeEventId', {
      is: (val) => val === 'meru-events' || val === 'wedding-nights' || val === 'dinner-heights',
      then: (schema) => schema.required('El estado es requerido'),
      otherwise: (schema) => schema.notRequired(),
    })
   .oneOf(['Tentativo', 'Confirmado'], 'Estado inválido'),
    
  coloringDay: yup.boolean(),
  
});
