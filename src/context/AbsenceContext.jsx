import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState } from 'react';
import { useNotification } from './NotificationContext';

const AbsenceContext = createContext();

export const useAbsences = () => {
  return useContext(AbsenceContext);
};

// Provider con la lógica y el estado de las ausencias (vacaciones / reposo médico) de los empleados
export const AbsenceProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const [absences, setAbsences] = useState([]);
  const [loadingAbsence, setLoadingAbsence] = useState(false);

  // Listar ausencias de un empleado
  const loadAbsences = async (employeeId) => {
    setLoadingAbsence(true);
    try {
      if (!employeeId) return [];

      const response = await axios.get(`${ENV.API_BACK_URL}vacations?employee_id=${employeeId}`);
      setAbsences(response.data.data);
      return response.data.data;
    } catch (error) {
      showNotification('Error al cargar ausencias', error?.response?.data?.message, 'error');
      return [];
    } finally {
      setLoadingAbsence(false);
    }
  };

  // Registrar
  const createAbsence = async (formData) => {
    setLoadingAbsence(true);
    try {
      if (!formData.employee_id) {
        showNotification('Error:', 'No se encontró el ID del Empleado', 'error');
        return false;
      }

      const response = await axios.post(`${ENV.API_BACK_URL}vacations`, formData);
      const newAbsence = response.data.data;

      setAbsences((prevData) => [newAbsence, ...prevData]);

      showNotification('Éxito', response?.data?.message || 'Ausencia registrada correctamente', 'success');
      return true;
    } catch (error) {
      console.log('error al registrar ausencia', error);
      showNotification('Error al registrar la ausencia', error?.response?.data?.message, 'error');
      return false;
    } finally {
      setLoadingAbsence(false);
    }
  };

  // Actualizar
  const updateAbsence = async (id, formData) => {
    setLoadingAbsence(true);
    try {
      if (!id) {
        showNotification('Error:', 'No se encontró el ID de la ausencia', 'error');
        return false;
      }

      const response = await axios.put(`${ENV.API_BACK_URL}vacations/${id}`, formData);
      const updated = response.data.data;

      setAbsences((prevData) => prevData.map((a) => (a.id === updated.id ? updated : a)));

      showNotification('Éxito', response?.data?.message || 'Ausencia actualizada correctamente', 'success');
      return true;
    } catch (error) {
      console.log('error al actualizar ausencia', error);
      showNotification('Error al actualizar la ausencia', error?.response?.data?.message, 'error');
      return false;
    } finally {
      setLoadingAbsence(false);
    }
  };

  const contextValue = {
    absences,
    setAbsences,
    loadingAbsence,
    loadAbsences,
    createAbsence,
    updateAbsence,
  };

  return (
    <AbsenceContext.Provider value={contextValue}>
      {children}
    </AbsenceContext.Provider>
  );
};
