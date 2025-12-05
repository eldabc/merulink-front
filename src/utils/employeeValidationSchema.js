import * as yup from 'yup';

// Validation schema for Employee form
export const employeeValidationSchema = yup.object().shape({
  numEmployee: yup.string().required('No. Empleado es requerido'),
  ci: yup.string().required('Cédula es requerida'),
  name: yup.string().required('Nombre es requerido'),
  firstName: yup.string().required('Primer nombre es requerido'),
  secondName: yup.string(),
  lastName: yup.string().required('Apellido es requerido'),
  firstLastName: yup.string().required('Primer apellido es requerido'),
  secondLastName: yup.string(),
  birthDate: yup.string(),
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
