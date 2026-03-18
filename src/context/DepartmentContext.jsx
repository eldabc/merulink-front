import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";

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

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}departments`);
      console.log("des", response.data.data)
      setDepartmentData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar departments', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect DepartmentContext');
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
        showNotification('No se encontró el ID del department', error.response.data.message, 'error');
        return false;
      }

      const updatedDepartment = formattedDepartments(formData);
      console.log("Actualizado:", updatedDepartment);
      
      const response = await axios.put(`${ENV.API_BACK_URL}departments/${departmentId}`, updatedDepartment);
      
      setDepartmentData(prevData => {
        const filteredData = prevData.filter(department => department.id !== departmentId);
        // El dato actualizado primero
        return [response.data.data, ...filteredData];
      });

      showNotification(`Department ${formData.code} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };
  
  // Se puede añadir más funciones (ojo)
  const contextValue = {
    departmentData,
    loading,
    setDepartmentData,
    createDepartment,
    updateDepartment,
  };

  return (
    <DepartmentContext.Provider value={contextValue}>
      {children}
    </DepartmentContext.Provider>
  );
};