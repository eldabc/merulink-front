import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Eye, Palmtree,  Inbox } from 'lucide-react';

import { useAbsences } from '../../../context/AbsenceContext';
import { ABSENCE_TYPES, getAbsenceTypeLabel, canEditAbsence } from '../../../utils/Employees/absence-utils';

import AbsenceModal from '../modals/AbsenceModal';
import SpanText from '../../Shared/SpanText';
import LoadingSpinner from '../../Shared/LoadingSpinner';

/**
 * Pestaña de ausencias del empleado.
 *
 * Muestra el listado de ausencias (vacaciones / reposo médico) con un filtro
 * por tipo (radios) y permite:
 * - Registrar una ausencia nueva (modal en modo 'create').
 * - Ver/editar una ausencia: solo se puede editar si su fecha de inicio aún
 *   no ha llegado (start > hoy); de lo contrario es solo lectura ('view').
 */
export default function Absence({ employee, viewMode, disabledClasses }) {
  const { absences, loadingAbsence, loadAbsences } = useAbsences();

  const [filter, setFilter] = useState('vacation');
  const [modal, setModal] = useState({ isOpen: false, mode: 'create', absence: null });

  const hasEmployee = !!employee?.id;

  useEffect(() => {
    if (hasEmployee) loadAbsences(employee.id);
  }, [employee?.id]);

  const filtered = absences.filter((a) => a.type === filter);

  const openCreate = () => setModal({ isOpen: true, mode: 'create', absence: null });

  const openDetail = (absence) => {
    const editable = canEditAbsence(absence.start) && !viewMode;
    setModal({ isOpen: true, mode: editable ? 'edit' : 'view', absence });
  };

  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  const formatRange = (a) => `${dayjs(a.start).format('DD/MM/YYYY')} → ${dayjs(a.end).format('DD/MM/YYYY')}`;

  const getStatus = (a) => {
    const today = dayjs().startOf('day');
    const start = dayjs(a.start);
    const end = dayjs(a.end);
    if (start.isAfter(today, 'day')) return { label: 'Próxima', cls: 'text-[#9fd8ff] bg-[#00A4BC]/10 border-[#00A4BC]/30' };
    if (end.isBefore(today, 'day')) return { label: 'Finalizada', cls: 'text-gray-400 bg-gray-500/10 border-gray-500/30' };
    return { label: 'En curso', cls: 'text-amber-300 bg-amber-500/10 border-amber-500/30' };
  };

  return (
    <div className="space-y-4">
      <AbsenceModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        employee={employee}
        mode={modal.mode}
        absence={modal.absence}
        disabledClasses={disabledClasses}
      />

      <div className="bg-[#2f3235] border border-[#ffffff21] rounded-xl p-5 shadow-md">
        {/* Encabezado */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <Palmtree className="w-5 h-5 text-[#9fd8ff]" />
              Ausencias del empleado
            </h3>
          </div>

          <button
            hidden={true}
            type="button"
            onClick={openCreate}
            title="Registrar ausencia"
            disabled={!hasEmployee || viewMode}
            className={`flex items-center gap-2 text-sm font-medium ${disabledClasses}`}
          >
            <Plus className="w-4 h-4" />
            Registrar
          </button>
        </div>

        {/* Filtro por tipo (radios) */}
        <div className="flex gap-2 mb-4">
          {ABSENCE_TYPES.map((t) => (
            <label
              key={t.key}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium border transition-colors select-none ${
                filter === t.key
                  ? 'bg-[#00A4BC]/20 border-[#00A4BC] text-[#9fd8ff]'
                  : 'border-[#ffffff21] text-gray-400 hover:text-gray-200 hover:border-[#ffffff40]'
              }`}
            >
              <input
                type="radio"
                name="absence-filter"
                value={t.key}
                checked={filter === t.key}
                onChange={() => setFilter(t.key)}
                className="hidden"
              />
              {t.label}
            </label>
          ))}
        </div>

        {/* Contenido */}
        {!hasEmployee ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            Guarda primero el empleado para poder gestionar sus ausencias.
          </div>
        ) : loadingAbsence ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <LoadingSpinner className="py-0" />
            <SpanText text="Cargando ausencias" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2 text-gray-500">
            <Inbox className="w-8 h-8" />
            <SpanText text={`No hay registros de ${getAbsenceTypeLabel(filter).toLowerCase()}.`}/>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((a) => {
              const status = getStatus(a);
              const editable = canEditAbsence(a.start) && !viewMode;
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4 bg-[#252729] border border-[#ffffff21] rounded-lg p-4 hover:border-[#ffffff35] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 p-2.5 rounded-lg bg-[#3c4042]">
                      <Palmtree className="w-5 h-5 text-[#9fd8ff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-200">{getAbsenceTypeLabel(a.type)}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.cls}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formatRange(a)}</p>
                      {a.observations && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">{a.observations}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openDetail(a)}
                    title={editable ? 'Editar ausencia' : 'Ver detalle'}
                    aria-label={editable ? 'Editar ausencia' : 'Ver detalle'}
                    className={`skip-style-btn shrink-0 p-2 rounded-lg bg-[#3c4042] text-gray-300 hover:text-[#9fd8ff] transition-colors`}
                  >
                    {editable ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}