import * as yup from 'yup';

export const lockerAssignValidationSchema = yup.object().shape({

  padlockId: yup.string()
    .required('Debe seleccionar un Candado'),
  
  departmentId: yup.string().nullable(),

  employeeId: yup.string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .when('departmentId', {
      is: (val) => !!val,
      then: (schema) =>
        schema.required('Debe seleccionar empleado'),
    }),


});