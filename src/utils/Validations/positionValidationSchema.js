import * as yup from 'yup';

// Validation schema for Position form
export const positionValidationSchema = yup.object().shape({
   
  code: yup
    .string()
    .required('Código es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .max(4, 'Debe contener máximo 4 dígitos')
    .min(3, 'Debe contener mínimo 3 dígitos'), 
    
  positionName: yup
    .string()
    .required('Nombre del departamento es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\/]+$/, "Solo se permiten letras y los signos '-','/'.")
    .max(40, 'Debe contener máximo 40 dígitos'),
    
});