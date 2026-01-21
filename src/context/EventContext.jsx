import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatDateToEvent } from './../utils/date-utils';
import { categoryEvents } from '../utils/StaticData/typeEvent-utils';
import { INITIAL_EVENTS } from '../utils/StaticData/event-utils';
import { useLocationsHook } from '../hooks/useLocatios';

const EventContext = createContext();

const { getLocationById } = useLocationsHook();

// hook personalizado para usar el contexto
export const useEvents = () => {
  return useContext(EventContext);
};

// Provider con la lógica y el estado
export const EventProvider = ({ showNotification, children }) => {
    
  const [eventData, setEventData] = useState(INITIAL_EVENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos desde API (preparado para migración)
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Reemplazar con llamada real a API cuando esté lista
        // const response = await fetch('http://your-api.com/events');
        // if (!response.ok) throw new Error('Error al cargar eventos');
        // const data = await response.json();
        // setEventData(data);
        
        // Por ahora usamos datos estáticos
        setEventData(INITIAL_EVENTS);
      } catch (err) {
        setError(err.message);
        showNotification('Error al cargar eventos: ' + err.message, 'error');
        // Fallback a datos estáticos en caso de error
        setEventData(INITIAL_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // *** Para recargar datos manualmente
  const refetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {

      setEventData(INITIAL_EVENTS);

    } catch (err) {
      setError(err.message);
      showNotification('Error al recargar eventos: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

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
        try {
          // El evento original debe venir en formData.originalEvent o en el formData mismo
          const eventId = formData.id || formData.originalEvent?.id;
          
          if (!eventId) {
            showNotification('Error: No se encontró el ID del evento', 'error');
            return false;
          }

          // Construir el evento actualizado con la estructura correcta
          const typeEvent = categoryEvents.find(te => te.key === formData.typeEventId);
          
          const updatedEvent = {
            id: eventId,
            title: formData.eventName,
            start: formatDateToEvent(formData.startDate, formData.startTime),
            end: formData.endDate ? formatDateToEvent(formData.endDate, formData.endTime) : null,
            extendedProps: {
              category: formData.typeEventId,
              label: typeEvent?.label || '',
              status: formData.status || 'Tentativo',
              location: formData.location || '',
              locationId: formData.locationId || '',
              repeatEvent: formData.repeatEvent || false,
              repeatInterval: formData.repeatInterval || '',
              typeEventId: formData.typeEventId,
              description: formData.description || '',
              comments: formData.comments || '',
            }
          };
          
          console.log("Evento actualizado:", updatedEvent);
          
          // Llamada a la API/Backend (onUpdate)
          // await api.put(`/events/${eventId}`, updatedEvent); 
          
          setEventData(prevData => {
            return prevData.map(event => 
              event.id === eventId ? updatedEvent : event 
            );
          });

          showNotification('Evento actualizado con éxito'); 
          return true;
    
        } catch (error) {
          console.error('Error al actualizar evento:', error);
          showNotification('Error al actualizar: ' + error.message, 'error');
          return false;
        }
      };
  const contextValue = {
    eventData,
    setEventData,
    loading,
    error,
    refetchEvents,
    createEvent,
    updateEvent
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};