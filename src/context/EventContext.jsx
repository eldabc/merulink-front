import axios from 'axios';
import { ENV } from '../config/env';

// import { useLocationsHook } from '../hooks/useLocations';
import { useGlobalData } from '../context/GlobalDataContext.jsx';
import { createContext, useContext, useState, useEffect, useCallback, useMemo  } from 'react';

import { fixedEvents } from '../utils/StaticData/event-utils';
import { CATEGORY_CONFIGS, DEFAULT_CONFIG } from '../utils/eventConfig';
import { mapEventToBackend } from '../utils/mappers/eventMapper';
import { GoogleCalendarService } from '../services/googleCalendarService';

const EventContext = createContext();

// const { getLocationById } = useLocationsHook();

// hook personalizado para usar el contexto
export const useEvents = () => {
  return useContext(EventContext);
};

// Provider con la lógica y el estado
export const EventProvider = ({ showNotification, children }) => {

  const [selectedCategory, setSelectedCategory] = useState('');
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [googleEvents, setGoogleEvents] = useState('');
  const { categoryEvents } = useGlobalData();
  
  //Configuración basada en la categoría seleccionada
  const config = CATEGORY_CONFIGS[selectedCategory] || DEFAULT_CONFIG;

  const loadEvents = useCallback(async (categoryKeys = ['all'], history) => {
    setLoading(true);
    try {
      console.log("history:", history);

      let currentGoogleEvents = googleEvents;
      
      // Eventos Google una vez
      if (googleEvents === '') {
        const holidays = await GoogleCalendarService.fetchHolidays(new Date().getFullYear(), fixedEvents);
        console.log("Eventos Google", holidays);
        setGoogleEvents(holidays);
        currentGoogleEvents = holidays;
      }

      const requestAll = categoryKeys[0] === 'all' && true;
      const hasGoogle = categoryKeys.includes("google-calendar"); 
      
      // Cargar Eventos en BD
      const eventResults = await axios.get(`${ENV.API_BACK_URL}events?categoryKeys=${categoryKeys}&history=${history}`);

      const combinedEvents = (requestAll || hasGoogle) 
        ? filterGoogleDuplicates([...eventResults.data.data, ...currentGoogleEvents]) 
        : eventResults.data.data;
  
      // console.log("eventResults:", eventResults.data.data);

      setEventData(filterGoogleDuplicates(combinedEvents));
    } catch (err) {
      showNotification('Error al cargar datos:', err, 'error'); //.response.data.message
    } finally {
      setLoading(false);
    }
  }, [googleEvents]);


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
      
      // const newEvent = formattedEvents(formData);
      const newEvent = mapEventToBackend(formData, categoryEvents);
      console.log("Creado", newEvent);

      const response = await axios.post(`${ENV.API_BACK_URL}events`, newEvent);
      const newEventResponse = response.data.data;

      setEventData(prevData => {
        const newEventList = [newEventResponse, ...prevData];
        if (formData.category === 'google-calendar') return filterGoogleDuplicates(newEventList);
        return newEventList;
      });
      showNotification(`Evento ${newEventResponse.title} creado con éxito`);
      
      return true;
    } catch (error) {
      showNotification('Error al crear el evento', error.response.data.message, 'error');
      return false;
    }
  };


    // *** Actualizar
  const updateEvent = async (formData, messagge) => {
    try {
      const eventId = formData.id;
      if (!messagge) messagge = "Evento actualizado";

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

      showNotification(`${messagge} con éxito`); 
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


  const getTemplatesOnly = useCallback(async (selectedCategory) => {
    setLoadingTemplates(true);
    try {

      const onlyTemplates = await axios.get(`${ENV.API_BACK_URL}eventTemplates?selectedCategory=${selectedCategory}`);
      setTemplates(onlyTemplates.data.data);

    } catch (error) {
      console.error("Error cargando plantillas:", error.response.data.message, 'error');
    } finally {
      setLoadingTemplates(false);
    }
  }, [eventData]);


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
    loadEvents,
    refetchEvents,
    createEvent,
    createEditBankingEvents,
    handleGoogleEvents,
    updateEvent,
    deleteEvent,
    specialDays,
    templates,
    getTemplatesOnly,
    loadingTemplates,
    isTemplate,
    setIsTemplate,
    templateName,
    setTemplateName,
    selectedCategory,
    setSelectedCategory, // Para actualizarla desde el select
    config,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};