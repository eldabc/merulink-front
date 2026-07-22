import * as yup from 'yup';

export const roleValidationSchema = yup.object().shape({
  // pass: yup.string()
  //   .required('Contraseña es requerido')
  //   .matches(
  //     /^[0-9]{2}-[0-9]{2}-[0-9]{2}$/, 
  //     'El formato debe ser XX-XX-XX (ej. 12-34-56)'
  //   ),

//   status: yup.string()
//     .required('Estatus es requerido'),

//   serial: yup.string()
//     .required('Serial es requerido')
});