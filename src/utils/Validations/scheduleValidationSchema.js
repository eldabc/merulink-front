import * as yup from 'yup';
import { nigthShiftOptions } from '../../utils/StaticData/shift-utils';


export const scheduleValidationSchema = yup.object().shape({
  code: yup
    .string()
    .required('Código es requerido')
    .matches(/^[A-Z0-9-]+$/, 'Solo se permiten letras mayúsculas, números y guiones.')
    .max(5, 'Debe contener máximo 5 dígitos')
    .min(3, 'Debe contener mínimo 3 dígitos'),

  description: yup.string()
    .nullable()
    .required('Debe ingresar Descripción'),

  nightShift: yup
    .string()
    .required('Debe seleccionar Turno')
    .oneOf(
      [
        nigthShiftOptions.optionOne.key, // Diurno
        nigthShiftOptions.optionTwo.key  // Nocturno
      ],
      'Opción inválida'
    )
    .test(
      'night-shift-validation',
      'Las horas no corresponden a un turno nocturno',
      function (value) {

        const { checkInTime, checkOutTime } = this.parent;
        if (!checkInTime || !checkOutTime) return true;

        // Si NO seleccionó turno nocturno, no validar
        if (value !== nigthShiftOptions.optionTwo.key) {
          return true;
        }

        const toMinutes = (time) => {
          const [h, m] = time.split(':').map(Number);
          return h * 60 + m;
        };

        const checkIn = toMinutes(checkInTime);
        const checkOut = toMinutes(checkOutTime);

        // turno nocturno cruza medianoche
        return checkOut < checkIn;
      }
    ),

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
  .when(['checkInTime', 'nightShift'], {
    is: (checkInTime, nightShift) => !!checkInTime, // Se activa si hay hora de entrada puesta
    then: (schema) => schema.test(
      'is-after-checkInTime',
      'La hora de salida no puede ser menor que la hora de entrada',
      function (value) {
        // Traer ambos valores desde el parent
        const { checkInTime, nightShift } = this.parent;
        
        // Si falta la salida o la entrada, no valida
        if (!value || !checkInTime) return true;

        // Si es turno Nocturno ('night') salta la validación 
        if (nightShift === nigthShiftOptions.optionTwo.key) {
          return true; 
        }

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