import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from "../context/GlobalDataContext";

const DepartmentContext = createContext();

// hook personalizado para usar el contexto
export const useDepartments = () => {
  return useContext(DepartmentContext);
};

// Provider con la lógica y el estado
export const DepartmentProvider = ({ children }) => {
    
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();
  const { addDepartmentGlobalState, updateDepartmentGlobalState, setDepartments } = useGlobalData();

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}departments`);
      setDepartmentData(response.data.data);
      setDepartments(response.data.data); // Global State

    } catch (error) {
      showNotification('Error al cargar departments', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

    // Armado JSON
  const formattedDepartments = (formData) => {
    console.log("formData", formData);

    return {
      id: formData.id ? formData.id : Date.now(),
      code: formData.code ?? null,
      departmentName: formData.departmentName ?? '',
    };
  }

  // *** Crear
  const createDepartment = async (formData) => {
    try {
      
      const newDepartment = formattedDepartments(formData);
      console.log("Creado", newDepartment);

      const response = await axios.post(`${ENV.API_BACK_URL}departments`, newDepartment);
      console.log("response.data.data", response.data.data);

      setDepartmentData(prevData => [response.data.data, ...prevData]);
      addDepartmentGlobalState(response.data.data);

      showNotification(`Department ${newDepartment.code} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el department', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updateDepartment = async (formData) => {
    try {
      const departmentId = formData.id;

      if (!departmentId) {
        showNotification('No se encontró el ID del departamento', error.response.data.message, 'error');
        return false;
      }

      const updatedDepartment = formattedDepartments(formData);
      console.log("Actualizado:", updatedDepartment);
      
      const response = await axios.put(`${ENV.API_BACK_URL}departments/${departmentId}`, updatedDepartment);

      setDepartmentData(prevData => {
        const filteredData = prevData.filter(department => department.id !== departmentId);
        return [response.data.data, ...filteredData];
      });

      updateDepartmentGlobalState(response.data.data);

      showNotification(`Department ${formData.code} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };
  
  // Eliminar
  const deleteDepartment = async (department) => {
    try {
      await axios.delete(`${ENV.API_BACK_URL}departments/${department.id}`);

      setDepartmentData(prevData => {
        return prevData.filter(item => item.id !== department.id);
      });

      showNotification(`Departamento ${department.departmentName} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar Departamento', error.response.data.message, 'error');
      return false;
    }
  };
  
  const contextValue = {
    departmentData,
    loading,
    setDepartmentData,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };

  return (
    <DepartmentContext.Provider value={contextValue}>
      {children}
    </DepartmentContext.Provider>
  );
};