import dayjs from 'dayjs';

/** Tipos de ausencia disponibles en la app. */
export const ABSENCE_TYPES = [
  { key: 'vacation', label: 'Vacaciones' },
  { key: 'medical_leave', label: 'Permiso/Reposo' },
];

/** Devuelve el label legible de un tipo de ausencia. */
export const getAbsenceTypeLabel = (key) =>
  ABSENCE_TYPES.find((t) => t.key === key)?.label ?? key;

/**
 * Una ausencia solo puede editarse si su fecha de inicio aún no ha llegado
 * (start > hoy). Si ya estamos en la fecha de inicio o pasó, es solo lectura.
 */
export const canEditAbsence = (start) =>
  dayjs(start).isAfter(dayjs().startOf('day'), 'day');
