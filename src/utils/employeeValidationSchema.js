import * as yup from 'yup';

// Validation schema for Employee form
export const employeeValidationSchema = yup.object().shape({
  numEmployee: yup.string().required('No. Empleado es requerido'),
  ci: yup.string().required('Cédula es requerida'),
  firstName: yup.string().required('Primer nombre es requerido'),
  secondName: yup.string(),
  lastName: yup.string().required('Primer apellido es requerido'),
  secondLastName: yup.string(),
  birthDate: yup
    .date()
    .nullable() // Permite que el valor sea null (si el campo no es requerido)
    .max(new Date(), 'La fecha de nacimiento no puede ser futura') // No permite fechas futuras
    .test( // Añadimos una prueba personalizada para verificar la edad mínima
      'is-adult',
      'Debe ser mayor de 18 años',
      (value) => {
        if (!value) return true; // Si no hay valor, la validación de 'required' se encarga

        const today = new Date();
        const birth = new Date(value);
        
        // Calcula la fecha que sería 18 años después del nacimiento
        const eighteenYearsAgo = new Date(
          birth.getFullYear() + 18,
          birth.getMonth(),
          birth.getDate()
        );

        // Si la fecha de hoy es posterior o igual a la fecha de los 18 años, es mayor de 18
        return today >= eighteenYearsAgo;
      }
    ),
  placeOfBirth: yup.string(),
  nationality: yup.string(),
  age: yup.string(),
  maritalStatus: yup.string(),
  bloodType: yup.string(),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  mobilePhone: yup.string().required('Teléfono móvil es requerido'),
  homePhone: yup.string(),
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
  contacts: yup.array().of(
    yup.object().shape({
      id: yup.number(),
      name: yup.string().required('Nombre del contacto es requerido'),
      lastName: yup.string().required('Apellido del contacto es requerido'),
      relationship: yup.string().required('Parentesco es requerido'),
      phone: yup.string().required('Teléfono es requerido'),
      address: yup.string().required('Dirección es requerida'),
    })
  ),
});
