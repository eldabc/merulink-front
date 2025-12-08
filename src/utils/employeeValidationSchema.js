import * as yup from 'yup';

// Validation schema for Employee form
export const employeeValidationSchema = yup.object().shape({
  numEmployee: yup
    .string()
    .required('No. Empleado es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .min(3, 'Mínimo 3 caracteres')
    .max(12, 'Máximo 12 caracteres'), 
    
  ci: yup
    .string()
    .required('Cédula es requerida')
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .min(8, 'Debe contener 8 dígitos')
    .max(8, 'Debe contener 8 dígitos'), 
    
  firstName: yup
    .string()
    .required('Primer nombre es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
    
  secondName: yup
    .string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'Solo se permiten letras.')
    .optional(),
    
  lastName: yup
    .string()
    .required('Primer apellido es requerido')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
    
  secondLastName: yup
    .string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'Solo se permiten letras.')
    .optional(),
    
  birthDate: yup
    .date()
    .optional()
    .nullable()
    .max(new Date(), 'La fecha de nacimiento no puede ser futura'),
    // .test(
    //   'is-adult',
    //   'Debe ser mayor de 18 años',
    //   (value) => {
    //     if (!value) return true;
    //     const today = new Date();
    //     const birth = new Date(value);
        
    //     const eighteenYearsAgo = new Date(
    //       birth.getFullYear() + 18,
    //       birth.getMonth(),
    //       birth.getDate()
    //     );
    //     return today >= eighteenYearsAgo;
    //   }
    // )

  placeOfBirth: yup.string(),
  nationality: yup.string(),
  
  age: yup.string().matches(/^[0-9]*$/, 'Solo se permiten números.'), 
  sex: yup.string(),
 
  maritalStatus: yup.string(),
  bloodType: yup.string(),
  
  email: yup.string().email('Email inválido').required('Email es requerido'),
  
  mobilePhoneCode: yup.string(),
  mobilePhone: yup
    .string()
    .required('Teléfono móvil es requerido')
    .matches(/^[0-9]{7}$/, 'Formato inválido. Debe ser 04XX seguida de 7 dígitos (ej: 04121234567).')
    .min(7, 'Debe contener 7 dígitos')
    .max(7, 'Debe contener 7 dígitos'), 

  homePhoneCode: yup.string(),
  homePhone: yup
    .string()
    .matches(/^[0-9]+$/, 'Solo se permiten números.')
    .max(15, 'Máximo 15 dígitos')
    .optional(),
    
  address: yup.string(),
  joinDate: yup.string().required('Fecha de ingreso es requerida'),
  department: yup.string().required('Departamento es requerido'),
  subDepartment: yup.string(),
  position: yup.string().required('Cargo es requerido'),
  status: yup.boolean(),
  useMeruLink: yup.boolean(),
  useHidCard: yup.boolean(),
  useLocker: yup.boolean(),
  useTransport: yup.boolean(),
  
  // Validación de contactos
  contacts: yup.array().of(
    yup.object().shape({
      id: yup.number(),

      name: yup
        .string()
        .required('Nombre del contacto es requerido')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
        
      lastName: yup
        .string()
        .required('Apellido del contacto es requerido')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
        
      relationship: yup.string().required('Parentesco es requerido'),
      
      phone: yup
        .string()
        .required('Teléfono es requerido')
        .matches(/^[0-9]+$/, 'Solo se permiten números.'),
        
      address: yup.string().required('Dirección es requerida'),
    })
  ),
});