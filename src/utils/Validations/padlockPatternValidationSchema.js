import * as yup from 'yup';

export const padlockPatternValidationSchema = yup.object().shape({
  unlockSequence: yup.array().of(
      yup.object().shape({

        action: yup
            .string()
            .required('Tipo de acción es requerida')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
            
        direction: yup
            .string()
            .required('Dirección es requerida')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
        
        amount: yup
            .number()
            .required('Cantidad es requerida')
            .typeError('Solo se permiten números.')
            .moreThan(0, 'El valor debe ser al menos 1'),
      })
  ),
  modelName: yup.string()
    .required('El nombre del modelo de candado es requerido'),

  resetInstructions: yup.string()
    .required('La instrucciones son requeridas.'),
});