import React, { createContext, useContext, useState, useEffect, useCallback, useMemo  } from 'react';
import { useLocationsHook } from '../hooks/useLocations';
import { formatDateToEvent } from './../utils/date-utils';
import { categoryEvents } from '../utils/StaticData/typeEvent-utils';
import { INITIAL_EVENTS, fixedEvents } from '../utils/StaticData/event-utils';

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
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const getTemplatesOnly = async (selectedCategory) => {
    setLoadingTemplates(true);
    try {
      // API const response = await fetch('/api/templates');
      const onlyTemplates = INITIAL_EVENTS.filter(ev => ev.extendedProps?.isTemplate === true && ev.extendedProps.category === selectedCategory);
      
      setTemplates(onlyTemplates);
    } catch (error) {
      console.error("Error cargando plantillas:", error);
    } finally {
      setLoadingTemplates(false);
    }
  };

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
        return data.items.map(event => {
          // Extrae el formato MM-DD
          const dateStr = event.start.date || event.start.dateTime;
          const monthDay = dateStr.substring(5, 10); 

          // Verifica si MM-DD está en eventos fijos
          const isFixed = fixedEvents.includes(monthDay);

          return {
            id: event.id,
            title: event.summary,
            start: event.start.date ? event.start.date + 'T00:00:00' : event.start.dateTime,
            allDay: !!event.start.date,
            extendedProps: {
              category: 'google-calendar',
              label: 'Calendario Google',
              description: event.description || 'Feriado oficial de Venezuela',
              externalDate: true,
              repeatEvent: true, 
              repeatInterval: isFixed ? 'Anual' : 'Aleatorio',
              isFixed: isFixed,
              createdBy: 'Calendario Google'
            },
            display: 'block',
            className: 'g-calendar-ve-holidays'
          };
        });
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

      const combinedEvents = [...INITIAL_EVENTS, ...googleHolidays];
      setEventData(filterGoogleDuplicates(combinedEvents));
    } catch (err) {
      showNotification('Error al cargar datos', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('UseEffect EventContext');
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
    try {
      
      const newEvent = formattedEvents(formData);
      console.log("Creado", newEvent);

      // Llamado a API
      // const response = await api.post('/subdepartments', newEvent); 
      // const createdRecord = await response.json(); 

      setEventData(prevData => {
        const newEventList = [newEvent, ...prevData];
        if (formData.category === 'google-calendar') return filterGoogleDuplicates(newEventList);
        return newEventList;
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

  const filterGoogleDuplicates = (allEvents) => {
    // Identifica fechas de eventos Google que se han registrado
    const registeredDates = allEvents
      .filter(ev => ev.extendedProps?.category === 'google-calendar' && !ev.extendedProps?.externalDate)
      .map(ev => ev.start.split('T')[0]);

    return allEvents.filter(ev => {
      if (ev.extendedProps?.category === 'google-calendar' && ev.extendedProps?.externalDate) {
        const dateKey = ev.start.split('T')[0];
        // El evento pasa solo si su fecha NO está en la lista de registrados
        return !registeredDates.includes(dateKey);
      }

      return true;
    });
  };

  // Encontrar Eventos Fijos
  const findFixedEvents = (formData) => {
    const formDate = new Date(formData.startDate).toISOString().split("T")[0]
    const dayMonth = formDate.substring(5, 10); // Extrae "MM-DD"
      
    return fixedEvents.includes(dayMonth);
  }

  // Armado JSON Events
  const formattedEvents = (formData) => {

   let isFixed = false;
   
   const typeEvent = categoryEvents.find(te => te.key === formData.category);
   const getEventLocationById = formData.locationId ? getLocationById(formData.locationId) : null;
   
   let allDay = false;
   let labelCategory = typeEvent.label;

   if (formData.category === 'meru-birthdays' || formData.category === 'google-calendar' || formData.category === 'executive-mod' 
       || formData.category === 'banking-mondays' || formData.category === 've-holidays'
      ) { allDay = true; }

   if (formData.category === 'google-calendar') {
    isFixed = findFixedEvents(formData); 
    labelCategory = 'Festivo Almacenamiento Local'
   }

    return {
      id: Date.now(), // ID temporal
      title: formData.eventName,
      start: formatDateToEvent(formData.startDate, formData.startTime),
      end: formData.endDate ? formatDateToEvent(formData.endDate, formData.endTime) : null,
      allDay: allDay,
      extendedProps: {
        category: formData.category,
        label: labelCategory,
        status: formData.status,
        locationId: formData.locationId,
        locationName: getEventLocationById ? getEventLocationById.label : '',
        repeatEvent: formData.repeatEvent,
        repeatInterval: formData.repeatInterval,
        createAlert: formData.createAlert,
        coloringDay: formData.coloringDay,
        description: formData.description,
        comments: formData.comments,
        isFixed: isFixed,
        createdBy: formData.extendedProps.createdBy,
      },
      className: formData.category
      
    };
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
      showNotification('Error al procesar el calendario bancario', error.message);
      return false;
    }
  };

  // Eventos de Google
  const handleGoogleEvents = async (formData) => {
    try {

        const existsGoogleEvent = eventData.some(event => {
        
          const formDate = new Date(formData.startDate).toISOString().split("T")[0]; 
          const eventDate = new Date(event.start).toISOString().split("T")[0]; 
            
          // if (formDate === eventDate) console.log("aqui", formDate === eventDate); 
          
          return eventDate === formDate && event.extendedProps?.category === 'google-calendar' && !event.extendedProps?.externalDate;
      });

      if (existsGoogleEvent) {
        // console.log("editamos");
        await updateEvent(formData);
        return true;
      } else {
        // console.log("registramos");
        await createEvent(formData);
        return true;
      }
    } catch (error) {
      showNotification('Error en evento: ' + error.message, 'error');
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

      const updatedEvent = formattedEvents(formData);
      console.log("Actualizado:", updatedEvent);
      
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

  const specialDays = useMemo(() => {
  return eventData
      .filter(event => event.extendedProps?.coloringDay === true)
      .reduce((acc, event) => {
        const dateKey = event.start.split('T')[0];
        acc[`${dateKey}`] = event.backgroundColor || '#892020';
        return acc;
      }, {});
  }, [eventData]);

  const contextValue = {
    eventData,
    setEventData,
    loading,
    error,
    refetchEvents,
    createEvent,
    createEditBankingEvents,
    handleGoogleEvents,
    updateEvent,
    deleteEvent,
    specialDays,
    templates,
    getTemplatesOnly,
    loadingTemplates
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};