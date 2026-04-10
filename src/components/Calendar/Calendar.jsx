import { useState, useMemo, useRef, useEffect } from 'react';
import { useEvents } from "../../context/EventContext";
import { useNavigate } from 'react-router-dom';

import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import { capitalizeDateString } from '../../utils/date-utils';
import { filterEventsByDate } from '../../utils/calendar-utils';
import { getTodayNormalized } from '../../utils/date-utils';
import { categoryLegend } from '../../utils/Events/events-utils';

import CalendarSidebar from './CalendarSidebar';
import EventContent from './EventContent';
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import '../../Calendar.css';

export default function Calendar() {

  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayNormalized);
  const [currentTitle, setCurrentTitle] = useState('');
  const { eventData, loadEvents, refetchEvents, specialDays } = useEvents();
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  // Funciones para controlar el calendario manualmente
  const handlePrev = () => calendarRef.current.getApi().prev();
  const handleNext = () => calendarRef.current.getApi().next(); 

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {      
    loadEvents();
  }, []);

  const handleDatesSet = (dateInfo) => {
    const yearInView = dateInfo.view.currentStart.getFullYear();

    // Si el año cambia
    if (yearInView !== currentYear) {
      setCurrentYear(yearInView);
      refetchEvents(yearInView);
    }
    
    setCurrentTitle(dateInfo.view.title);
  };

  // Categorías activas
  const [activeCategories, setActiveCategories] = useState({
    "meru-events": true,
    "wedding-nights": true,    
    "dinner-heights": true,
    "ve-holidays": true,
    "google-calendar": true,
    "meru-birthdays": true,
    "executive-mod": true,
    "banking-mondays": true,
  });


  //  Filtrado dinámico según categorías activas
  const filteredEvents = useMemo(() => {
    return eventData.filter(ev => activeCategories[ev.extendedProps?.category.key])
                    .map(ev => ({
                        ...ev,
                        // Darle el stilo personalizado según categoría
                        className: ev.extendedProps.category.color || '' 
                    }));
  }, [eventData, activeCategories]);


  // Filtrar eventos del día seleccionado
  const eventsOfSelectedDay = useMemo(() => {
    return filterEventsByDate(filteredEvents, selectedDate);
  }, [filteredEvents, selectedDate]);

  
  // Formatear la fecha seleccionada para mostrar en sidebar
  const formattedSelectedDate = useMemo(() => {
    const today = getTodayNormalized();
    const selected = getTodayNormalized();
    selected.setTime(selectedDate.getTime());

    if (selected.getTime() === today.getTime()) {
      return 'Hoy';
    }

    const formatted = formatDate(selectedDate, {
      locale: esLocale,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return capitalizeDateString(formatted);
  }, [selectedDate]);


  // Handlers
  function toggleSelectedEvent(eventInfo) {
    setSelectedEvent((prev) =>
      prev?.id === eventInfo.id ? null : eventInfo
    );
  }


  function handleEventClick(clickInfo) {
    if (clickInfo.event.url) clickInfo.jsEvent.preventDefault();
    
    const eventDate = new Date(clickInfo.event.start);

    eventDate.setHours(0, 0, 0, 0);
    setSelectedDate(eventDate);
    setSelectedEvent(clickInfo.event);
  }

  function handleDateClick(arg) {
    const clickedDate = new Date(arg.date);
    clickedDate.setHours(0, 0, 0, 0);
    setSelectedDate(clickedDate);
    setSelectedEvent(null);
  }

  const allEventsForSidebar = useMemo(() => {
    // El sidebar siempre muestra los eventos locales filtrados del día seleccionado
    // de la misma forma que el calendario los filtra, asegurando sincronización
    return eventsOfSelectedDay;
  }, [eventsOfSelectedDay]);

  // Memoizar eventSources para evitar recrear el array en cada render
  const eventSources = useMemo(() => {
    return [
      { 
        events: filteredEvents
      }
    ];
  }, [filteredEvents]);

  // Click sobre una categoría en la leyenda
  function toggleCategory(catKey) {
    setActiveCategories(prev => {
      const newCategories = { ...prev };
      const shouldActivate = !catKey.every(key => prev[key]);
      
      catKey.forEach(key => {
        newCategories[key] = shouldActivate;
      });
      
      return newCategories;
    });
  }

  const handleDayCellClassNames = (arg) => {
    if (!arg.date) return [];
    
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, '0');
    const day = String(arg.date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    if (specialDays && specialDays[dateStr]) {
      return ['is-special-day'];
    }
    return [];
  };


  return (
    <div className='container'>
      <div className='calendar-container'>
        <div className='demo-app-main'>
          <div className='w-full flex flex-col md:flex-row items-center justify-around gap-4 mb-2'> 
            <div className="flex gap-2">
              <button onClick={handlePrev} className="bg-gray-700 p-2 rounded">Ant.</button>
              <button onClick={handleNext} className="bg-gray-700 p-2 rounded">Sig.</button>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className="text-lg md:text-2xl font-bold text-white">Calendario Plaza Meru</h3>
              <span className="text-lg md:text-2xl font-bold text-white capitalize">
                {currentTitle}
              </span>
            </div>
            <div className='relative'>
              <button title='Gestionar Eventos' 
                onClick={() => { navigate('/eventos/eventos-meru'); }}
                className='flex items-center bg-gray-600 p-1.5 rounded-xl hover:text-[#9fd8ff] transition-colors'
              >
                <Cog6ToothIcon className="size-6 text-gray-300" />
              </button>
            </div>
          </div>
         
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            ref={calendarRef}
            headerToolbar={false}
            initialView='dayGridMonth'
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={5}
            weekends={weekendsVisible}
            eventSources={eventSources}
            dayCellClassNames={handleDayCellClassNames}
            eventContent={(arg) => <EventContent eventInfo={arg} />} // Personalización de eventos (No se esta usando)
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            locale={esLocale}
            datesSet={handleDatesSet}
            moreLinkClick="none"
          />
        </div>
        
        <CalendarSidebar
          eventsOfSelectedDay={allEventsForSidebar}
          selectedEvent={selectedEvent}
          onSelectEvent={toggleSelectedEvent}
          selectedDateLabel={formattedSelectedDate}
        />
      </div>
        <div className="calendar-legend">
          {categoryLegend
            .map(cat => {
              // Verificar si todos los keys de la categorías están activos
              const allKeysActive = cat.key.every(k => activeCategories[k]);
              
              return (
                <button
                  key={cat.key.join('-')}
                  className={`skip-style-btn legend-item ${cat.color} ${allKeysActive ? '' : 'legend-disabled'}`}
                  onClick={() => toggleCategory(cat.key)}
                >
                  {cat.label}
                </button>
              );
            })}
        </div>
      
    </div>
  );
}
