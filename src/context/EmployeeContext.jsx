// EmployeeContext.jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Crear el Contexto
const EmployeeContext = createContext();

// 2. Crear la función del hook personalizado para usar el contexto
export const useEmployees = () => {
  return useContext(EmployeeContext);
};

// 3. Crear el Proveedor (que contendrá la lógica y el estado)
export const EmployeeProvider = ({ initialData, showNotification, children }) => {
  const [employeeData, setEmployeeData] = useState(initialData);
  // La función toggleEmployeeField, centralizada aquí
  const toggleEmployeeField = (id, field) => {
    setEmployeeData(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, [field]: !emp[field] } : emp
      )
    );
    // Notificación se ejecuta aquí, donde tienes acceso a showNotification
    if (showNotification && typeof showNotification === 'function') {
      showNotification("Éxito", `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado.`);
    }
  };
  
  // Puedes añadir más funciones (ej: addEmployee, updateEmployee, deleteEmployee)
  const contextValue = {
    employeeData,
    toggleEmployeeField,
    // Si necesitas setEmployeeData directamente:
    setEmployeeData, 
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};