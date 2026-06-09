import * as yup from 'yup';

export const scheduleValidationSchema = yup.object().shape({
  observations: yup.string()
    .nullable()
    .max(200, 'Debe contener máximo 200 caracteres'),

  // Revisado
  is_reviewed: yup.boolean(),

  // Aprobado
  is_approved: yup.boolean()
    .when('is_reviewed', {
      is: false,
      then: (schema) => schema.oneOf([false], 'No se puede aprobar si no ha sido revisado primero.'),
      otherwise: (schema) => schema
    }),

  // Cerrado
  is_closed: yup.boolean()
    .when(['is_reviewed', 'is_approved'], {
      is: (is_reviewed, is_approved) => !is_reviewed || !is_approved,
      then: (schema) => schema.oneOf([false], 'Debe estar revisado y aprobado para poder cerrarse.'),
      otherwise: (schema) => schema
    }),
});