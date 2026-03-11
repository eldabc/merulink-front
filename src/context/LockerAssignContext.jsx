import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect, useMemo  } from 'react';
import { useNotification } from "./NotificationContext";

import { padlocks } from '../utils/StaticData/padlock-utils.js';
import { employees } from '../utils/StaticData/employee-utils.js';

import { departments } from '../utils/StaticData/departments-utils.js';
import { normalizeDateDDMMYYY } from '../utils/date-utils.js';

const LockerAssignContext = createContext();

// hook personalizado para usar el contexto
export const useLockerAssigns = () => {
  return useContext(LockerAssignContext);
};

// Provider con la lógica y el estado
export const LockerAssignProvider = ({ children }) => {

  const [error, setError] = useState(null);
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const { showNotification } = useNotification();

  const lockerAssignData = useMemo(() => {

    if (lockers.length === 0 || assignments.length === 0) return [];

    const assignedLockerIds = assignments.map(a => a.locker.id);
    console.log('lockers assignments', assignments);

    const availableLockersFormat = lockers
       .filter(locker => !assignedLockerIds.includes(Number(locker.id))) // Cambiar getLockers para que traiga solo disponibles
      .map((locker, index) => ({
        id: `${locker.id}${index}${Date.now()}`,
        locker: {
          ...locker,
        }
      }));

    return [...assignments, ...availableLockersFormat];
  }, [assignments, lockers]);

  useEffect(() => {
    console.log('UseEffect LockerAssignContext');
    const fetchData = async () => {
      setLoading(true);
      try {

        const [lockersData, assignsData] = await Promise.all([
          getLockers(),
          axios.get(`${ENV.API_BACK_URL}assigns`)
        ]);

        setLockers(lockersData);
        setAssignments(assignsData.data.data);
        
      } catch (error) {
        showNotification('Error obteniendo los datos', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Armado JSON
  const formattedLockerAssign = (formData) => {
    // console.log("formData", formData);
    const wasAssigned = formData.employee.id ;
    const today = normalizeDateDDMMYYY(new Date());

    const employeeDataSet = wasAssigned ? (
      {
        id: formData.employee.id,
        name: `${formData.employee.firstName} ${formData.employee.lastName}`,
        department: formData.employee.department,
        departmentName: formData.employee.departmentName,
      }
    ) : null;

    return {
      id: formData.id ? formData.id : Date.now(),
      assignCode: wasAssigned ? `ASG${formData.locker?.code}-${today}` : '',
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
      employee: employeeDataSet
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

      const response = await axios.put(`${ENV.API_BACK_URL}assigns/${lockerId}`, updatedLockerAssign);
      console.log("response.data.data:", response.data.data);
      // setLockerData(prevData => {
      //   const filteredData = prevData.filter(locker => locker.id !== lockerId);
      //   // El dato actualizado primero
      //   return [response.data.data, ...filteredData];
      // });

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
      const responseLockers = await axios.get(`${ENV.API_BACK_URL}lockers`);
      // console.log('responseLockers', responseLockers.data.data);
      return responseLockers.data.data;
      
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

  const getEmployeesByCategory = async (lockerAssign) => {
    try {
      let categoryKey = lockerAssign?.locker?.category?.key;
      const employee = lockerAssign?.employee;

        // getCategoryKey(categoryKey);
        if (categoryKey === 'C') {
          categoryKey = 'H';
        } else if (categoryKey === 'D') {
          categoryKey = 'M';
        }

        const response = await axios.get(`${ENV.API_BACK_URL}employees?sex=${categoryKey}&unassigned=true`);
        
        if (employee) {
          return [...response.data.data, employee];
        }
        return [...response.data.data];

      } catch (error) {
      showNotification('Error al obtener Empleados por Categoría', error.message);
      return false;
    }
  }


  const contextValue = {
    loading,
    lockerAssignData,
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