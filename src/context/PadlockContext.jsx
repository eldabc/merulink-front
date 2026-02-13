import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { padlocks } from '../utils/StaticData/padlock-utils';
import { useNotification } from "../context/NotificationContext";

const PadlockContext = createContext();


// hook personalizado para usar el contexto
export const usePadlocks = () => {
  return useContext(PadlockContext);
};

// Provider con la lógica y el estado
export const PadlockProvider = ({ children }) => {

  const [padlockData, setPadlockData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const loadPadlocks = useCallback(async () => {
    // setLoading(true);
    try {
      setPadlockData(padlocks);

    } catch (err) {
      showNotification('Error al cargar datos', err.message);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect PadlockContext');
    loadPadlocks();
  }, [loadPadlocks]);

  // Armado JSON
  const formattedPadlocks = (formData) => {

    return {
      id: Date.now(), // ID temporal
      code: formData.code ? formData.code : null,
      category: formData.category ? formData.category : null,
      status: formData.status ? formData.status : null,
    };
  }

  // *** Crear
  const createPadlock = async (formData) => {
    try {
      
      const newPadlock = formattedPadlocks(formData);
      console.log("Creado", newPadlock);

      // const response = await api.post('/subdepartments', newEvent); 
      // const createdRecord = await response.json(); 

      setPadlockData(prevData => [newPadlock, ...prevData]);
      showNotification(`Locker ${newPadlock.code} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el padlock', error.message);
      return false;
    }
  };

  // *** Actualizar
  const updatePadlock = async (formData, messagge) => {
    try {
      const padlockId = formData.id;
      if (!messagge) messagge = "Locker actualizado";

      if (!padlockId) {
        showNotification('Error: No se encontró el ID del padlock', 'error');
        return false;
      }

      const updatedLocker = formattedPadlocks(formData);
      console.log("Actualizado:", updatedLocker);
      
      // Llamada a la API/Backend (onUpdate)
      // await api.put(`/events/${padlockId}`, updatedLocker); 
      
      setPadlockData(prevData => {
        return prevData.map(padlock => 
          padlock.id === padlockId ? updatedLocker : padlock 
        );
      });

      showNotification(`Locker ${formData.code} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar: ' + error.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deletePadlock = async (padlock) => {
    try {
      // const response = await fetch(`https://miapi.com/events/${id}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error('No se pudo eliminar en el servidor');

      setPadlockData(prevData => {
        return prevData.filter(ev => ev.id !== padlock.id);
      });

      showNotification(`Locker ${padlock.code} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar el calendario', error.message);
      return false;
    }
  };


  const contextValue = {
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