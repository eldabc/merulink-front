import * as yup from 'yup';

export const padlockPatternValidationSchema = yup.object().shape({
  unlockSequence: yup.array().of(
      yup.object().shape({
        id: yup.number(),

        action: yup
            .string()
            .required('Tipo de acción es requerida')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
            
        direction: yup
            .string()
            .required('Dirección es requerida')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras.'),
        
        amount: yup
            .string()
            .required('Cantidad es requerida')
            .matches(/^[0-9-]+$/, 'Solo se permiten números.'),
      })
  ),
  modelName: yup.string()
    .required('El nombre del modelo de candado es requerido'),

  resetInstructions: yup.string()
    .required('La instrucciones son requeridas.'),
});