import React, { createContext, useContext, useState } from 'react';

const SubDepartmentContext = createContext();

// hook personalizado para usar el contexto
export const useSubDepartments = () => {
  return useContext(SubDepartmentContext);
};

// Provider con la lógica y el estado
export const SubDepartmentProvider = ({ initialData, showNotification, children }) => {
  const [subDepartmentData, setSubDepartmentData] = useState(initialData);
  
    const toggleSubDepartmentStatus = (id) => {       
      setSubDepartmentData(prev =>
        prev.map(subDep => {
          if (subDep.id !== id) {
            return subDep;
          }
  
          let updatedSubDepartment = { ...subDep };

          // Aplicar el toggle
          const newStatus = !subDep.status;
          updatedSubDepartment.status = newStatus;
  
          return updatedSubDepartment;
      })
      );
      
      showNotification("Éxito", `Sub-departamento eliminado.`); // Esto será diferente una vez se migre a API
  };
  
  const contextValue = {
    subDepartmentData,
    toggleSubDepartmentStatus,
    setSubDepartmentData, 
  };

  return (
    <SubDepartmentContext.Provider value={contextValue}>
      {children}
    </SubDepartmentContext.Provider>
  );
};