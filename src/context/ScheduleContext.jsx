import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';
import { allMonths } from '../utils/StaticData/months-utils';


import { mapScheduleToBackend } from '../utils/mappers/scheduleMapper';

const ScheduleContext = createContext();

export const useSchedules = () => {
  return useContext(ScheduleContext);
};

// Provider con la lógica y estado
export const ScheduleProvider = ({ children }) => {

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [events, setEvents] = useState([]);
  
  const { getEmployeesByDepartment } = useGlobalData();

  const loadSchedules = useCallback(async (selectedDepartmentId = '', start = '', end = '') => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}schedule-plannings?start=${start}&end=${end}&departmentId=${selectedDepartmentId}`);
      console.log("response.data.data", response.data.data);
      setScheduleData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar Horarios', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const loadFormData = async (departmentId, start, end) => {
    // setLoading(true);
    try {
      // Ejecuta las peticiones en paralelo para mantener el orden en form
      const [shiftData, employeesData] = await Promise.all([//, eventsData
        getShifts(departmentId),
        getEmployeesByDepartment(departmentId, start, end),
        // getEvents(start,end) //Eventos en el intervalo de fechas seleccionado que tengas colorinDay activo. (id,title,path 'path colocar solo solo en modoView')
      ]);
      // console.log("shift", shiftData);
      // console.log("employeesData", employeesData);
      return { shifts: shiftData, employees: employeesData }; //, eventsData

    } catch (error) {
      console.error("Error cargando datos del formulario", error);
    } finally {
      setLoading(false);
    }
  };


  // *** Crear
  const createSchedule = async (formData) => {

    try {
      const newSchedule = mapScheduleToBackend(formData);

      console.log("Creado", newSchedule);
      const response = await axios.post(`${ENV.API_BACK_URL}schedule-plannings`, newSchedule);

      setScheduleData(prevData => {
        return [response.data.data, ...prevData]; 
      });

     const selectedMonth = allMonths.find(m => m.value === Number(formData.selectedMonthId));

      showNotification(`Horario ${selectedMonth.label} quincena ${formData.selectedFortnight} creado con éxito`);
      
      return true;
    } catch (error) {
      console.log("error", error);
      showNotification('Error al crear Horario', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updateSchedule = async (formData) => {
    try {
      const scheduleId = formData.id;

      if (!scheduleId) {
        showNotification('Error:', 'No se encontró ID de Horario', 'error');
        return false;
      }

      const updatedSchedule = mapScheduleToBackend(formData);
      console.log("Actualizado:", updatedSchedule);
      
      const response = await axios.put(`${ENV.API_BACK_URL}schedules/${scheduleId}`, updatedSchedule);
      
      setScheduleData(prevData => {
        const filteredData = prevData.filter(schedule => schedule.id !== scheduleId);
        return [response.data.data, ...filteredData];
      });

      showNotification(`Horario ${formData.description} actualizado con éxito`); 
      return true;

    } catch (error) {
      console.log("error:", error);

      showNotification('Error al actualizar:', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deleteSchedule = async (schedule) => {
    try {
      const scheduleId = schedule.id;

      if (!scheduleId) {
        showNotification('Error:', 'No se encontró ID de Horario', 'error');
        return false;
      }
      await axios.delete(`${ENV.API_BACK_URL}schedules/${scheduleId}`);

      setScheduleData(prevData => {
        return prevData.filter(item => item.id !== scheduleId);
      });

      showNotification(`Horario ${schedule.description} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar Horario', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Obtener datos de los turnos disponibles por departamento
  const getShifts = async (departmentId) => {
    try {
      // console.log("getShifts departmentId", departmentId);
      if (!departmentId) {
        showNotification('Error:', 'No se encontró ID de Departamento', 'error');
        return false;
      }
      const response = await axios.get(`${ENV.API_BACK_URL}shifts?departmentId=${departmentId}`);
      return response.data.data;

    } catch (error) {
        showNotification('Error al obtener datos de los Horarios', error.response.data.message, 'error');
    }
  };

    const getSchedule = useCallback(async (selectedDepartmentId = null, start = null, end = null) => {
    // setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}schedule-plannings?start=${start}&end=${end}&departmentId=${selectedDepartmentId}`);
      console.log("getSchedule", response.data.data);
      return response.data.data;

    } catch (error) {
      showNotification('Error al cargar Horario', error.message, 'error');
    } finally {
      // setLoading(false);
    }
  }, []);
  
  const contextValue = {
    loading,
    setLoading,
    loadFormData,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getShifts,
    scheduleData,
    setScheduleData, 
  };

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};