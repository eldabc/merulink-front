import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required('El nombre de usuario es obligatorio')
    .min(4, 'Mínimo 4 caracteres'),

  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(7, 'Mínimo 7 caracteres'),
});
