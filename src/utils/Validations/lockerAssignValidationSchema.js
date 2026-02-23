import * as yup from 'yup';

export const lockerAssignValidationSchema = yup.object().shape({

  padlockId: yup.string()
    .required('Debe seleccionar un Candado'),
  
  employeeId: yup.string().nullable(),

});