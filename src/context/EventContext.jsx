import React, { createContext, useContext, useState, useEffect, useCallback  } from 'react';
import { useLocationsHook } from '../hooks/useLocations';
import { formatDateToEvent } from './../utils/date-utils';
import { categoryEvents } from '../utils/StaticData/typeEvent-utils';
import { INITIAL_EVENTS } from '../utils/StaticData/event-utils';

const EventContext = createContext();

const { getLocationById } = useLocationsHook();

// hook personalizado para usar el contexto
export const useEvents = () => {
  return useContext(EventContext);
};

// Provider con la lógica y el estado
export const EventProvider = ({ showNotification, children }) => {
    
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Traer datos de Google manualmente
  const fetchGoogleEvents = async (year) => {
    const calendarId = 'es.ve#holiday@group.v.calendar.google.com';
    const timeMin = `${year}-01-01T00:00:00Z`;
    const timeMax = `${year}-12-31T23:59:59Z`;


    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${API_KEY}`+
                `&timeMin=${timeMin}` +
                `&timeMax=${timeMax}` +
                `&singleEvents=true` + // Divide eventos recurrentes en instancias individuales
                `&orderBy=startTime`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items) {
        return data.items.map(event => ({
          id: event.id,
          title: event.summary,
          start: event.start.date || event.start.dateTime,
          allDay: !!event.start.date,
          extendedProps: {
            category: 'google-calendar',
            label: 'Calendario Google',
            description: event.description || 'Feriado oficial de Venezuela',
          },
          display: 'block',
          className: 'g-calendar-ve-holidays'
        }));
      }
      return [];
    } catch (err) {
      console.error("Error cargando Google Calendar:", err);
      return [];
    }
  };

  const loadEvents = useCallback(async (year = new Date().getFullYear()) => {
    setLoading(true);
    try {
      // Cargar Google y Local al mismo tiempo
      const googleHolidays = await fetchGoogleEvents(year);

      setEventData([...INITIAL_EVENTS, ...googleHolidays]);
    } catch (err) {
      showNotification('Error al cargar datos', err.message);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // *** Para recargar datos manualmente
  const refetchEvents = async (year) => {
    
    try {

     await loadEvents(year);

    } catch (err) {
      setError(err.message);
      showNotification('Error al recargar eventos: ' + error);
    }
  };


  // *** Crear
  const createEvent = async (formData) => {

    const typeEvent = categoryEvents.find(te => te.key === formData.category);
    const getEventLocationById = formData.locationId ? getLocationById(formData.locationId) : null;

    const newEvent = {
      id: Date.now(), // ID temporal
      title: formData.eventName,
      start: formatDateToEvent(formData.startDate, formData.startTime),
      end: formData.endDate ? formatDateToEvent(formData.endDate, formData.endTime) : null,
      extendedProps: {
        category: formData.category,
        label: typeEvent.label,
        status: formData.status,
        locationId: formData.locationId,
        locationName: getEventLocationById ? getEventLocationById.label : '',
        repeatEvent: formData.repeatEvent,
        repeatInterval: formData.repeatInterval,
        createAlert: formData.createAlert,
        coloringDay: formData.coloringDay,
        description: formData.description,
        comments: formData.comments,
      },
      className: formData.category
      
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

  //*** Mapeo Banking array
  const formattedBankingEvents = (eventsArray, year) => {
    
    return eventsArray.map((event, index) => ({
        id: Date.now() + index,
        title: event.title,
        start: event.start + 'T00:00:00',
        end: null, 
        allDay: true,
        extendedProps: {
          category: 'banking-mondays',
          label: 'Lunes Bancarios',
          status: '',
          description: `Feriado Bancario - Año ${year}`,
        },
        className: 'banking-mondays'
      }));

  }

  // *** Crear/Editar Lunes Bancarios
  const createEditBankingEvents = async (eventsArray, year, mode) => {
    try {

      const editMode = mode === 'edit';
      const msg = editMode ? `actualizado` : `creado`;
      const formattedEvents = formattedBankingEvents(eventsArray, year);

      setEventData(prevData => {
      
        let oldData = [...prevData];
      
        if (editMode) {
          // Eliminamos eventos previos de lunes bancarios 
          oldData = prevData.filter(ev => {
            const isBanking = ev.extendedProps?.category === 'banking-mondays';
            const isSameYear = new Date(ev.start).getFullYear() === parseInt(year);
            
            return !(isBanking && isSameYear);
          });
        }

        return [...formattedEvents, ...oldData];
    });
      
      showNotification(`Calendario Bancario ${year} ${msg}`);
      return true;
    } catch (error) {
      showNotification('Error al procesar el calendario bancario', 'error');
      return false;
    }
  };



  // *** Actualizar
  const updateEvent = async (formData) => {
    try {
      const eventId = formData.id;
      
      if (!eventId) {
        showNotification('Error: No se encontró el ID del evento', 'error');
        return false;
      }

      // Construir el evento actualizado con la estructura correcta
      const typeEvent = categoryEvents.find(te => te.key === formData.category);
      const getEventLocationById = formData.locationId ? getLocationById(formData.locationId) : null;

      const updatedEvent = {
        id: eventId,
        title: formData.eventName,
        start: formatDateToEvent(formData.startDate, formData.startTime),
        end: formData.endDate ? formatDateToEvent(formData.endDate, formData.endTime) : null,
        extendedProps: {
          category: formData.category,
          label: typeEvent?.label,
          status: formData.status,
          locationId: formData.locationId,
          locationName: getEventLocationById ? getEventLocationById.label : '',
          repeatEvent: formData.repeatEvent,
          repeatInterval: formData.repeatInterval,
          createAlert: formData.createAlert,
          coloringDay: formData.coloringDay,
          description: formData.description,
          comments: formData.comments,
        },
        className: formData.category
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

  // *** Eliminar
  const deleteEvent = async (id) => {
    try {
      // const response = await fetch(`https://miapi.com/events/${id}`, { method: 'DELETE' });
      // if (!response.ok) throw new Error('No se pudo eliminar en el servidor');

      setEventData(prevData => {
        return prevData.filter(ev => ev.id !== id);
      });

      showNotification(`Evento eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar el calendario', 'error');
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
    createEditBankingEvents,
    updateEvent,
    deleteEvent
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};