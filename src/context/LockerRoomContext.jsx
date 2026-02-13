import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { lockers } from '../utils/StaticData/locker-room-utils';
import { useNotification } from "../context/NotificationContext";

const LockerRoomContext = createContext();


// hook personalizado para usar el contexto
export const useLockers = () => {
  return useContext(LockerRoomContext);
};

// Provider con la lógica y el estado
export const LockerRoomProvider = ({ children }) => { //showNotification, 


  const [lockerData, setLockerData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const loadLockers = useCallback(async () => {
    // setLoading(true);
    try {
      setLockerData(lockers);
    } catch (err) {
      showNotification('Error al cargar datos', err.message);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect LockerRoomContext');
    loadLockers();
  }, [loadLockers]);

  // Armado JSON
  const formattedLockers = (formData) => {

    return {
      id: Date.now(), // ID temporal
      code: formData.code ? formData.code : null,
      category: formData.category ? formData.category : null,
      status: formData.status ? formData.status : null,
    };
      }

  // *** Crear
  const createLocker = async (formData) => {
    try {
      
      const newLocker = formattedLockers(formData);
      console.log("Creado", newLocker);

      // const response = await api.post('/subdepartments', newEvent); 
      // const createdRecord = await response.json(); 

      setLockerData(prevData => [newLocker, ...prevData]);
      showNotification(`Locker ${newLocker.code} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el locker', error.message);
      return false;
    }
  };

  // *** Actualizar
  const updateLocker = async (formData, messagge) => {
    try {
      const lockerId = formData.id;
      if (!messagge) messagge = "Locker actualizado";

      if (!lockerId) {
        showNotification('Error: No se encontró el ID del locker', 'error');
        return false;
      }

      const updatedLocker = formattedLockers(formData);
      console.log("Actualizado:", updatedLocker);
      
      // Llamada a la API/Backend (onUpdate)
      // await api.put(`/events/${lockerId}`, updatedLocker); 
      
      setLockerData(prevData => {
        return prevData.map(locker => 
          locker.id === lockerId ? updatedLocker : locker 
        );
      });

      showNotification(`Locker actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar: ' + error.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deleteLocker = async (id) => {
    try {
      // const response = await fetch(`https://miapi.com/events/${id}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error('No se pudo eliminar en el servidor');

      setLockerData(prevData => {
        return prevData.filter(ev => ev.id !== id);
      });

      showNotification(`Locker eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar el calendario', error.message);
      return false;
    }
  };


  const contextValue = {
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