import dayjs from 'dayjs';
import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';
import { getEmployeesByDept } from '../services/masterDataService';

import { allMonths } from '../utils/StaticData/months-utils';
import { capitalizeFirstLetter } from '../utils/text-utils';
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

  const loadSchedules = useCallback(async (departmentId, month, year) => {
    setLoading(true);
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}schedule-plannings?monthId=${month}&departmentId=${departmentId}&year=${year}`);
      // console.log("response.data.data", response.data.data);
      setScheduleData(response.data.data);

    } catch (error) {
      showNotification('Error al cargar Horarios', error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFormData = async (departmentId, start, end) => {
    try {

      return await getEmployeesByDept(departmentId, start, end);

    } catch (error) {
      console.error("Error cargando datos del formulario", error);
    }
  };

  const loadScheduleHistory = async (id) => {
    try {
      const response = await axios.get(`${ENV.API_BACK_URL}schedule-plannings/${id}/history`);
      return response.data?.data ?? [];
    } catch (error) {
      console.error("Error cargando historial", error);
      return [];
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

      const selectedMonth = allMonths.find(m => m.value === Number(formData.monthNumber));
      showNotification(`Horario ${selectedMonth.label} quincena ${formData.selectedFortnight} creado con éxito`);
      
      return true;
    } catch (error) {
      console.log("error", error);
      showNotification('Error al crear Horario', error.response?.data?.message, 'error');
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
      
      const response = await axios.put(`${ENV.API_BACK_URL}schedule-plannings/${scheduleId}`, updatedSchedule);
      
      // setScheduleData(prevData => {
      //   const filteredData = prevData.filter(schedule => schedule.id !== scheduleId);
      //   return [response.data.data, ...filteredData];
      // });

      const selectedMonth = allMonths.find(m => m.value === Number(formData.monthNumber));
      showNotification(`Horario ${selectedMonth.label} quincena ${formData.selectedFortnight} actualizado con éxito`); 
      return true;

    } catch (error) {
      console.log("error:", error);

      showNotification('Error al actualizar:', error.response?.data?.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deleteSchedule = async (schedule) => {
    try {
      const scheduleId = schedule.id;
      const selectedMonth = dayjs(schedule.start).format('MMMM');

      if (!scheduleId) {
        showNotification('Error:', 'No se encontró ID de Horario', 'error');
        return false;
      }

      await axios.delete(`${ENV.API_BACK_URL}schedule-plannings/${scheduleId}`);
      setScheduleData(prevData => { return prevData.filter(item => item.id !== scheduleId); });

      showNotification(
        `Horario ${capitalizeFirstLetter(selectedMonth)} 
         quincena ${dayjs(schedule.start).format('DD/MM/YYYY')} - ${dayjs(schedule.end).format('DD/MM/YYYY')} eliminado con éxito`
      );
      return true;
    } catch (error) {
      console.log("error", error)
      showNotification('Error al eliminar Horario', error.response?.data?.message, 'error');
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
        showNotification('Error al obtener datos de los Horarios', error.response?.data?.message, 'error');
    }
  };

  const getScheduleById = useCallback(async (schedulePlanningId) => {
    setLoading(true); 
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}schedule-plannings/${schedulePlanningId}`);
      console.log("getScheduleById", response.data);
      return response.data;
    
    } catch (error) {
      showNotification('Error al cargar el Horario por ID', error?.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const autofillSchedule = async (payload) => {
    try {
      const selectedMonth = dayjs(payload.start).format('MMMM');
      const response = await axios.post(`${ENV.API_BACK_URL}schedule-plannings/autofill`, payload);

      showNotification(
        `Horario ${capitalizeFirstLetter(selectedMonth)} 
         quincena ${dayjs(payload.start).format('DD/MM/YYYY')} - ${dayjs(payload.end).format('DD/MM/YYYY')} cargado con éxito`
      );

      return response.data;
    } catch (error) {
      console.error("Error guardar datos de autofill", error);
      showNotification('Error al guardar datos quincena', error.response?.data?.message || error.message, 'error');
    }
  };

  const toggleAutofillAlways = async (autofillFortnight, departmentId) => {
    try {
      if (typeof autofillFortnight !== 'boolean' || !departmentId) {
        showNotification('Error', 'Datos para automatización incorrectos', 'error');
        return false;
      }
      await axios.post(`${ENV.API_BACK_URL}schedule-plannings/toggle-autofill`, { autofillFortnight, departmentId });

      showNotification('Éxito', 'Configuración de automatización actualizada', 'success');
      return true;
    } catch (error) {
      console.error('Error al guardar datos de autofill', error);
      showNotification('Error al guardar datos quincena', error.response?.data?.message || error.message, 'error');
      return false;
    }
  };
  
  const contextValue = {
    loading,
    setLoading,
    loadFormData,
    loadSchedules,
    getScheduleById,
    autofillSchedule,
    toggleAutofillAlways,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getShifts,
    scheduleData,
    setScheduleData, 
    loadScheduleHistory
  };

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};