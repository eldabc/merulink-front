import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotification } from "../context/NotificationContext"; 
import { useGlobalData } from './GlobalDataContext';

import { lockerAssigns } from '../utils/StaticData/locker-assign-utils.js';

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

  const loadEmployees = useCallback(async () => {
      setLoadingEmployeeData(true);
    try {
      
      loadDepartments();
      const response = await axios.get(`${ENV.API_BACK_URL}employees`);
      setEmployeeData(response.data.data);
      // console.log("data", response.data.data)

    } catch (err) {
      showNotification('Error al cargar datos', err.message, 'error');
    } finally {
      setLoadingEmployeeData(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect EmployeeContext');
    loadEmployees();
  }, [loadEmployees]);

  // Actualizar campos checkboxs sin entrar en modo edit
  const toggleEmployeeField = (id, field) => { 
    console.log("Checkbox", id, field);
    if (!id || !field) return; 
    
    setEmployeeData(prev =>
      prev.map(emp => {
        if (emp.id !== id) {
          return emp;
        }

        let updatedEmployee = { ...emp };

        if (field === 'status') {
            
          // Aplicar el toggle
          const newStatus = !emp.status;
          updatedEmployee.status = newStatus;
          
          if (newStatus === false) {
            updatedEmployee.useMeruLink = false;
            updatedEmployee.userName = '';
            updatedEmployee.userPass = '';
            updatedEmployee.useLocker = false;
            updatedEmployee.assign = null;
            updatedEmployee.useHidCard = false;
            updatedEmployee.useTransport = false;
          }
            
        } else {
          updatedEmployee[field] = !emp[field];
        }
        return updatedEmployee;
      })
    );
    showNotification("Éxito", `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado.`);    
  };

  // Armado JSON
  const formattedEmployees = (formData) => {
    const assignData = lockerAssigns.find(assign => String(assign.id) === String(formData.lockerAssingId));
    
    return {
      ...formData,
      id: formData.id ? formData.id : Date.now(),
      mobilePhone: formData.mobilePhone ? `${formData.mobilePhoneCode}-${formData.mobilePhone}` : null,
      homePhone: formData.homePhone ? `${formData.homePhoneCode}-${formData.homePhone}` : null,
      assign: {
        ...assignData
      },
    };
  }

  // *** Crear
  const createEmployee = async (formData) => {
    try {
      //Armado números de teléfono
      // if (formData.mobilePhone) formData.mobilePhone = `${formData.mobilePhoneCode}-${formData.mobilePhone}`;

      // if (formData.homePhone) formData.homePhone = `${formData.homePhoneCode}-${formData.homePhone}`; 

      // console.log('data form:', formData);
      // const newEmployee = { id: Date.now(), ...formData };
      const newEmployee = formattedEmployees(formData);
      console.log("Creado", newEmployee);; 

      setEmployeeData(prevData => [newEmployee, ...prevData]);
      showNotification(`Empleado ${newEmployee.firstName} ${newEmployee.lastName} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el Empleado', error.message);
      return false;
    }
  };

  // *** Actualizar
  const updateEmployee = async (formData) => {
    try {
      const employeeId = formData.id;

      if (!employeeId) {
        showNotification('Error: No se encontró el ID del Empleado', 'error');
        return false;
      }

      const updatedEmployee = formattedEmployees(formData);
      console.log("Actualizado:", updatedEmployee);
      
      setEmployeeData(prevData => {
        return prevData.map(emp => 
          emp.id === employeeId ? updatedEmployee : emp 
        );
      });

      showNotification(`Empleado ${updatedEmployee.firstName} ${updatedEmployee.lastName} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar: ' + error.message, 'error');
      return false;
    }
  };

  const getDepartments = async () => {
    try {
        console.log("departments", departments)
        return departments;
    } catch (error) {
      showNotification('Error al obtener Departamentos', error.message, 'error');
      return [];
    }
  }

    const getLockerAssigns = async () => {
    try {
      // return lockerAssigns.filter(assign => !assign.employee);
      const response = await axios.get(`${ENV.API_BACK_URL}assigns?unassigned=true`);
      return response.data.data;
    } catch (error) {
      showNotification('Error al obtener Asignaciones de Lockers', error.message, 'error');
      return [];
    }
  }
  
  const contextValue = {
    loadEmployees,
    loadingEmployeeData,
    setLoadingEmployeeData,
    employeeData,
    setEmployeeData,
    toggleEmployeeField,
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