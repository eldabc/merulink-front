import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { lockerAssigns } from '../utils/StaticData/lockerAssign-room-utils';
import { useNotification } from "./NotificationContext";

const LockerAssignContext = createContext();


// hook personalizado para usar el contexto
export const useLockerAssigns = () => {
  return useContext(LockerAssignContext);
};

// Provider con la lógica y el estado
export const LockerAssignProvider = ({ children }) => {


  const [lockerAssignData, setLockerAssignData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const loadLockerAssign = useCallback(async () => {
    // setLoading(true);
    try {
      setLockerAssignData(lockerAssigns);
    } catch (err) {
      showNotification('Error al cargar datos', err.message);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect LockerAssignContext');
    loadLockerAssign();
  }, [loadLockerAssign]);

  // Armado JSON
  const formattedLockerAssign = (formData) => {

    return {
      id: Date.now(), // ID temporal
      code: formData.code ? formData.code : null,
      category: formData.category ? formData.category : null,
      status: formData.status ? formData.status : null,
    };
      }

  // *** Crear
  const createLockerAssign = async (formData) => {
    // try {
      
    //   const newLockerAssign = formattedLockerAssignAssigns(formData);
    //   console.log("Creado", newLockerAssign);

    //   // const response = await api.post('/subdepartments', newEvent); 
    //   // const createdRecord = await response.json(); 

    //   setLockerAssignData(prevData => [newLockerAssign, ...prevData]);
    //   showNotification(`LockerAssignAssign ${newLockerAssign.code} creado con éxito`);
      
    //   return true;
    // } catch (error) {
    //   showNotification('Error al crear el lockerAssign', error.message);
    //   return false;
    // }
  };

  // *** Actualizar
  const updateLockerAssign = async (formData, messagge) => {
    // try {
    //   const lockerId = formData.id;
    //   if (!messagge) messagge = "LockerAssignAssign actualizado";

    //   if (!lockerId) {
    //     showNotification('Error: No se encontró el ID del lockerAssign', 'error');
    //     return false;
    //   }

    //   const updatedLockerAssign = formattedLockerAssignAssigns(formData);
    //   console.log("Actualizado:", updatedLockerAssign);
      
    //   // Llamada a la API/Backend (onUpdate)
    //   // await api.put(`/events/${lockerId}`, updatedLockerAssign); 
      
    //   setLockerAssignData(prevData => {
    //     return prevData.map(lockerAssign => 
    //       lockerAssign.id === lockerId ? updatedLockerAssign : lockerAssign 
    //     );
    //   });

    //   showNotification(`LockerAssignAssign ${formData.code} actualizado con éxito`); 
    //   return true;

    // } catch (error) {
    //   showNotification('Error al actualizar: ' + error.message, 'error');
    //   return false;
    // }
  };

  // *** Eliminar
  const deleteLockerAssign = async (lockerAssign) => {
    // try {
    //   // const response = await fetch(`https://miapi.com/events/${id}`, { method: 'DELETE' });
    //   // if (!response.ok) throw new Error('No se pudo eliminar en el servidor');

    //   setLockerAssignData(prevData => {
    //     return prevData.filter(ev => ev.id !== lockerAssign.id);
    //   });

    //   showNotification(`LockerAssignAssign ${lockerAssign.code} eliminado con éxito`);
    //   return true;
    // } catch (error) {
    //   showNotification('Error al eliminar el calendario', error.message);
    //   return false;
    // }
  };


  const contextValue = {
    lockerAssignData,
    setLockerAssignData,
    loadLockerAssign,
    error,
    createLockerAssign,
    updateLockerAssign,
    deleteLockerAssign,
  };

  return (
    <LockerAssignContext.Provider value={contextValue}>
      {children}
    </LockerAssignContext.Provider>
  );
};