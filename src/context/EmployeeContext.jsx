import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

// hook personalizado para usar el contexto
export const useEmployees = () => {
  return useContext(EmployeeContext);
};

// Provider con la lógica y el estado
export const EmployeeProvider = ({ initialData, showNotification, children }) => {
    
    const [employeeData, setEmployeeData] = useState(initialData);

    const toggleEmployeeField = (id, field) => {       
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