import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ButtonCancel from '../Shared/ButtonCancel';
import WarningChangeStatusEmployee from '../Shared/WarningChangeStatusEmployee';
import LabelFieldForm from '../Shared/LabelFieldForm';
import ErrorMessage from '../Shared/ErrorMessage';
import { STATUS_ACTIONS } from '../../utils/Employees/employee-utils';

const EGRESS_TYPES = [
  'Renuncia voluntaria',
  'Despido con justa causa',
  'Fin de contrato',
  'Jubilación',
];

/**
 * Modal para activar/desactivar (dar de baja) a un empleado.
 *
 * - action = 'deactivate': muestra el formulario de baja (tipo de egreso,
 *   fecha de efectividad y motivo) más el resumen de impacto.
 * - action = 'activate': muestra solo las advertencias de reactivación.
 *
 * onConfirm recibe { action, retireReason, effectiveDate, notes }.
 */
export default function ChangeStatusModal({ isOpen, onClose, onConfirm, employee }) {
  const [retireReason, setRetireReason] = useState('');
  const [effectiveDate, seteffectiveDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const action = employee?.status ? 'deactivate' : 'activate';
  const statusAction = STATUS_ACTIONS[action];
  const isDeactivate = action === 'deactivate';

  // Reiniciar el formulario cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setRetireReason('');
      seteffectiveDate(dayjs().format('YYYY-MM-DD'));
      setNotes('');
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!effectiveDate) {
      setFormErrors({ effectiveDate: 'Debe seleccionar la fecha de efectividad.' });
      return;
    }

    if (isDeactivate) {
      if (!retireReason) {
        setFormErrors({ retireReason: 'Debe seleccionar el tipo de egreso.' });
        return;
      }

      onConfirm({
        action,
        label: statusAction.label,
        actionLabel: statusAction.actionLabel,
        retireReason,
        effectiveDate,
        notes,
      });
    } else {
      onConfirm({ action, label: statusAction.label, actionLabel: statusAction.actionLabel, effectiveDate });
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#2f3d44] border border-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-full">
            <span className="text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {statusAction.title}
          </h3>
        </div>

        <p className="text-gray-400 text-sm mb-5 text-justify">
          ¿Está seguro que desea {isDeactivate ? 'dar de baja' : 'reactivar'} al empleado {employee?.firstName} {employee?.lastName}?
        </p>
        <div className="space-y-4 mb-5">
          {/* Fecha de Efectividad */}
            <div>
              <LabelFieldForm field={`${isDeactivate ? 'Fecha de Efectividad (último día laborado)' : 'Fecha de reactivación'}`} simbol="*" dinamicClasses="text-sm! mb-1.5" />
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => {
                  seteffectiveDate(e.target.value);
                  setFormErrors((prev) => ({ ...prev, effectiveDate: '' }));
                }}
                className="input-dark"
              />
              {formErrors.effectiveDate && <ErrorMessage msg={formErrors.effectiveDate} />}
            </div>
          {isDeactivate ? (
            <>
              {/* Tipo de Egreso */}
              <div>
                <LabelFieldForm field="Tipo de Egreso" simbol="*" dinamicClasses="text-sm! mb-1.5" />
                <select
                  value={retireReason}
                  onChange={(e) => {
                    setRetireReason(e.target.value);
                    setFormErrors((prev) => ({ ...prev, retireReason: '' }));
                  }}
                  className="input-dark"
                >
                  <option value="">Seleccionar...</option>
                  {EGRESS_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {formErrors.retireReason && <ErrorMessage msg={formErrors.retireReason} />}
              </div>

              {/* Motivo / Observaciones */}
              <div>
                <LabelFieldForm field="Motivo / Observaciones" dinamicClasses="text-sm! mb-1.5" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Explicación detallada para el expediente de RRHH..."
                  className="input-dark resize-y"
                />
              </div>
            </>
          ) : (  
            <div></div>
          )}      
          {/* Resumen de Impacto */}
          <WarningChangeStatusEmployee toggleStatusChangeList={action} effectiveDate={effectiveDate} />
        </div>
        <div className="flex justify-end gap-3">
          <ButtonCancel onClose={onClose} />

          <button
            type="button"
            onClick={handleConfirm}
            className={`skip-style-btn rounded-lg p-2 text-white font-medium
              ${isDeactivate 
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-600 hover:bg-emerald-700'}
            `}
          >
            {statusAction.btnText}
          </button>
        </div>
      </div>
    </div>
  );
}
