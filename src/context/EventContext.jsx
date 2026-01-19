import React, { createContext, useContext, useState } from 'react';
import { formatDateToEvent } from './../utils/date-utils';
import { categoryEvents } from '../utils/StaticData/typeEvent-utils';
const EventContext = createContext();

// hook personalizado para usar el contexto
export const useEvents = () => {
  return useContext(EventContext);
};

// Provider con la lógica y el estado
export const EventProvider = ({ initialData, showNotification, children }) => {
    
  const [eventData, setEventData] = useState(initialData);

  // ***   ***   ***   ***   ***   ***   ***
    // *** Crear
    const createEvent = async (formData) => {
      const typeEvent = categoryEvents.find(te => te.key === formData.typeEventId);
  
      const newEvent = {
        id: Date.now(), // ID temporal
        title: formData.eventName,
        start: formatDateToEvent(formData.startDate, formData.startTime),
        end: formData.endDate ? formatDateToEvent(formData.endDate, formData.endTime) : null,
        extendedProps: {
          category: formData.typeEventId,
          label: typeEvent.label,
          status: 'active',
          location: formData.location,
          repeatEvent: formData.repeatEvent,
          repeatInterval: formData.repeatInterval,
          typeEventId: formData.typeEventId,
          description: formData.description,
          comments: formData.comments,
        }
        
      };

      console.log("datos", newEvent);
  
      try {
        // Llamado a API
        // const response = await api.post('/subdepartments', newEvent); 
        // const createdRecord = await response.json(); 
  
        setEventData(prevData => { // Actualiza el estado centralizado
          return [newEvent, ...prevData]; 
        });
  
        showNotification(`Evento ${newEvent.title} creado con éxito`);
        
        return true;
      } catch (error) {
        showNotification('Error al crear el evento', 'error');
        return false;
      }
    };


    // ***   ***   ***   ***   ***   ***   ***
      // *** Actualizar
      const updateEvent = async (formData) => {
        // const departmentData =  getDepartmentNameById(formData.departmentId);
    
        // const finalData = {
        //     ...formData,
        //     departmentCode: departmentData.code, 
        //     departmentName: departmentData.departmentName, 
        // };
        
        try {
            // // Llamada a la API/Backend (onUpdate)
            // // await api.put(`/subdepartments/${finalData.id}`, finalData); 
            
            // setSubDepartmentData(prevData => { // Actualiza el estado centralizado
            //   return prevData.map(subDep => 
            //     subDep.id === finalData.id ? finalData : subDep 
            //   );
            // });

            showNotification('Evento actualizado con éxito'); 
            return true;
    
        } catch (error) {
            showNotification('Error al actualizar', 'error');
            return false;
        }
      };
  const contextValue = {
    eventData,
    setEventData,
    createEvent,
    updateEvent
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};