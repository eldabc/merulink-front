import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { lockers, lockerCategories } from '../utils/StaticData/locker-room-utils';
import { useNotification } from "../context/NotificationContext";
import axios from 'axios';
import { ENV } from '../config/env';

const LockerRoomContext = createContext();

// hook personalizado para usar el contexto
export const useLockers = () => {
  return useContext(LockerRoomContext);
};

// Provider con la lógica y el estado
export const LockerRoomProvider = ({ children }) => { 

  const [lockerData, setLockerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const loadLockers = useCallback(async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}/lockers`);
      setLockerData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar lockers', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect LockerRoomContext');
    loadLockers();
  }, [loadLockers]);

  // Armado JSON
  const formattedLockers = (formData) => {
  const categoryData = lockerCategories.find(ca => ca.key === formData.category);

    return {
      id: formData.id ? formData.id : Date.now(),
      code: formData.category && formData.code ? `${formData.category}-${formData.code}` : null,
      category: {
        id: categoryData.id,
        key: categoryData.key,
        name: categoryData.value,
      },
      status: formData.status ? formData.status : null,
    };
  }

  // *** Crear
  const createLocker = async (formData) => {
    try {
      
      const newLocker = formattedLockers(formData);
      console.log("Creado", newLocker);

      const response = await axios.post(`${ENV.API_BACK_URL}/lockers`, newLocker);
      setLockerData(prev => [...prev, response.data.data]);

      setLockerData(prevData => [response.data.data, ...prevData]);
      showNotification(`Locker ${newLocker.code} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el locker', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updateLocker = async (formData) => {
    try {
      const lockerId = formData.id;

      if (!lockerId) {
        showNotification('No se encontró el ID del locker', error.response.data.message, 'error');
        return false;
      }

      const updatedLocker = formattedLockers(formData);
      console.log("Actualizado:", updatedLocker);
      
      const response = await axios.put(`${ENV.API_BACK_URL}/lockers/${lockerId}`, updatedLocker);
      
      setLockerData(prevData => {
        const filteredData = prevData.filter(locker => locker.id !== lockerId);
        // El dato actualizado primero
        return [response.data.data, ...filteredData];
      });

      showNotification(`Locker ${formData.code} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deleteLocker = async (locker) => {
    try {
      // const response = await fetch(`https://miapi.com/events/${id}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error('No se pudo eliminar en el servidor');

      setLockerData(prevData => {
        return prevData.filter(ev => ev.id !== locker.id);
      });

      showNotification(`Locker ${locker.code} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar el calendario', error.message);
      return false;
    }
  };


  const contextValue = {
    loading,
    lockerData,
    setLockerData,
    loadLockers,
    error,
    createLocker,
    updateLocker,
    deleteLocker,
  };

  return (
    <LockerRoomContext.Provider value={contextValue}>
      {children}
    </LockerRoomContext.Provider>
  );
};