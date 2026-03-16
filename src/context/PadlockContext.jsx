import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { useNotification } from "../context/NotificationContext";

const PadlockContext = createContext();

// hook personalizado para usar el contexto
export const usePadlocks = () => {
  return useContext(PadlockContext);
};

// Provider con la lógica y el estado
export const PadlockProvider = ({ children }) => {

  const [padlockData, setPadlockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const loadPadlocks = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}padlocks`);
      setPadlockData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar datos', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect PadlockContext');
    loadPadlocks();
  }, [loadPadlocks]);

  // Armado JSON
  const formattedPadlocks = (formData) => {

    return {
      id: formData.id ? formData.id : Date.now(),
      serial: formData.serial ? formData.serial : null,
      pass: formData.pass ? formData.pass : null,
      status: formData.status ? formData.status : null,
    };
  }

  // *** Crear
  const createPadlock = async (formData) => {
    try {
      
      const newPadlock = formattedPadlocks(formData);
      console.log("Creado", newPadlock);

      const response = await axios.post(`${ENV.API_BACK_URL}padlocks`, newPadlock);
      setPadlockData(prevData => [response.data.data, ...prevData]);

      showNotification(`Candado ${newPadlock.serial} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el padlock', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updatePadlock = async (formData) => {
    try {
      const padlockId = formData.id;

      if (!padlockId) {
        showNotification('Error: No se encontró el ID del Candado', 'error');
        return false;
      }

      const updatedPadlock = formattedPadlocks(formData);
      console.log("Actualizado:", updatedPadlock);
      
      const response = await axios.put(`${ENV.API_BACK_URL}padlocks/${padlockId}`, updatedPadlock);
      
      setPadlockData(prevData => {
        const filteredData = prevData.filter(padlock => padlock.id !== padlockId);
        return [response.data.data, ...filteredData];
      });

      showNotification(`Candado ${updatedPadlock.serial} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deletePadlock = async (padlock) => {
     setLoading(true);
    try {
      await axios.delete(`${ENV.API_BACK_URL}padlocks/${padlock.id}`);

      setPadlockData(prevData => {
        return prevData.filter(item => item.id !== padlock.id);
      });

      showNotification(`Candado ${padlock.serial} eliminado con éxito`);
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
    padlockData,
    setPadlockData,
    loadPadlocks,
    error,
    createPadlock,
    updatePadlock,
    deletePadlock,
  };

  return (
    <PadlockContext.Provider value={contextValue}>
      {children}
    </PadlockContext.Provider>
  );
};