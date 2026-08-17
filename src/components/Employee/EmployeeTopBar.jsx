import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Palmtree } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';

import { getStatusColor, getStatusName } from '../../utils/status-utils';  

import ChangeStatusModal from './ChangeStatusModal';
import AbsenceModal from './modals/AbsenceModal';

function EmployeeTopBar({ createMode, editMode, viewMode, setShowScraperModal, setScraperKey, employee, loadingChangeStatus  }) {
  const { user } = useAuth();
  const { changeStatus } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAbsenceOpen, setIsAbsenceOpen] = useState(false);
  

  const canChangeStatus = user?.permissions?.includes('change-status-employees');

  const handleChangeStatusClick = (employee) => {
    setIsModalOpen(true);
    setSelectedEmployee(employee);
  };

  const handleConfirmChangeStatus = async (data) => {
    if (!selectedEmployee) return;

    await changeStatus(selectedEmployee, data);

    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="w-full md:w-auto flex flex-wrap justify-center md:justify-end items-center gap-3 mt-3 md:mt-0 border-b border-[#ffffff21] pb-3">
      {createMode && (
        <Link
          onClick={ (e) => { setShowScraperModal(true); setScraperKey(k => k + 1); }}
          className="flex items-center gap-1 text-sm !text-[#9fd8ff] hover:!text-white transition-colors font-medium mr-5"
        >
          <Search className="w-4 h-4 text-[#9fd8ff]" /> Traer Datos
        </Link>
      )}
      
      {(editMode || viewMode) && (
        <>     
          <div className="flex flex-col items-end gap-2 bg-[#50575b87] border border-[#ffffff21] rounded-lg p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAbsenceOpen(true);
                }}
                title="Registrar ausencia"
                aria-label="Registrar ausencia"
                className="skip-style-btn flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <Palmtree className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 bg-[#50575b87] border border-[#ffffff21] rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Estatus:</span>
              {loadingChangeStatus.loading ? (
                <SpanText />
              ) : (

                <span
                  className={`status-tag ${getStatusColor(employee?.status)}`}
                  onClick={canChangeStatus && !employee?.scheduledDeactivation ? (e) => {
                    e.stopPropagation();
                    handleChangeStatusClick(employee);
                  } : undefined}
                >
                  {getStatusName(employee?.status)}
                </span>
              )}
            </div>

            {!loadingChangeStatus.loading && employee?.status === false ? (
              <span className="group relative text-xs font-medium text-red-300 bg-red-500/15 border border-red-500/30 rounded-md px-2.5 py-1 text-center whitespace-nowrap cursor-help">
                Razón: {employee?.latestPeriod?.retireReason} desde {dayjs(employee?.latestPeriod?.retireDate).format('DD/MM/YYYY')}
                {employee?.latestPeriod?.retireNote && (
                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 hidden group-hover:block max-w-xs whitespace-normal text-left custom-grid-tooltip-container border border-gray-700 shadow-lg">
                    <div className="tooltip-title">Detalles</div>
                    <div className="tooltip-item">- {employee?.latestPeriod?.retireNote}</div>
                  </div>
                )}
              </span>
            ) : (

              employee?.scheduledDeactivation && (
                <span className="group relative text-xs font-medium text-yellow-300 bg-yellow-500/15 border border-yellow-500/30 rounded-md px-2.5 py-1 text-center whitespace-nowrap cursor-help">
                  Desactivación programada: {dayjs(employee?.latestPeriod?.scheduledDeactivateDate).format('DD/MM/YYYY')}
                </span>
              )

            )}
            
          </div>

          <ChangeStatusModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEmployee(null);
            }}
            onConfirm={handleConfirmChangeStatus}
            employee={employee}
          />

          <AbsenceModal
            isOpen={isAbsenceOpen}
            onClose={() => setIsAbsenceOpen(false)}
            employee={employee}
          />
        </>
      )}
    </div>
  );
}

export default EmployeeTopBar;