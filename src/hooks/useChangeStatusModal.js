import { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';

/**
 * Hook reutilizable para el modal de cambio de estatus del empleado
 * (dar de baja / reactivar).
 *
 * Centraliza el estado del modal y sus handlers
 *
 * @returns {{
 *   isModalOpen: boolean,
 *   openChangeStatus: (employee: object) => void,
 *   confirmChangeStatus: (data: object) => Promise<void>,
 *   closeChangeStatus: () => void,
 * }}
 */
export default function useChangeStatusModal() {
    
  const { changeStatus } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const openChangeStatus = (employee) => {
    setIsModalOpen(true);
    setSelectedEmployee(employee);
  };

  const confirmChangeStatus = async (data) => {
    if (!selectedEmployee) return;

    await changeStatus(selectedEmployee, data);

    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const closeChangeStatus = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return {
    isModalOpen,
    openChangeStatus,
    confirmChangeStatus,
    closeChangeStatus,
  };
}
