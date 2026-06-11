import * as yup from 'yup';

export const scheduleValidationSchema = yup.object().shape({
  observations: yup.string()
    .nullable()
    .max(200, 'Debe contener máximo 200 caracteres'),

  // Revisado
  isReviewed: yup.boolean(),

  // Aprobado
  isApproved: yup.boolean()
    .when('isReviewed', {
      is: false,
      then: (schema) => schema.oneOf([false], 'No se puede aprobar si no ha sido revisado primero.'),
      otherwise: (schema) => schema
    }),

  // Cerrado
  isClosed: yup.boolean()
    .when(['isReviewed', 'isApproved'], {
      is: (isReviewed, isApproved) => !isReviewed || !isApproved,
      then: (schema) => schema.oneOf([false], 'Debe estar revisado y aprobado para poder cerrarse.'),
      otherwise: (schema) => schema
    }),
});