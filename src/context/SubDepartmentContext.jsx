import React, { createContext, useContext, useState } from 'react';

const SubDepartmentContext = createContext();

// hook personalizado para usar el contexto
export const useSubDepartments = () => {
  return useContext(SubDepartmentContext);
};

// Provider con la lógica y el estado
export const SubDepartmentProvider = ({ initialData, showNotification, children }) => {
  const [subDepartmentData, setSubDepartmentData] = useState(initialData);
  
  // Se puede añadir más funciones (ojo)
  const contextValue = {
    subDepartmentData,
    // toggleSubDepartmentField,
    setSubDepartmentData, 
  };

  return (
    <SubDepartmentContext.Provider value={contextValue}>
      {children}
    </SubDepartmentContext.Provider>
  );
};