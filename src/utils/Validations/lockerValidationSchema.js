import * as yup from 'yup';

export const lockerValidationSchema = yup.object().shape({
  code: yup.string()
    .required('Codigo es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números.'),

  status: yup.string()
    .required('Estatus es requerido'),

  category: yup.string()
    .required('Categoría es requerida')
});