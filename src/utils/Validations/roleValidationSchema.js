import * as yup from 'yup';

export const roleValidationSchema = yup.object().shape({
  roleName: yup
    .string()
    .required('El nombre del rol es obligatorio')
    .min(3, 'Mínimo 3 caracteres'),

  permissions: yup
    .array()
    .of(yup.string())
    .min(1, 'Debe seleccionar al menos un permiso'),
});