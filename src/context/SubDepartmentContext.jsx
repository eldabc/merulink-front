import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDepartmentNameById } from '../utils/Departments/departments-utils';
import { useNotification } from "../context/NotificationContext";

const SubDepartmentContext = createContext();

// hook personalizado para usar el contexto
export const useSubDepartments = () => {
  return useContext(SubDepartmentContext);
};

// Provider con la lógica y el estado
export const SubDepartmentProvider = ({ children }) => {

  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  
  const loadSubDepartments = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}subdepartments`);
      console.log("response.data.data", response.data.data);
      setSubDepartmentData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar Subdepartamentos', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect SubDepartmentContext');
    loadSubDepartments();
  }, [loadSubDepartments]);


  const formattedSubDepartment = (formData) => {
    const departmentData =  getDepartmentNameById(formData.departmentId);

    return {
      id: formData.id ? formData.id : Date.now(),
      code: formData.code,
      name: formData.name,
      department: { 
        id: formData.departmentId, 
        departmentCode: departmentData.code,
        departmentName: departmentData.departmentName
      },
      
    };
  };

  // *** Crear
  const createSubDepartment = async (formData) => {

    try {
      const newSubDep = formattedSubDepartment(formData);
      console.log("Creado", newSubDep);
      const response = await axios.post(`${ENV.API_BACK_URL}subdepartments`, newSubDep);

      setSubDepartmentData(prevData => {
        return [response.data.data, ...prevData]; 
      });

      showNotification(`Sub-Departamento ${newSubDep.name} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el sub-departamento', error.response.data.message, 'error');
      return false;
    }
  };
  

  // *** Actualizar
  const updateSubDepartment = async (formData) => {
    const departmentData =  getDepartmentNameById(formData.departmentId);

    const finalData = {
        ...formData,
        departmentCode: departmentData.code, 
        departmentName: departmentData.departmentName, 
    };
    
    try { 
        
        setSubDepartmentData(prevData => {
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

  // *** Eliminar
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
    loading,
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