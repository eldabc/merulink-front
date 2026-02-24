import { createContext, useContext, useState, useCallback, useEffect  } from 'react';
import { useNotification } from "./NotificationContext";

import { lockerAssigns } from '../utils/StaticData/locker-assign-utils.js';
import { lockers } from '../utils/StaticData/locker-room-utils.js';
import { padlocks } from '../utils/StaticData/padlock-utils.js';
import { employees } from '../utils/StaticData/employee-utils.js';
import { normalizeDateDDMMYYY } from '../utils/date-utils.js';

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
      // Extraer lockers IDs que tienen asignación
      const assignedLockerIds = lockerAssigns.map(assign => assign.locker.id);

      // Filtrar y transformar array
      const availableLockersFormat = lockers
              .filter(locker => !assignedLockerIds.includes(locker.id))
              .map((locker, index) => {
                return {
                  id: `temp-${locker.id}-${index}`,
                  locker: {
                    ...locker,
                  }
                };
              });

      const combinedLockers = [...lockerAssigns, ...availableLockersFormat];
      // console.log("CombinedLockers",combinedLockers);

      setLockerAssignData(combinedLockers);
    } catch (err) {
      showNotification('Error al cargar datos', err.message);
    } finally {
      // setLoading(false);
    }
  }, [lockers, lockerAssigns]);

  useEffect(() => {
    console.log('UseEffect LockerAssignContext');
    loadLockerAssign();
  }, [loadLockerAssign]);

  // Armado JSON
  const formattedLockerAssign = (formData) => {
    // console.log("formData", formData);
    const wasAssigned = formData.employee.id ;
    const today = normalizeDateDDMMYYY(new Date());

    return {
      id: formData.id ? formData.id : Date.now(),
      assignCode: wasAssigned ? `ASG-${formData.locker?.code}-${today}` : '',
      assignDate: wasAssigned ? today : '',
      locker: {
        id: formData.locker?.id,
        code: formData.locker?.code,
        status: wasAssigned ? 'Ocupado' : 'Emparejado',
        category:{
          id: formData.locker?.category?.id,
          key: formData.locker?.category?.key,
          name: formData.locker?.category?.name,
        },
        padlock: {
          ...formData.padlock,
          status: 'Asignado',
        }
      },
      employee: {
        id: wasAssigned ? formData.employee.id : '',
        name: wasAssigned ? `${formData.employee.firstName} ${formData.employee.lastName}` : '',
        departement: formData.employee.department ? formData.employee.department : '',
        // departmentName: formData.employee.departmentName,
      }
    };
  }

  // *** Actualizar
  const updateLockerAssign = async (formData) => {
    try {
      const lockerId = formData.id;
      // console.log("formData", formData);
      if (!lockerId) {
        showNotification('Error: No se encontró el ID de la Asignación', 'error');
        return false;
      }

      const updatedLockerAssign = formattedLockerAssign(formData);
      console.log("Actualizado:", updatedLockerAssign);
      
      // **Actualizar status locker** y Candado**
      // Llamada a la API/Backend (onUpdate)
      // await api.put(`/events/${lockerId}`, updatedLockerAssign); 
      
      setLockerAssignData(prevData => {
        return prevData.map(lockerAssign => 
          lockerAssign.id === lockerId ? updatedLockerAssign : lockerAssign 
        );
      });

      showNotification(`Locker ${formData.locker?.code} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar: ' + error.message, 'error');
      return false;
    }
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

  const getLockers = async (category) => {
    try {
      return lockers.filter(locker => locker.category === category && locker.status === 'Disponible');
      
    } catch (error) {
      showNotification('Error al obtener Lockers', error.message);
      return false;
    }
  }

  const getPadlocks = async () => {
    try {
      return padlocks.filter(padlock => padlock.status === 'Disponible');
      
    } catch (error) {
      showNotification('Error al obtener Padlocks', error.message);
      return false;
    }
  }

  const getEmployeesByCategory = async (category) => {
    try {
        if (category === 'C') {
          category = 'H';
        } else if (category === 'D') {
          category = 'M';
        }
      
       return employees.filter(employee => employee.sex === category && employee.status === true && employee.useLocker === true);
        // console.log("FilteredEmployees", filteredEmployees);
      } catch (error) {
      showNotification('Error al obtener Empleados por Categoría', error.message);
      return false;
    }
  }


  const contextValue = {
    lockerAssignData,
    setLockerAssignData,
    loadLockerAssign,
    error,
    updateLockerAssign,
    deleteLockerAssign,
    getLockers,
    getPadlocks,
    getEmployeesByCategory
  };

  return (
    <LockerAssignContext.Provider value={contextValue}>
      {children}
    </LockerAssignContext.Provider>
  );
};