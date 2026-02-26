import { createContext, useContext, useState, useCallback, useEffect, useMemo  } from 'react';
import { useNotification } from "./NotificationContext";

import { lockerAssigns } from '../utils/StaticData/locker-assign-utils.js';
import { lockers } from '../utils/StaticData/locker-room-utils.js';
import { padlocks } from '../utils/StaticData/padlock-utils.js';
import { employees } from '../utils/StaticData/employee-utils.js';
import { normalizeDateDDMMYYY } from '../utils/date-utils.js';
import { departments } from '../utils/StaticData/departments-utils.js';

const LockerAssignContext = createContext();


// hook personalizado para usar el contexto
export const useLockerAssigns = () => {
  return useContext(LockerAssignContext);
};

// Provider con la lógica y el estado
export const LockerAssignProvider = ({ children }) => {

  const [assignments, setAssignments] = useState(lockerAssigns);
  // const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();


  const lockerAssignData = useMemo(() => {
    const assignedLockerIds = assignments.map(a => a.locker.id);

    const availableLockersFormat = lockers
       .filter(locker => !assignedLockerIds.includes(Number(locker.id)))
      .map((locker, index) => ({
        id: `temp-${locker.id}-${index}`,
        locker: {
          ...locker,
          status: 'Disponible'
        }
      }));

    return [...assignments, ...availableLockersFormat];
  }, [assignments, lockers]);


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
        department: wasAssigned ? formData.employee.department : '',
        departmentName: wasAssigned ? formData.employee.departmentName : '',
      }
    };
  }

  // *** Actualizar
  const updateLockerAssign = async (formData) => {
    try {
      const lockerId = formData.id;

      if (!lockerId) {
        showNotification('Error: No se encontró el ID de la Asignación', 'error');
        return false;
      }

      const updatedLockerAssign = formattedLockerAssign(formData);
      console.log("Actualizado:", updatedLockerAssign);

      setAssignments(prev => {

        // Buscar si existe asignación para el locker
        const exists = prev.some(a =>
          Number(a.locker.id) === Number(updatedLockerAssign.locker.id)
        );

        if (exists) {
          return prev.map(a =>
            Number(a.locker.id) === Number(updatedLockerAssign.locker.id)
              ? updatedLockerAssign
              : a
          );
        }

        return [...prev, updatedLockerAssign];
      });

      showNotification(`Locker ${formData.locker?.code} actualizado con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar: ' + error.message, 'error');
      return false;
    }
  };

    // *** Resetear 1 Locker todos de una categoría
  const resetLockerAssign = async (id, categoryKey = '', categoryName = '') => {
    try {
      if (categoryKey) {
        setAssignments(prev => {
          const filtered = prev.filter(a => a.locker.category.key !== categoryKey);
          return filtered;
        });
      } else {
        setAssignments(prev => {
          const filtered = prev.filter(a => a.id !== id);
          return filtered;
        });
      }

      showNotification(`Locker ${categoryName} reseteado con éxito.`);
    } catch (error) {
      showNotification('Error al resetear el Locker', 'error');
      return false;
    }
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

   const getDepartments = async () => {
      try {
        return departments;       
      } catch (error) {
        showNotification('Error al obtener Departamentos', error.message);
        return [];
      }
    }

  const getEmployeesByCategory = async (category) => {
    try {
        if (category === 'C') {
          category = 'H';
        } else if (category === 'D') {
          category = 'M';
        }
        // TODO: en back se debe validar también que traiga solo los employees que no tienen locker asignado.
       return employees.filter(employee => employee.sex === category && employee.status === true && employee.useLocker === true);

      } catch (error) {
      showNotification('Error al obtener Empleados por Categoría', error.message);
      return false;
    }
  }


  const contextValue = {
    lockerAssignData,
    // loadLockerAssign,
    error,
    updateLockerAssign,
    resetLockerAssign,
    getLockers,
    getPadlocks,
    getDepartments,
    getEmployeesByCategory
  };

  return (
    <LockerAssignContext.Provider value={contextValue}>
      {children}
    </LockerAssignContext.Provider>
  );
};