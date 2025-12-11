import * as yup from 'yup';

// Validation schema for Employee form
export const departmentValidationSchema = yup.object().shape({
   
  code: yup
    .string()
    .required('Cédula es requerida')
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .min(8, 'Debe contener 8 dígitos')
    .max(8, 'Debe contener 8 dígitos'), 
    
  departmentName: yup
    .string()
    .required('Nombre del departamento es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
    
});