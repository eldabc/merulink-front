import * as yup from 'yup';

/** Tipos de ausencia disponibles para el selector del modal. */
export const ABSENCE_TYPES = [
  { key: 'vacation', label: 'Vacaciones' },
  { key: 'medical_leave', label: 'Reposo médico' },
];

/**
 * Esquema de validación del modal de ausencias.
 *
 * - type: obligatorio (vacation | medical_leave)
 * - start: obligatorio (fecha de inicio de la ausencia)
 * - end: obligatorio (fecha de fin), no puede ser anterior a start
 * - observations: opcional (motivo/observaciones)
 */
export const absenceValidationSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(ABSENCE_TYPES.map((t) => t.key), 'Tipo de ausencia inválido')
    .required('Debe seleccionar el tipo de ausencia'),

  start: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('La fecha de inicio es obligatoria'),

  end: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('La fecha de fin es obligatoria')
    .min(yup.ref('start'), 'La fecha de fin no puede ser anterior a la de inicio'),

  observations: yup
    .string()
    .nullable()
    .optional(),
});

/**
 * Valida los valores de una ausencia usando el schema yup.
 *
 * Pensado para usarse fuera de react-hook-form (modal con handle):
 * devuelve { isValid, errors } donde errors mapea campo -> mensaje.
 *
 * @param {Object} values { type, start, end, observations }
 * @returns {Promise<{ isValid: boolean, errors: Object<string,string> }>}
 */
export const validateAbsence = async (values) => {
  try {
    await absenceValidationSchema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    if (err?.name === 'ValidationError' && err?.inner) {
      const errors = {};
      err.inner.forEach((e) => {
        if (e.path && !errors[e.path]) errors[e.path] = e.message;
      });
      return { isValid: false, errors };
    }
    throw err;
  }
};
