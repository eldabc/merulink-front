import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';

import { mapPositionToBackend } from '../utils/mappers/positionMapper';

const ShiftContext = createContext();

export const useShifts = () => {
  return useContext(ShiftContext);
};

// Provider con la lógica y estado
export const ShiftProvider = ({ children }) => {

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [shiftData, setShiftData] = useState([]);
  const { departments } = useGlobalData();

  const loadShifts = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}shifts`);
      // console.log("response.data.data", response.data.data);
      setShiftData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar Turnos', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadShifts();
  }, [loadShifts]);


  // *** Crear
  const createShift = async (formData) => {

    try {
      const isAddingSubDepartment = formData.subDepartmentName && formData.newSubDepartmentCode;
      const newPosition = mapPositionToBackend(formData, isAddingSubDepartment); //formattedPosition(formData);

      console.log("Creado", newPosition);
      const response = await axios.post(`${ENV.API_BACK_URL}shifts`, newPosition);
      // console.log("response.data.data,", response.data.data,);

      setShiftData(prevData => {
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
      
      const response = await axios.put(`${ENV.API_BACK_URL}shifts/${positionId}`, updatedPosition);
      
      setShiftData(prevData => {
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
      await axios.delete(`${ENV.API_BACK_URL}shifts/${position.id}`);

      setShiftData(prevData => {
        return prevData.filter(item => item.id !== position.id);
      });

      showNotification(`Cargo ${position.name} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar Cargo', error.response.data.message, 'error');
      return false;
    }
  };

  const updateGlobalStage = (shiftData) => {
    return {
      id: shiftData.id,
      code: shiftData.code,
      name: shiftData.name,
      department: { ...shiftData.department },
      employees: [ 
        ...shiftData.employees
      ],
      subDepartment: { ...shiftData.subDepartment }
    };
  };
  
  const contextValue = {
    loading,
    createShift,
    updatePosition,
    deletePosition,
    shiftData,
    setShiftData, 
  };

  return (
    <ShiftContext.Provider value={contextValue}>
      {children}
    </ShiftContext.Provider>
  );
};