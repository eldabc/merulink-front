import * as yup from 'yup';
import { nigthShiftOptions } from '../../utils/StaticData/shift-utils';


export const scheduleValidationSchema = yup.object().shape({
  status: yup.string(), //.required('Estatus es requerido')

  observations: yup.string()
    .nullable()
    .max(200, 'Debe contener máximo 200 caracteres'),
});