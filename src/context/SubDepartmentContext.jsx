import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { getDepartmentNameById } from '../utils/Departments/departments-utils';
import { useGlobalData } from './GlobalDataContext';
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
  const { updateDepartmentInState } = useGlobalData();
  
  const loadSubDepartments = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}subdepartments`);
      setSubDepartmentData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar Subdepartamentos', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubDepartments();
  }, [loadSubDepartments]);


  const formattedSubDepartment = (formData) => {
    // const departmentData =  getDepartmentNameById(formData.departmentId);
    
    return {
      id: formData.id ? formData.id : Date.now(),
      code: formData.code,
      name: formData.name,
      department: { 
        id: formData.departmentId, 
        // departmentCode: departmentData.code,
        // departmentName: departmentData.departmentName
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
        console.log("response.data.dataSUB", response.data.data);
        updateDepartmentInState(response.data.data);
      showNotification(`Sub-Departamento ${newSubDep.name} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el sub-departamento', error.response.data.message, 'error');
      return false;
    }
  };
  

  // *** Actualizar
  const updateSubDepartment = async (formData) => {
    try { 
      const subDepartmentId = formData.id;

      if (!subDepartmentId) {
        showNotification('No se encontró el ID del Subdepartamento', error.response.data.message, 'error');
        return false;
      }
  
      const updateSubDep = formattedSubDepartment(formData);
      console.log("Actualizado:", updateSubDep);
      
      const response = await axios.put(`${ENV.API_BACK_URL}subdepartments/${subDepartmentId}`, updateSubDep);
        
        setSubDepartmentData(prevData => {
          const filteredData = prevData.filter(subDepartment => subDepartment.id !== subDepartmentId);
          return [response.data.data, ...filteredData];
        });
        console.log("response.data.dataSUB", response.data.data);
        updateDepartmentInState(response.data.data);
        showNotification(`Sub-Departamento ${updateSubDep.name} actualizado con éxito`); 
        return true;

    } catch (error) {
        showNotification('Error al actualizar', error.response.data.message, 'error');
        return false;
    }
  };

  // *** Eliminar
  const deleteSubDepartment = async (subDepartment) => {
  try {
    const subDepartmentId = subDepartment.id

      if (!subDepartmentId) {
        showNotification('Error:','No se encontró el ID del Subdepartamento', 'error');
        return false;
      }
    await axios.delete(`${ENV.API_BACK_URL}subdepartments/${subDepartmentId}`);

    setSubDepartmentData(prevData => {
      return prevData.filter(item => item.id !== subDepartmentId);
    });

    showNotification(`Sub-Departamento ${subDepartment.name} eliminado con éxito`);
    return true;
  } catch (error) {
    showNotification('Error al eliminar Sub-Departamento', error.response.data.message, 'error');
    return false;
  }
};
  
  const contextValue = {
    loading,
    subDepartmentData,
    setSubDepartmentData, 
    createSubDepartment,
    updateSubDepartment,
    deleteSubDepartment
  };

  return (
    <SubDepartmentContext.Provider value={contextValue}>
      {children}
    </SubDepartmentContext.Provider>
  );
};