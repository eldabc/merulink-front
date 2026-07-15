import * as yup from 'yup';

export const changePasswordValidationSchema = yup.object().shape({
   new_password: yup
    .string()
    .required('La nueva contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),

  new_password_confirmation: yup
    .string()
    .required('Debes confirmar la nueva contraseña')
    .oneOf([yup.ref('new_password')], 'Las contraseñas no coinciden'),
});