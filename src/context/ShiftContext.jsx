import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';

import { mapShiftToBackend } from '../utils/mappers/shiftMapper';

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
      const newShift = mapShiftToBackend(formData);

      console.log("Creado", newShift);
      const response = await axios.post(`${ENV.API_BACK_URL}shifts`, newShift);

      setShiftData(prevData => {
        return [response.data.data, ...prevData]; 
      });

      showNotification(`Turno ${newShift.description} creado con éxito`);
      
      return true;
    } catch (error) {
      console.log("error", error);
      showNotification('Error al crear Turno', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updateShift = async (formData) => {
    try {
      const shiftId = formData.id;

      if (!shiftId) {
        showNotification('Error:', 'No se encontró ID de Turno', 'error');
        return false;
      }

      const updatedShift = mapShiftToBackend(formData);
      console.log("Actualizado:", updatedShift);
      
      const response = await axios.put(`${ENV.API_BACK_URL}shifts/${shiftId}`, updatedShift);
      
      setShiftData(prevData => {
        const filteredData = prevData.filter(shift => shift.id !== shiftId);
        return [response.data.data, ...filteredData];
      });

      showNotification(`Turno ${formData.name} actualizado con éxito`); 
      return true;

    } catch (error) {
      console.log("error:", error);

      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deleteShift = async (shift) => {
    try {
      const shiftId = shift.id;

      if (!shiftId) {
        showNotification('Error:', 'No se encontró ID de Turno', 'error');
        return false;
      }
      await axios.delete(`${ENV.API_BACK_URL}shifts/${shiftId}`);

      setShiftData(prevData => {
        return prevData.filter(item => item.id !== shiftId);
      });

      showNotification(`Turno ${shift.description} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar Turno', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Obtener datos para generar código y mostrar códigos anteriores
  const getCodeDataByDepartment = async (departmentId) => {
    try {
      setLoading(true);
      if (!departmentId) {
        showNotification('Error:', 'No se encontró ID de Departamento', 'error');
        return false;
      }
      const response = await axios.get(`${ENV.API_BACK_URL}shifts/next-code/${departmentId}`);
      return response.data.data;

    } catch (error) {
        showNotification('Error al obtener datos para código', error.response.data.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const contextValue = {
    loading,
    createShift,
    updateShift,
    deleteShift,
    getCodeDataByDepartment,
    shiftData,
    setShiftData, 
  };

  return (
    <ShiftContext.Provider value={contextValue}>
      {children}
    </ShiftContext.Provider>
  );
};