import { useEffect, useState } from 'react';
import { Palmtree, X, Loader2 } from 'lucide-react';

import { useAbsences } from '../../../context/AbsenceContext';
import { ABSENCE_TYPES, validateAbsence } from '../../../utils/Validations/absenceValidationSchema';

import LabelFieldForm from '../../Shared/LabelFieldForm';
import ErrorMessage from '../../Shared/ErrorMessage';

/**
 * Modal para registrar ausencias de un empleado (vacaciones / reposo médico).
 *
 * Campos:
 * - type: obligatorio, por defecto 'vacation'
 * - start: obligatorio (fecha de inicio)
 * - end: obligatorio (fecha de fin)
 * - observations: opcional
 *
 */
export default function AbsenceModal({ isOpen, onClose, employee }) {
  const { createAbsence, loadingAbsence } = useAbsences();

  const [type, setType] = useState('vacation');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [observations, setObservations] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Reiniciar el formulario cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setType('vacation');
      setStart('');
      setEnd('');
      setObservations('');
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const clearError = (field) => setFormErrors((prev) => ({ ...prev, [field]: '' }));

  const handleRegister = async () => {
    const values = { type, start, end, observations };

    // Validación con yup migrada a método
    const { isValid, errors: validationErrors } = await validateAbsence(values);
    if (!isValid) {
      setFormErrors(validationErrors);
      return;
    }
    setFormErrors({});

    const success = await createAbsence({
      type,
      start,
      end,
      observations: observations || null,
      employee_id: employee?.id,
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#2f3235] border border-[#ffffff21] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#ffffff15]">
          <div className="flex items-center gap-3">
            <Palmtree className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-100">Registrar Ausencia</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-400">
            Registre el periodo de ausencia de{' '}
            <span className="text-gray-200 font-medium">
              {employee?.firstName} {employee?.lastName}
            </span>
          </p>

          {/* Tipo de ausencia */}
          <div>
            <LabelFieldForm field="Tipo de Ausencia" simbol="*" dinamicClasses="text-sm! mb-1.5" />
            <select value={type} onChange={(e) => { setType(e.target.value); clearError('type'); }} className="input-dark">
              {ABSENCE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
            {formErrors.type && <ErrorMessage msg={formErrors.type} />}
          </div>

          {/* Fecha de inicio */}
          <div>
            <LabelFieldForm field="Fecha de Inicio" simbol="*" dinamicClasses="text-sm! mb-1.5" />
            <input type="date" value={start} onChange={(e) => { setStart(e.target.value); clearError('start'); }} className="input-dark" />
            {formErrors.start && <ErrorMessage msg={formErrors.start} />}
          </div>

          {/* Fecha de fin */}
          <div>
            <LabelFieldForm field="Fecha de Fin" simbol="*" dinamicClasses="text-sm! mb-1.5" />
            <input type="date" value={end} onChange={(e) => { setEnd(e.target.value); clearError('end'); }} className="input-dark" />
            {formErrors.end && <ErrorMessage msg={formErrors.end} />}
          </div>

          {/* Observaciones */}
          <div>
            <LabelFieldForm field="Observaciones" dinamicClasses="text-sm! mb-1.5" />
            <textarea
              value={observations}
              onChange={(e) => { setObservations(e.target.value); clearError('observations'); }}
              rows={3}
              placeholder="Detalle adicional (opcional)..."
              className="input-dark resize-y"
            />
            {formErrors.observations && <ErrorMessage msg={formErrors.observations} />}
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loadingAbsence}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg">
              Cancelar
            </button>
            <button type="button" onClick={handleRegister} disabled={loadingAbsence}
              className="flex-1 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {loadingAbsence ? <Loader2 className="w-4 h-4 animate-spin" /> : <Palmtree className="w-4 h-4" />}
              {loadingAbsence ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
