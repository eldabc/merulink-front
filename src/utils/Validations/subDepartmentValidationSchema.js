import * as yup from 'yup';

// Validation schema for Department form
export const subDepartmentValidationSchema = yup.object().shape({
   
  code: yup
    .string()
    .required('Código es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .max(3, 'Debe contener 3 dígitos'), 

  subDepartmentName: yup
    .string()
    .required('Nombre del subdepartamento es requerido')
    .max(30, 'Debe contener máximo 30 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),

  departmentId: yup
    .string()
    .required('Debe seleccionar un departamento')
    
});