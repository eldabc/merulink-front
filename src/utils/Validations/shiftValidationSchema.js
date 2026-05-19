import * as yup from 'yup';

export const shiftValidationSchema = yup.object().shape({
  code: yup
    .string()
    .required('Código es requerido')
    .matches(/^[A-Z0-9-]+$/, 'Solo se permiten letras mayúsculas, números y guiones.')
    .max(5, 'Debe contener máximo 5 dígitos')
    .min(3, 'Debe contener mínimo 3 dígitos'),

  description: yup.string()
    .nullable()
    .required('Debe ingresar Descripción'),

  nightShift: yup.string()
    .required('Debe seleccionar Turno')
    .oneOf(['Diurno', 'Nocturno'], 'Opción inválida'),

  departmentId: yup
    .string()
    .required('Debe seleccionar Departamento'),
  
  typeShift: yup.string()
    .required('Debe seleccionar Tipo de Turno')
    .oneOf(['operative', 'administrative'], 'Opción inválida'),

  checkInTime: yup.string()
    .required('La hora de inicio es obligatoria'),

  checkOutTime: yup.string()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .required('La hora de culminación es obligatoria')
  .when('checkInTime', {
    is: (checkInTime) => !!checkInTime, // Solo se ejecuta si ya pusiste la hora de entrada
    then: (schema) => schema.test(
      'is-after-checkInTime',
      'La hora de salida no puede ser menor que la hora de entrada',
      function (value) {
        const { checkInTime } = this.parent;
        
        // Si falta alguno de los dos valores por escribir, no validamos todavía
        if (!value || !checkInTime) return true;

        // Compara directamente los strings "17:00" >= "08:00"
        return value >= checkInTime;
      }
    ),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  allowExit: yup
    .string()
    .required('Este campo es requerido')
    .oneOf(["yes", "no"], 'Opción inválida'),

  allowReScanned: yup
    .string()
    .required('Este campo es requerido')
    .oneOf(["yes", "no"], 'Opción inválida'),

  available: yup.string()
    .oneOf(["yes", "no"], 'Opción inválida')
    .required('Este campo es requerido'),

  observation: yup.string()
    .nullable()
    .max(200, 'Debe contener máximo 200 caracteres'),
});