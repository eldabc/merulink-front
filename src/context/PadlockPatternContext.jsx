import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { useNotification } from "../context/NotificationContext";

const PadlockPatternContext = createContext();

// hook personalizado para usar el contexto
export const usePadlockPatterns = () => {
  return useContext(PadlockPatternContext);
};

// Provider con la lógica y el estado
export const PadlockPatternProvider = ({ children }) => {

  const [padlockPatternData, setPadlockPatternData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const loadPadlockPatterns = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}padlocks/patterns`);
      setPadlockPatternData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar datos', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect PadlockPatternContext');
    loadPadlockPatterns();
  }, [loadPadlockPatterns]);

  // Armado JSON
  const formattedPadlockPatterns = (formData) => {

    return {
      id: formData.id ? formData.id : Date.now(),
      modelName: formData.modelName ? formData.modelName : null,
      resetInstructions: formData.resetInstructions ? formData.resetInstructions : null,
      unlockSequence: formData.unlockSequence ? formData.unlockSequence : null,
    };
  }

  // *** Crear
  const createPadlockPattern = async (formData) => {
    try {
      
      const newPadlockPattern = formattedPadlockPatterns(formData);
      console.log("Creado", newPadlockPattern);

      const response = await axios.post(`${ENV.API_BACK_URL}padlocks/patterns`, newPadlockPattern);
      setPadlockPatternData(prevData => [response.data.data, ...prevData]);

      showNotification(`Patrón ${newPadlockPattern.modelName} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear patrón', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updatePadlockPattern = async (formData) => {
    try {
      const padlockPatternId = formData.id;

      if (!padlockPatternId) {
        showNotification('Error:', 'No se encontró el ID del patrón', 'error');
        return false;
      }

      const updatedPadlockPattern = formattedPadlockPatterns(formData);
      console.log("Actualizado:", updatedPadlockPattern);
      
      const response = await axios.put(`${ENV.API_BACK_URL}padlocks/patterns/${updatedPadlockPattern.id}`, updatedPadlockPattern);
      
      setPadlockPatternData(prevData => {
        const filteredData = prevData.filter(padlockPattern => padlockPattern.id !== padlockPatternId);
        return [response.data.data, ...filteredData];
      });

      showNotification(`Patrón ${updatedPadlockPattern.modelName} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deletePadlockPattern = async (padlockPattern) => {
     setLoading(true);
    try {
      await axios.delete(`${ENV.API_BACK_URL}padlockPatterns/${padlockPattern.id}`);

      setPadlockPatternData(prevData => {
        return prevData.filter(item => item.id !== padlockPattern.id);
      });

      showNotification(`Candado ${padlockPattern.serial} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar el Candado', error.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };


  const contextValue = {
    loading,
    padlockPatternData,
    setPadlockPatternData,
    loadPadlockPatterns,
    error,
    createPadlockPattern,
    updatePadlockPattern,
    deletePadlockPattern,
  };

  return (
    <PadlockPatternContext.Provider value={contextValue}>
      {children}
    </PadlockPatternContext.Provider>
  );
};