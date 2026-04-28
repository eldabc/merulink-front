import axios from 'axios';
import { ENV } from '../config/env';

import { useGlobalData } from '../context/GlobalDataContext.jsx';
import { createContext, useContext, useState, useEffect, useCallback, useMemo  } from 'react';

import { fixedEvents } from '../utils/StaticData/event-utils';
import { CATEGORY_CONFIGS, DEFAULT_CONFIG, EVENT_CAT } from '../utils/eventConfig';
import { mapEventToBackend } from '../utils/mappers/eventMapper';
import { mapBankingEventToBackend } from '../utils/mappers/bankingEventMapper';
import { GoogleCalendarService } from '../services/googleCalendarService';

const EventContext = createContext();

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
  const [eventResults, setEventResults] = useState('');
  const [initialLoadCategory, setInitialLoadCategory] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { categoryEvents } = useGlobalData();

  const config = CATEGORY_CONFIGS[selectedCategory] || DEFAULT_CONFIG;
  

  const loadEvents = useCallback(async ({ 
    categoryKeys = ['all'], 
    history = false, 
    year = currentYear, 
    anyDateInCategory = false 
  } = {}) => {
    setLoading(true);
    try {
      console.log("History?", history);

      let combinedEvents = [];
      let currentGoogleEvents = googleEvents;
      const requestAll = categoryKeys[0] === 'all' && true;
      const hasGoogle = categoryKeys.includes("google-calendar");
      
      // Carga Eventos de BD
      const eventResults = await axios.get(`${ENV.API_BACK_URL}events?categoryKeys=${categoryKeys}&history=${history}&anyDateInCategory=${anyDateInCategory}`);
      const eventResultsData = eventResults.data.data;

      // Eventos Google una vez
      if (googleEvents === '' || currentYear !== year) {
        const holidays = await GoogleCalendarService.fetchHolidays(year, fixedEvents);
        console.log("Eventos Google", holidays);
        currentGoogleEvents = holidays;
        setGoogleEvents(currentGoogleEvents);
      }

      if (requestAll || hasGoogle) {
        const filteredGoogleDuplicates = filterGoogleDuplicates(eventResultsData, currentGoogleEvents);
        console.log("Filtrados Google", filteredGoogleDuplicates);

        combinedEvents = [...eventResultsData, ...filteredGoogleDuplicates];
      } else {
        combinedEvents = eventResultsData;
      }
  
      // console.log("EventResults:", eventResultsData);
      // console.log("combinedEvents:", combinedEvents);
      
      setEventData(combinedEvents);
      setEventResults(eventResultsData);
      setInitialLoadCategory(JSON.stringify(categoryKeys));
      
    } catch (err) {
      console.log("error", err);
      showNotification('Error al cargar datos:', err.response.data.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [googleEvents]);


  // *** Recargar datos manualmente
  const refetchEvents = async (year) => {
    
    try {
      console.log("Refresh", year);
      await loadEvents({ categoryKeys: ['all'], year: year});

    } catch (err) {
      setError(err.message);
      showNotification('Error al recargar eventos: ', error, 'error');
    }
  };


  // *** Crear
  const createEvent = async (formData) => {
    try {
      
      const newEvent = mapEventToBackend(formData, categoryEvents);
      console.log("Creado", newEvent);

      const response = await axios.post(`${ENV.API_BACK_URL}events`, newEvent);
      const newEventResponse = response.data.data;
      const categoryEvent = newEventResponse.extendedProps.category.key;
      // console.log("newEventResponse", newEventResponse)

      // Si la categoría no cambió solo seteamos
      if (initialLoadCategory.includes(categoryEvent)) {
         if (formData.category === 'google-calendar') {
            const filteredGoogleDuplicates = filterGoogleDuplicates([newEventResponse], googleEvents);
            // console.log("filteredGoogleDuplicates", filteredGoogleDuplicates)
            setEventData([newEventResponse, ...eventResults, ...filteredGoogleDuplicates ]);

          } else {
            setEventData(prevData => {
              const newEventList = [newEventResponse, ...prevData];
              // console.log("newEventList", newEventList);
              return newEventList;
            });
          }

      }
      
      showNotification(`Evento ${newEventResponse.title} creado con éxito`);
      
      return true;
    } catch (error) {
      console.log("error", error)
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
        showNotification('Error:', 'No se encontró el ID del evento', 'error');
        return false;
      }

      const updatedEvent = mapEventToBackend(formData, categoryEvents);
      console.log("Actualizado:", updatedEvent);
      
      const response = await axios.put(`${ENV.API_BACK_URL}events/${eventId}`, updatedEvent);
      const editEventResponse = response.data.data; 
      
      setEventData(prevData => {
        return prevData.map(event => 
          event.id === eventId ? editEventResponse : event 
        );
      });

      showNotification(`${editEventResponse.title} ${messagge} con éxito`); 
      return true;

    } catch (error) {
      // console.log("eror",error)
      showNotification('Error al actualizar: ', error.response.data.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deleteEvent = async (event) => {
    try {
      const eventId = event.id;

      if (!eventId) {
        showNotification('Error:', 'No se encontró el ID del evento', 'error');
        return false;
      }
      
      await axios.delete(`${ENV.API_BACK_URL}events/${eventId}`);

      setEventData(prevData => {
        return prevData.filter(ev => ev.id !== eventId);
      });

      showNotification(`Evento ${event.title} eliminado con éxito`);
      return true;
    } catch (error) {
      showNotification('Error al eliminar el calendario', error.response.data.message, 'error');
      return false;
    }
  };


  const loadEventById = async (id) => {
    setLoading(true);
    try {

      const event = await axios.get(`${ENV.API_BACK_URL}events/${id}`);
      return event.data.data;

    } catch (error) {
      console.log("error", error)
      console.error("Error al cargar evento:", error.response.data.message, 'error');
    } finally {
      setLoading(false);
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


  const filterGoogleDuplicates = (registeredEvents, currentGoogleEvents) => {

    // Identifica fechas de eventos Google que se han registrado
    const registeredDates = registeredEvents
      .filter(ev => ev.extendedProps?.category?.key === 'google-calendar')
      .map(ev => ev.start.split('T')[0]);
      // console.log("registeredDates", registeredDates.length > 0);

      const filteredGoogleEvents = currentGoogleEvents.filter(ev => {
        const dateKey = ev.start.split('T')[0];
        return !registeredDates.includes(dateKey); // El evento pasa solo si su fecha NO está en la lista de registrados
      });
      
      setGoogleEvents(filteredGoogleEvents);
      // console.log("filteredGoogleEvents", filteredGoogleEvents);
      return filteredGoogleEvents;

  };

  // *** Crear/Editar Lunes Bancarios
  const createEditBankingEvents = async (eventsArray, year, mode) => {
    try {

      const editMode = mode === 'edit';
      const msg = editMode ? `actualizado` : `creado`;
      const eventsToSave = mapBankingEventToBackend(eventsArray, year);
      console.log("eventsToSave", eventsToSave)
      const response =await axios.post(`${ENV.API_BACK_URL}events/batch-banking`, eventsToSave);
      
      // Si la categoría no cambió solo seteamos
      if (initialLoadCategory.includes(EVENT_CAT.B_MONDAYS.key)) {
        setEventData(response.data.data)
      }
      
      showNotification(`Calendario Bancario ${year} ${msg}`);
      return true;
    } catch (error) {
      showNotification('Error al procesar el calendario bancario', error.message, 'error');
      return false;
    }
  };

  const deleteEventTemplate = async (eventTemplate) => {
    try {

      const eventId = eventTemplate.id;
      console.log("eventTemplate for delete", eventTemplate)
      if (!eventId) {
        showNotification('Error:', 'No se encontró el ID de la plantilla', 'error');
        return false;
      }

      await axios.delete(`${ENV.API_BACK_URL}eventTemplates/${eventId}`);

      setTemplates(prevData => {
        return prevData.filter(ev => ev.id !== eventId);
      });

      showNotification(`Plantilla ${eventTemplate?.event?.title} eliminada con éxito`);
      return true;

    } catch (error) {
      showNotification('Error al eliminar la plantilla', error.message, 'error');
    }
  };

  // Eventos de Google
  const handleGoogleEvents = async (formData) => {
    try {
      // El ID de google es string
      const isCompoundId = isNaN(formData?.id); 

      if (isCompoundId) {
        await createEvent(formData);
        return true;
      } else {
        await updateEvent(formData);
        return true;
      }

    } catch (error) {
      showNotification('Error en evento:', error.message, 'error');
      return false;
    }
  };


  const specialDays = useMemo(() => {
    // const events = eventData || [];
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
    deleteEventTemplate,
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
    initialLoadCategory,
    setInitialLoadCategory,
    loadEventById
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};