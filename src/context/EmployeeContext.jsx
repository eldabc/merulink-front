import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotification } from "../context/NotificationContext"; 
import { useGlobalData } from './GlobalDataContext';

import { mapEmployeeToBackend } from '../utils/mappers/employeeMapper';
import { mapChangeStatusToBackend } from '../utils/mappers/changeStatusEmployeeMapper';
import { fieldLabels } from '../utils/Employees/employee-utils';

const EmployeeContext = createContext();

export const useEmployees = () => {
  return useContext(EmployeeContext);
};

// Provider con la lógica y el estado
export const EmployeeProvider = ({ children }) => {
    
  const [employeeData, setEmployeeData] = useState([]);
  const { showNotification } = useNotification();
  const { departments, loadDepartments } = useGlobalData();
  const [loadingEmployeeData, setLoadingEmployeeData] = useState(false);
  const [loadingFieldChange, setLoadingFieldChange] = useState({ loading: false, field: null });
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

  const loadEmployees = useCallback(async () => {
      setLoadingEmployeeData(true);
    try {
      
      loadDepartments();
      const response = await axios.get(`${ENV.API_BACK_URL}employees`);
      setEmployeeData(response.data.data);

    } catch (err) {
      showNotification('Error al cargar datos', err.message, 'error');
    } finally {
      setLoadingEmployeeData(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Actualizar campos checkboxs sin entrar en modo edit
  const toggleEmployeeField = async (employee, field) => { 
    setLoadingFieldChange({ loading: true, field: field });
    try {
      console.log("Checkbox", employee, field);
      if (!employee.id || !field) return; 

      const readableField = fieldLabels[field] || field;
      const response = await axios.put(`${ENV.API_BACK_URL}employees/${employee.id}/changeBooleanField?field=${field}`, employee);

      setEmployeeData(prevData => {
        const filteredData = prevData.filter(emp => emp.id !== employee.id);
        return [response.data.data, ...filteredData];
      });

      showNotification("Éxito", `${readableField} actualizado.`);  

     } catch (error) {
      showNotification('Error al actualizar Empleado', error.response?.data?.message, 'error');
      return false;
    } finally {
      setLoadingFieldChange({ loading: false, field: null });
    }
  };


  const changeStatus = async (employee, data = {}) => { 
    setLoadingChangeStatus(true);
    try {
      console.log("ChangeStatus", employee, data);
      if (!employee.id || !data) return; 

      const payload = mapChangeStatusToBackend(data);
      const response = await axios.put(`${ENV.API_BACK_URL}employees/${employee.id}/changeStatus`, payload);

      setEmployeeData(prevData => {
        const filteredData = prevData.filter(emp => emp.id !== employee.id);
        return [response.data.data, ...filteredData];
      });

      showNotification("Éxito", `Empleado ${employee.firstName} ${employee.lastName} ${data.actionLabel}.`);  

     } catch (error) {
      showNotification('Error al cambiar el estado del Empleado', error.response?.data?.message, 'error');
      return false;
    } finally {
      setLoadingChangeStatus(false);
    }
  };

  // Resetear contraseña de un empleado
  const toggleResetPass = async (employee) => {
    try {
      if (!employee) return;

      const response = await axios.put(
        `${ENV.API_BACK_URL}employees/${employee.id}/resetPass`
      );

      const { message, data } = response.data;

      if (data) {
        setEmployeeData(prevData => {
          const filteredData = prevData.filter(emp => emp.id !== employee.id);
          return [data, ...filteredData];
        });
      }
      showNotification('Contraseña restablecida', message, 'success');

    } catch (error) {
      showNotification('Error al resetear la contraseña', error.response?.data?.message, 'error');
    }
  };


  // *** Crear
  const createEmployee = async (formData) => {
    try {
      // Armado JSON
      const newEmployee = mapEmployeeToBackend(formData);
      console.log("Creado", newEmployee);
      
      const response = await axios.post(`${ENV.API_BACK_URL}employees`, newEmployee);
      const newEmpResponse = response.data.data;
      setEmployeeData(prevData => {
        return [newEmpResponse, ...prevData]; 
      });

      showNotification(`Empleado ${newEmpResponse.firstName} ${newEmpResponse.lastName} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el Empleado', error.response?.data?.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updateEmployee = async (formData) => {
    try {
      const employeeId = formData.id;

      if (!employeeId) {
        showNotification('Error:', 'No se encontró el ID del Empleado', 'error');
        return false;
      }

      const updatedEmployee = mapEmployeeToBackend(formData);
      console.log("Actualizado:", updatedEmployee);
      
      const response = await axios.put(`${ENV.API_BACK_URL}employees/${employeeId}`, updatedEmployee);
      const editEmpResponse = response.data.data;
      
      setEmployeeData(prevData => {
        const filteredData = prevData.filter(employee => employee.id !== employeeId);
        return [editEmpResponse, ...filteredData];
      });

      showNotification(`Empleado ${editEmpResponse.firstName} ${editEmpResponse.lastName} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar:', error.response?.data?.message, 'error');
      return false;
    }
  };

  const getDepartments = async () => {
    try {
        return departments;
    } catch (error) {
      showNotification('Error al obtener Departamentos', error.message, 'error');
      return [];
    }
  }

    const getLockerAssigns = async () => {
    try {
      const response = await axios.get(`${ENV.API_BACK_URL}assigns?unassigned=true`);
      return response.data.data;
    } catch (error) {
      showNotification('Error al obtener Asignaciones de Lockers', error.message, 'error');
      return [];
    }
  }
  
  const contextValue = {
    loadEmployees,
    loadingFieldChange,
    loadingChangeStatus,
    loadingEmployeeData,
    setLoadingEmployeeData,
    employeeData,
    setEmployeeData,
    toggleEmployeeField,
    changeStatus,
    toggleResetPass,
    createEmployee,
    updateEmployee,
    getDepartments,
    getLockerAssigns
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};