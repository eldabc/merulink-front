import * as yup from 'yup';

export const padlockValidationSchema = yup.object().shape({
  pass: yup.string()
    .required('Contraseña es requerido'),

  status: yup.string()
    .required('Estatus es requerido'),

  serial: yup.string()
    .required('Serial es requerido')
});