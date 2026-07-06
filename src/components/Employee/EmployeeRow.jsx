import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import { getStatusColor, getStatusName } from '../../utils/status-utils';
import ConfirmDialog  from '../Shared/ConfirmDialog';
import SpanText from '../Shared/SpanText';
import HasPermission from '../Shared/HasPermission';

export default function EmployeeRow({ emp }) {

  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusChangeLabel, setStatusChangeLabel] = useState('');
  const { toggleEmployeeField } = useEmployees(); 
  
  const handleSelectedEmployee = (id) => {
    navigate(`/empleados/ver/${id}`, { 
      state: { data: emp } 
    }); 
  };

  const subDepartmentName = emp?.subDepartment?.name ?? (
    <SpanText text="No Aplica" />
  );

  const handleChangeStatusClick = (employee) => {
    const statusChangeLabel = employee?.status ? 'Desactivar' : 'Activar';
    setStatusChangeLabel(statusChangeLabel);

    setIsModalOpen(true);
    setSelectedEmployee(employee);
  };

  const handleConfirmChangeStatus = async () => {
    if (!selectedEmployee) return;

    await toggleEmployeeField(selectedEmployee, 'status');
  };

  return (
    <>
    <tr
      key={emp.id}
      onClick={() => handleSelectedEmployee(emp.id)}
      className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
    >
      <td className="px-4 py-3 text-white-800 font-medium">{emp.numEmployee}</td>
      <td className="px-4 py-3 text-white-700">{emp.ci}</td>
      <td className="px-4 py-3 text-white-700">{emp.firstName}</td>
      <td className="px-4 py-3 text-white-700">{emp.lastName}</td>
      <td className="px-4 py-3 text-white-700">{emp.department.departmentName}</td>
      <td className="px-4 py-3 text-white-700">{subDepartmentName}</td>
      <td className="px-4 py-3 text-white-700">{emp.position.name}</td>
      <td className="px-4 py-3">
        <HasPermission permissions={["change-status-employees"]} fallback={<SpanText text={getStatusName(emp.status)} />}>
          <span 
            className={getStatusColor(emp.status)}
            onClick={(e) => {
              e.stopPropagation();
              handleChangeStatusClick(emp);
            }}
          >
            {getStatusName(emp.status)}
          </span>
        </HasPermission>
      </td>
    </tr>
    <tr>
      <td>
        <ConfirmDialog 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
          onConfirm={handleConfirmChangeStatus}
          title={`${statusChangeLabel} Empleado`}
          message={`¿Está seguro que desea ${statusChangeLabel} al Empleado "${emp?.firstName} ${emp?.lastName}"?`}
          btnText={`${statusChangeLabel} ahora`}
          warningMessage={true}
          toggleStatusChangeList={statusChangeLabel === 'Activar' ? 'activate' : 'deactivate'}
        />
      </td>
    </tr>
    </>
  );
}