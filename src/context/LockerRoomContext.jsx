import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { lockers } from '../utils/StaticData/locker-room-utils'
const LockerRoomContext = createContext();


// hook personalizado para usar el contexto
export const useLockerRooms = () => {
  return useContext(LockerRoomContext);
};

// Provider con la lógica y el estado
export const LockerRoomProvider = ({ children }) => { //showNotification, 


  const [lockerRoomData, setlockerRoomData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLockers = useCallback(async () => {
    // setLoading(true);
    try {
      setlockerRoomData(lockers);
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

  const contextValue = {
    lockerRoomData,
    setlockerRoomData,
    loadLockers,
    error,
  };

  return (
    <LockerRoomContext.Provider value={contextValue}>
      {children}
    </LockerRoomContext.Provider>
  );
};