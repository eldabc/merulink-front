import * as yup from 'yup';

// Validation schema for Department form
export const departmentValidationSchema = yup.object().shape({
   
  code: yup
    .string()
    .required('Código es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .max(2, 'Debe contener 2 dígitos')
    // .min(3, 'Debe contener 3 dígitos')
    , 
    
  departmentName: yup
    .string()
    .required('Nombre del departamento es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
    
});