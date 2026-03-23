import axios from 'axios';
import { ENV } from '../config/env';
import { useNotification } from "../context/NotificationContext";
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const PositionContext = createContext();

export const usePositions = () => {
  return useContext(PositionContext);
};

// Provider con la lógica y estado
export const PositionProvider = ({ children }) => {

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [positionData, setPositionData] = useState([]);

  const loadPositions = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}positions`);
      console.log("response.data.data", response.data.data);
      setPositionData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar Cargos', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  const formattedPosition = (formData) => {
    const departmentData =  getDepartmentNameById(formData.departmentId);
    
    return {
      id: formData.id ? formData.id : Date.now(),
      code: formData.code,
      name: formData.name,
      department: { 
        id: departmentData.id, 
        departmentName: departmentData.departmentName
      },
      subDepartment: { 
        id: formData.subDepartmentId, 
        name: departmentData.name
      },
      
    };
  };

  // *** Crear
  const createPosition = async (formData) => {

    try {
      const newPosition = formattedPosition(formData);
      console.log("Creado", newPosition);
      const response = await axios.post(`${ENV.API_BACK_URL}positions`, newPosition);

      setPositionData(prevData => {
        return [response.data.data, ...prevData]; 
      });

      showNotification(`Cargo ${newPosition.name} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear cargo', error.response.data.message, 'error');
      return false;
    }
  };
  
  const contextValue = {
    loading,
    createPosition,
    positionData,
    setPositionData, 
  };

  return (
    <PositionContext.Provider value={contextValue}>
      {children}
    </PositionContext.Provider>
  );
};