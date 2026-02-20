import * as yup from 'yup';

export const lockerAssignValidationSchema = yup.object().shape({
  category: yup.string()
    .required('Categoría es requerida'),
    
  lockerId: yup.string()
    .required('Debe seleccionar Locker'),

  padlockId: yup.string()
    .required('Candado es requerido')
});