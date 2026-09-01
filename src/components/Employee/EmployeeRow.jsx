import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';

import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { formatCI } from '../../utils/text-utils';

import ChangeStatusModal from './modals/ChangeStatusModal';
import useChangeStatusModal from '../../hooks/useChangeStatusModal';
import SpanText from '../Shared/SpanText';
import HasPermission from '../Shared/HasPermission';
import AlertBadge from '../Shared/AlertBadge';


export default function EmployeeRow({ emp, rowClassName = '', chunk }) {

  const navigate = useNavigate();
  const { loadingChangeStatus } = useEmployees();
  const { isModalOpen, openChangeStatus, confirmChangeStatus, closeChangeStatus } = useChangeStatusModal();
  const hasScheduledDeactivate = emp?.latestPeriod?.scheduledDeactivateDate ? { 
    type: 'warning', 
    tooltip: 'Baja Programada para '+dayjs(emp?.latestPeriod?.scheduledDeactivateDate).format('DD/MM/YYYY'),
    label: 'BAJA'
  } : null;

  const handleSelectedEmployee = (id) => {
    navigate(`/empleados/ver/${id}`, { 
      state: { data: emp } 
    }); 
  };

  const subDepartmentName = emp?.subDepartment?.name ?? (
    <SpanText text="No Aplica" />
  );

  return (
    <>
    <tr
      key={emp.id}
      data-chunk={chunk}
      onClick={() => handleSelectedEmployee(emp.id)}
      className={`border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer ${rowClassName}`}
    >
      <td className="px-4 py-3 text-white-800 font-medium">{emp.numEmployee}</td>
      <td className="px-4 py-3 text-white-700">{formatCI(emp.ci)}</td>
      <td className="px-4 py-3 text-white-700">{emp.firstName}</td>
      <td className="px-4 py-3 text-white-700">{emp.lastName}</td>
      <td className="px-4 py-3 text-white-700">{emp.department.departmentName}</td>
      <td className="px-4 py-3 text-white-700">{subDepartmentName}</td>
      <td className="px-4 py-3 text-white-700">{emp.position.name}</td>
      <td className="px-4 py-3">
        <span className="relative inline-block">
          {hasScheduledDeactivate && <AlertBadge alert={hasScheduledDeactivate} dynamicClasses="-top-1" /> }
          <HasPermission permissions={["change-status-employees"]} fallback={<SpanText text={getStatusName(emp.status)} />}>
            <span 
              className={getStatusColor(emp.status)}
              onClick={(e) => {
                e.stopPropagation();
                openChangeStatus(emp);
              }}
            >
              {getStatusName(emp.status)}
            </span>
          </HasPermission>
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <ChangeStatusModal 
          isOpen={isModalOpen}
          onClose={closeChangeStatus}
          onConfirm={confirmChangeStatus}
          employee={emp}
          onLoadingChangeStatus={loadingChangeStatus}
        />
      </td>
    </tr>
    </>
  );
}