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

  // *** Crear
  const createLocker = async (formData) => {
    try {
      
      const newLocker = formattedEvents(formData);
      console.log("Creado", newLocker);

      // const response = await api.post('/subdepartments', newEvent); 
      // const createdRecord = await response.json(); 

      setLockerData(prevData => [newLocker, ...prevData]);
      showNotification(`Evento ${newLocker.title} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el locker', 'error');
      return false;
    }
  };


  const contextValue = {
    lockerData,
    setLockerData,
    loadLockers,
    error,
    createLocker,
  };

  return (
    <LockerRoomContext.Provider value={contextValue}>
      {children}
    </LockerRoomContext.Provider>
  );
};