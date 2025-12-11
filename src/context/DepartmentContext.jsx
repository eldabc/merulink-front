import React, { createContext, useContext, useState } from 'react';

const DepartmentContext = createContext();

// hook personalizado para usar el contexto
export const useDepartments = () => {
  return useContext(DepartmentContext);
};

// Provider con la lógica y el estado
export const DepartmentProvider = ({ initialData, showNotification, children }) => {
    
  const [departmentData, setDepartmentData] = useState(initialData);

//   const toggleDepartmentField = (id, field) => {       
//     setDepartmentData(prev =>
//       prev.map(dep => {
//         if (dep.id !== id) {
//           return dep;
//         }

//         let updatedDepartment = { ...dep };

//         if (field === 'status') {
            
//           // Aplicar el toggle
//           const newStatus = !dep.status;
//           updatedDepartment.status = newStatus;
          
//           if (newStatus === false) {
//             updatedDepartment.useMeruLink = false;
//             updatedDepartment.useLocker = false;
//             updatedDepartment.useHidCard = false;
//             updatedDepartment.useTransport = false;
//           }
            
//         } else {
//           updatedDepartment[field] = !dep[field];
//         }

//         return updatedDepartment;
//     })
//     );
    
//     showNotification("Éxito", `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado.`);
// };
  
  // Se puede añadir más funciones (ojo)
  const contextValue = {
    departmentData,
    // toggleDepartmentField,
    setDepartmentData, 
  };

  return (
    <DepartmentContext.Provider value={contextValue}>
      {children}
    </DepartmentContext.Provider>
  );
};