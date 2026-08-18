import { useEffect, useState } from 'react';
import { Palmtree, X, Loader2 } from 'lucide-react';

import { useAbsences } from '../../../context/AbsenceContext';
import { ABSENCE_TYPES } from '../../../utils/Employees/absence-utils';

import LabelFieldForm from '../../Shared/LabelFieldForm';
import ErrorMessage from '../../Shared/ErrorMessage';
import ButtonCancel from '../../Shared/ButtonCancel';

/**
 * Modal de ausencias con 3 modos:
 * - 'create': registra una ausencia nueva.
 * - 'edit':   edita una ausencia futura (start > hoy). Llamarlo solo si
 *             canEditAbsence(absence.start) es true.
 * - 'view':   solo lectura (ausencia ya comenzada o pasada): campos
 *             deshabilitados y solo botón cerrar.
 */
export default function AbsenceModal({ isOpen, onClose, employee, mode = 'create', absence = null, disabledClasses }) {
  const { createAbsence, updateAbsence, loadingAbsence } = useAbsences();

  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const [type, setType] = useState('vacation');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [observations, setObservations] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Inicializa los campos según el modo cada vez que se abre el modal
  useEffect(() => {
    if (!isOpen) return;

    if (isView || isEdit) {
      setType(absence?.type ?? 'vacation');
      setStart(absence?.start ?? '');
      setEnd(absence?.end ?? '');
      setObservations(absence?.observations ?? '');
    } else {
      setType('vacation');
      setStart('');
      setEnd('');
      setObservations('');
    }
    setFormErrors({});
  }, [isOpen, mode, absence]);

  if (!isOpen) return null;

  const clearError = (field) => setFormErrors((prev) => ({ ...prev, [field]: '' }));

  const handleSubmit = async () => {
    // Validación simple
    const newErrors = {};
    if (!type) newErrors.type = 'Debe seleccionar el tipo de ausencia.';
    if (!start) newErrors.start = 'Debe seleccionar la fecha de inicio.';
    if (!end) newErrors.end = 'Debe seleccionar la fecha de fin.';
    else if (start && end && end < start) newErrors.end = 'La fecha de fin no puede ser anterior a la de inicio.';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    setFormErrors({});

    const payload = {
      type,
      start,
      end,
      observations: observations || null,
      employee_id: employee?.id,
    };

    const success = isEdit
      ? await updateAbsence(absence.id, payload)
      : await createAbsence(payload);

    if (success) onClose();
  };

  const title = isEdit ? 'Editar Ausencia' : isView ? 'Detalle de la Ausencia' : 'Registrar Ausencia' ;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#2f3235] border border-[#ffffff21] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#ffffff15]">
          <div className="flex items-center gap-3">
            <Palmtree className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-400">
            {isView ? 'Información de la ausencia de' : 'Registre el periodo de ausencia de'}{' '}
            <span className="text-gray-200 font-medium">
              {employee?.firstName} {employee?.lastName}
            </span>
          </p>

          {/* Tipo de ausencia */}
          <div>
            <LabelFieldForm field="Tipo de Ausencia" simbol="*" dinamicClasses="text-sm! mb-1.5" />
            <select value={type} disabled={isView} onChange={(e) => { setType(e.target.value); clearError('type'); }} 
              className={`input-dark disabled:opacity-60 ${disabledClasses}`}>
              {ABSENCE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
            {formErrors.type && <ErrorMessage msg={formErrors.type} />}
          </div>

          {/* Fecha de inicio */}
          <div>
            <LabelFieldForm field="Fecha de Inicio" simbol="*" dinamicClasses="text-sm! mb-1.5" />
            <input type="date" value={start} disabled={isView} onChange={(e) => { setStart(e.target.value); clearError('start'); }} 
              className={`input-dark disabled:opacity-60 ${disabledClasses}`} />
            {formErrors.start && <ErrorMessage msg={formErrors.start} />}
          </div>

          {/* Fecha de fin */}
          <div>
            <LabelFieldForm field="Fecha de Fin" simbol="*" dinamicClasses="text-sm! mb-1.5" />
            <input type="date" value={end} disabled={isView} onChange={(e) => { setEnd(e.target.value); clearError('end'); }} 
              className={`input-dark disabled:opacity-60 ${disabledClasses}`} />
            {formErrors.end && <ErrorMessage msg={formErrors.end} />}
          </div>

          {/* Observaciones */}
          <div>
            <LabelFieldForm field="Observaciones" dinamicClasses="text-sm! mb-1.5" />
            <textarea
              value={observations}
              disabled={isView}
              onChange={(e) => { setObservations(e.target.value); clearError('observations'); }}
              rows={3}
              placeholder="Detalle adicional (opcional)..."
              className={`input-dark resize-y disabled:opacity-60 ${disabledClasses}`}
            />
            {formErrors.observations && <ErrorMessage msg={formErrors.observations} />}
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            {isView ? (
              <ButtonCancel onClose={onClose} text="Cerrar" />
            ) : (
              <>
                <ButtonCancel onClose={onClose} />
                <button type="button" onClick={handleSubmit} disabled={loadingAbsence}
                  className="flex-1 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {loadingAbsence ? <Loader2 className="w-4 h-4 animate-spin" /> : <Palmtree className="w-4 h-4" />}
                  {loadingAbsence ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
