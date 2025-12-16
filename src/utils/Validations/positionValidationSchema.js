import * as yup from 'yup';

// Validation schema for Position form
export const positionValidationSchema = yup.object().shape({
   
  code: yup
    .string()
    .required('Código es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .max(3, 'Debe contener 3 dígitos')
    .min(2, 'Debe contener 2 dígitos')
    , 
    
  positionName: yup
    .string()
    .required('Nombre del departamento es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
    
});