import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';

import { mapPositionToBackend } from '../utils/mappers/positionMapper';

const PositionContext = createContext();

export const usePositions = () => {
  return useContext(PositionContext);
};

// Provider con la lógica y estado
export const PositionProvider = ({ children }) => {

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [positionData, setPositionData] = useState([]);
  const { departments, addPositionGlobalState, updatePositionGlobalState } = useGlobalData();

  const loadPositions = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}positions`);
      // console.log("response.data.data", response.data.data);
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


  // *** Crear
  const createPosition = async (formData) => {

    try {
      const isAddingSubDepartment = formData.subDepartmentName && formData.newSubDepartmentCode;
      const newPosition = mapPositionToBackend(formData, isAddingSubDepartment); //formattedPosition(formData);

      console.log("Creado", newPosition);
      const response = await axios.post(`${ENV.API_BACK_URL}positions`, newPosition);
      // console.log("response.data.data,", response.data.data,);

      setPositionData(prevData => {
        return [response.data.data, ...prevData]; 
      });

      const globalData = updateGlobalStage(response.data.data);
      console.log("globalData", globalData,departments);

      addPositionGlobalState(globalData, isAddingSubDepartment);

      showNotification(`Cargo ${newPosition.name} creado con éxito`);
      
      return true;
    } catch (error) {
      console.log("error", error);
      showNotification('Error al crear cargo', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updatePosition = async (formData) => {
    try {
      const positionId = formData.id;

      if (!positionId) {
        showNotification('Error:', 'No se encontró ID de cargo', 'error');
        return false;
      }

      const isAddingSubDepartment = formData.subDepartmentName && formData.newSubDepartmentCode;
      const updatedPosition = mapPositionToBackend(formData); //formattedPosition(formData);
      console.log("Actualizado:", updatedPosition);
      
      const response = await axios.put(`${ENV.API_BACK_URL}positions/${positionId}`, updatedPosition);
      
      setPositionData(prevData => {
        const filteredData = prevData.filter(position => position.id !== positionId);
        return [response.data.data, ...filteredData];
      });

      const globalData = updateGlobalStage(response.data.data);
      console.log("globalData update", globalData);

      updatePositionGlobalState(globalData, isAddingSubDepartment);

      showNotification(`Cargo ${formData.name} actualizado con éxito`); 
      return true;

    } catch (error) {
      console.log("error:", error);

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

  const updateGlobalStage = (positionData) => {
    return {
      id: positionData.id,
      code: positionData.code,
      name: positionData.name,
      department: { ...positionData.department },
      employees: [ 
        ...positionData.employees
      ],
      subDepartment: { ...positionData.subDepartment }
    };
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