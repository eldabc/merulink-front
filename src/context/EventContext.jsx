import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

// hook personalizado para usar el contexto
export const useEvents = () => {
  return useContext(EventContext);
};

// Provider con la lógica y el estado
export const EventProvider = ({ initialData, showNotification, children }) => {
    
  const [eventData, setEventData] = useState(initialData);

  // ***   ***   ***   ***   ***   ***   ***
    // *** Crear Sub-departamento
    const createEvent = async (formData) => {
      // const departmentData =  getEventNameById(formData.departmentId);
  
      const newSubDep = {
        id: Date.now(), // ID temporal
        // code: formData.code,
        // eventName: formData.eventName,
        // departmentId: formData.departmentId,
        // departmentCode: departmentData.code,
        // departmentName: departmentData.departmentName,
        status: true
      };
  
      try {
        // Llamado a API
        // const response = await api.post('/subdepartments', newSubDep); 
        // const createdRecord = await response.json(); 
  
        setEventData(prevData => { // Actualiza el estado centralizado
          return [newSubDep, ...prevData]; 
        });
  
        showNotification(`Evento ${newSubDep.eventName} creado con éxito`);
        
        return true;
      } catch (error) {
        showNotification('Error al crear el evento', 'error');
        return false;
      }
    };


    // ***   ***   ***   ***   ***   ***   ***
      // *** Actualizar Sub-departamento
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