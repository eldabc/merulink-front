import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

// hook personalizado para usar el contexto
export const useEmployees = () => {
  return useContext(EmployeeContext);
};

// Proveedor con la lógica y el estado)
export const EmployeeProvider = ({ initialData, showNotification, children }) => {
  const [employeeData, setEmployeeData] = useState(initialData);

  const toggleEmployeeField = (id, field) => {
    setEmployeeData(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, [field]: !emp[field] } : emp
      )
    );

    if (showNotification && typeof showNotification === 'function') {
      showNotification("Éxito", `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado.`);
    }
  };
  
  // Se puede añadir más funciones (ojo)
  const contextValue = {
    employeeData,
    toggleEmployeeField,
    setEmployeeData, 
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};