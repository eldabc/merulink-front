import { createContext, useContext, useState } from 'react';
import { useNotification } from "../context/NotificationContext"; 

import { departments } from '../utils/StaticData/departments-utils.js';
import { employees } from '../utils/StaticData/employee-utils';
import { lockerAssigns } from '../utils/StaticData/locker-assign-utils.js';

const EmployeeContext = createContext();

// hook personalizado para usar el contexto
export const useEmployees = () => {
  return useContext(EmployeeContext);
};

// Provider con la lógica y el estado
export const EmployeeProvider = ({ children }) => {
    
  const [employeeData, setEmployeeData] = useState(employees);
  const { showNotification } = useNotification();

  const toggleEmployeeField = (id, field) => { 
    
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
            updatedEmployee.useLocker = false;
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
  // const categoryData = lockerCategories.find(ca => ca.key === formData.category);
    
    // return {
    //   id: formData.id ? formData.id : Date.now(),
    //   code: formData.category && formData.code ? `${formData.category}-${formData.code}` : null,
    //   category: {
    //     id: categoryData.id,
    //     key: categoryData.key,
    //     name: categoryData.value,
    //   },
    //   status: formData.status ? formData.status : null,
    // };
  }

  // *** Crear
  const createEmployee = async (formData) => {
    try {
      //Armado números de teléfono
      if (formData.mobilePhone) formData.mobilePhone = `${formData.mobilePhoneCode}-${formData.mobilePhone}`;

      if (formData.homePhone) formData.homePhone = `${formData.homePhoneCode}-${formData.homePhone}`; 

      console.log('data form:', formData);
      const newEmployee = { id: Date.now(), ...formData };
      // const newEmployee = formattedEmployees(formData);
      // console.log("Creado", newEmployee);; 

      setEmployeeData(prevData => [newEmployee, ...prevData]);
      showNotification(`Empleado ${newEmployee.firstName} ${newEmployee.lastName} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el Empleado', error.message);
      return false;
    }
  };

  const getDepartments = async () => {
    try {
         return departments;       
    } catch (error) {
      showNotification('Error al obtener Departamentos', error.message);
      return [];
    }
  }

    const getLockerAssigns = async () => {
    try {
         return lockerAssigns;       
    } catch (error) {
      showNotification('Error al obtener Asignaciones de Lockers', error.message);
      return [];
    }
  }
  
  const contextValue = {
    employeeData,
    setEmployeeData,
    toggleEmployeeField,
    createEmployee,
    getDepartments,
    getLockerAssigns
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};