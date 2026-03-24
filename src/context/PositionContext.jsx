import axios from 'axios';
import { ENV } from '../config/env';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';
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
  const { departments } = useGlobalData();

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
    const departmentData =  departments.find(d => String(d.id) === String(formData.departmentId));
    const subDepartmentData = departmentData?.subDepartments?.find(
        sub => String(sub.id) === String(formData.subDepartmentId)
    );

    return {
      id: formData.id ? formData.id : Date.now(),
      code: formData.code,
      name: formData.name,
      department: { 
        id: departmentData.id, 
        departmentName: departmentData.departmentName
      },
      subDepartment: { 
        id: subDepartmentData?.id ?? null, 
        name: subDepartmentData?.name
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

  // *** Actualizar
  const updatePosition = async (formData) => {
    try {
      const positionId = formData.id;

      if (!positionId) {
        showNotification('No se encontró ID de cargo', error.response.data.message, 'error');
        return false;
      }

      const updatedPosition = formattedPosition(formData);
      console.log("Actualizado:", updatedPosition);
      
      const response = await axios.put(`${ENV.API_BACK_URL}positions/${positionId}`, updatedPosition);
      
      setPositionData(prevData => {
        const filteredData = prevData.filter(position => position.id !== positionId);
        return [response.data.data, ...filteredData];
      });

      showNotification(`Cargo ${formData.name} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deletePosition = async (position) => {
    try {
      await axios.delete(`${ENV.API_BACK_URL}positions/${position.id}`);

      setPositionData(prevData => {
        return prevData.filter(item => item.id !== position.id);
      });

      showNotification(`Cargo ${position.name} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar Cargo', error.response.data.message, 'error');
      return false;
    }
  };
  
  const contextValue = {
    loading,
    createPosition,
    updatePosition,
    deletePosition,
    positionData,
    setPositionData, 
  };

  return (
    <PositionContext.Provider value={contextValue}>
      {children}
    </PositionContext.Provider>
  );
};