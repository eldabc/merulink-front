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

  const contextValue = {
    absences,
    setAbsences,
    loadingAbsence,
    createAbsence,
  };

  return (
    <AbsenceContext.Provider value={contextValue}>
      {children}
    </AbsenceContext.Provider>
  );
};
