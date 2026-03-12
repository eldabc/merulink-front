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

    if (lockers.length === 0 && assignments.length === 0) return [];
    const assignedLockerIds = assignments.map(a => a.locker.id);

    const availableLockersFormat = lockers
    .filter(locker => !assignedLockerIds.includes(Number(locker.id)))
    .map((locker, index) => ({
      id: `${locker.id}${index}${Date.now()}`,
      locker: { ...locker }
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
        firstName: formData.employee.firstName,
        lastName: formData.employee.lastName,
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
      const assignId = formData.id;

      if (!assignId) {
        showNotification('Error: No se encontró el ID de la Asignación', 'error');
        return false;
      }

      const updatedLockerAssign = formattedLockerAssign(formData);
      console.log("Actualizado:", updatedLockerAssign);
      
      const customMessage = updatedLockerAssign.employee ? 'Asignado' : 'Emparejado';

      const response = await axios.post(`${ENV.API_BACK_URL}assigns`, updatedLockerAssign);
      
      setAssignments(prevData => {
        const filteredData = prevData.filter(
          assign => Number(assign.locker.id) !== Number(response.data.data.locker.id)
        );
        return [response.data.data, ...filteredData];
      });

      showNotification(`Locker ${formData.locker?.code} ${customMessage} con éxito`); 
      return true;

    } catch (error) {
      showNotification('Error al actualizar: ' + error.response.data.message, 'error');
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

  const getLockers = async (categoryKey) => {
    try {
      const responseLockers = await axios.get(`${ENV.API_BACK_URL}lockers?available=true`); //categoryKey=${categoryKey}&
      // console.log('responseLockers', categoryKey, responseLockers.data.data);
      return responseLockers.data.data;
      
    } catch (error) {
      showNotification('Error al obtener Lockers', error.message);
      return false;
    }
  }

  const getPadlocks = async (lockerAssign) => {
    try {
      const padlockAssigned = lockerAssign?.locker?.padlock;
      const response = await axios.get(`${ENV.API_BACK_URL}padlocks?available=true`);
      if (padlockAssigned) {
        return [...response.data.data, padlockAssigned];     
      }
        return response.data.data;     
    } catch (error) {
      showNotification('Error al obtener Padlocks', error.message);
      return false;
    }
  }

   const getDepartments = async () => {
      try {
        const response = await axios.get(`${ENV.API_BACK_URL}departments`);
        return response.data.data;       
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