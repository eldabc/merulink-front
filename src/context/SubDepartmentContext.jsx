import React, { createContext, useContext, useState } from 'react';
import { getDepartmentNameById } from '../utils/Departments/departments-utils';

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

  // Actualizar Sub-departamento
  const updateSubDepartment = async (formData) => {

    const departmentName = getDepartmentNameById(formData.departmentId);
    const finalData = {
        ...formData,
        departmentName: departmentName 
    };
    
    try {
        // Llamada a la API/Backend (onUpdate)
        // await api.put(`/subdepartments/${finalData.id}`, finalData); 
        
        setSubDepartmentData(prevData => { // Actualiza el estado centralizado
          return prevData.map(subDep => 
            subDep.id === finalData.id ? finalData : subDep 
          );
        });

        showNotification('Sub-Departamento actualizado con éxito'); 
        return true;

    } catch (error) {
        showNotification('Error al actualizar', 'error');
        return false;
    }
  };
  
  const contextValue = {
    subDepartmentData,
    updateSubDepartment,
    toggleSubDepartmentStatus,
    setSubDepartmentData, 
  };

  return (
    <SubDepartmentContext.Provider value={contextValue}>
      {children}
    </SubDepartmentContext.Provider>
  );
};