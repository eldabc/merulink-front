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

  // ***   ***   ***   ***   ***   ***   ***
  // *** Crear Sub-departamento
  const createSubDepartment = async (formData) => {
    const departmentData =  getDepartmentNameById(formData.departmentId);

    const newSubDep = {
      id: Date.now(), // ID temporal
      code: formData.code,
      subDepartmentName: formData.subDepartmentName,
      departmentId: formData.departmentId,
      departmentCode: departmentData.code,
      departmentName: departmentData.departmentName,
      status: true
    };

    try {
      // Llamado a API
      // const response = await api.post('/subdepartments', newSubDep); 
      // const createdRecord = await response.json(); 

      setSubDepartmentData(prevData => { // Actualiza el estado centralizado
        return [newSubDep, ...prevData]; 
      });

      showNotification(`Sub-Departamento ${newSubDep.subDepartmentName} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el sub-departamento', 'error');
      return false;
    }
  };
  
  // ***   ***   ***   ***   ***   ***   ***
  // *** Actualizar Sub-departamento
  const updateSubDepartment = async (formData) => {
    const departmentData =  getDepartmentNameById(formData.departmentId);

    const finalData = {
        ...formData,
        departmentCode: departmentData.code, 
        departmentName: departmentData.departmentName, 
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

  // ***   ***   ***   ***   ***   ***   ***
  // *** Eliminar Sub-departamento
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
    setSubDepartmentData, 
    createSubDepartment,
    updateSubDepartment,
    toggleSubDepartmentStatus,
  };

  return (
    <SubDepartmentContext.Provider value={contextValue}>
      {children}
    </SubDepartmentContext.Provider>
  );
};