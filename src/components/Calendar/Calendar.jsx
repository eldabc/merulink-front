import React, { useState, useMemo, useEffect, useRef } from 'react';
import axios from 'axios'
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS } from '../../utils/StaticData/event-utils';
import esLocale from '@fullcalendar/core/locales/es';
import { capitalizeDateString } from '../../utils/date-utils';
import { filterEventsByDate } from '../../utils/calendar-utils';
import { getTodayNormalized } from '../../utils/date-utils';
import CalendarSidebar from './CalendarSidebar';
import EventContent from './EventContent';
import '../../Calendar.css';
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { categoryLegend } from '../../utils/Events/events-utils';

export default function Calendar() {

  const navigate = useNavigate();
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayNormalized);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const calendarRef = useRef(null);
  // Funciones para controlar el calendario manualmente
  const handlePrev = () => calendarRef.current.getApi().prev();
  const handleNext = () => calendarRef.current.getApi().next(); 

  // Categorías activas
  const [activeCategories, setActiveCategories] = useState({
    "meru-events": true,
    "venezuelan-holidays": true,
    "wedding-nights": true,
    "executive-mod": true,
    "meru-birthdays": true,
    "christian-holidays": true,
  });


  //  Filtrado dinámico según categorías activas
  const filteredEvents = useMemo(() => {
    return currentEvents.filter(ev =>
      activeCategories[ev.extendedProps?.category]
    );
  }, [currentEvents, activeCategories]);

  // Filtrar eventos del día seleccionado
  const eventsOfSelectedDay = useMemo(() => {
    return filterEventsByDate(filteredEvents, selectedDate);
  }, [filteredEvents, selectedDate]);


  // Cargar eventos desde backend con AXIOS
  // useEffect(() => {
  //   axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=EsFHMrENSgZMEQRfre6wUuUZMFJTaWqU")
  //     .then(res => {
  //       const loadedEvents = res.data._embedded.events.map(e => ({
  //         ...e,
  //         start: new Date(e.start),
  //         end: e.end ? new Date(e.end) : null
  //       }));
  //       console.log("loadedEvents: ", loadedEvents);
  //       setCurrentEvents(loadedEvents);
  //       // eventsOfSelectedDay(new Date(), loadedEvents);  // mostrar eventos del día actual
  //     })
  //     .catch(err => console.error("Error cargando eventos:", err));
  // }, []);
  
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
    toggleSelectedEvent(clickInfo.event);
  }
  
  // Esta función no se ejecuta nunca si usas events={filteredEvents}
  // function handleEvents(events) {
  //   setCurrentEvents(events);
  // }

  useEffect(() => {
    setCurrentEvents(INITIAL_EVENTS);
  }, []);

  function handleDateClick(arg) {
    const clickedDate = new Date(arg.date);
    clickedDate.setHours(0, 0, 0, 0);
    setSelectedDate(clickedDate);
    setSelectedEvent(null);
  }

  // Click sobre una categoría en la leyenda
  function toggleCategory(catKey) {
    setActiveCategories(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  }

  return (
    <div className='container'>
      <div className='calendar-container'>
        <div className='demo-app-main'>
          <div className='w-full flex justify-around mb-2'> 
            <div className="flex gap-2">
              <button onClick={handlePrev} className="bg-gray-700 p-2 rounded">Ant.</button>
              <button onClick={handleNext} className="bg-gray-700 p-2 rounded">Sig.</button>
            </div>
            <h2 className="text-2xl font-bold text-white">Calendario Plaza Meru</h2>

            <div className='relative'>
              <button title='Gestionar Eventos' 
                onClick={() => { navigate('/eventos'); }}
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
            dayMaxEvents={true}
            weekends={weekendsVisible}
            events={filteredEvents}
            eventContent={(arg) => <EventContent eventInfo={arg} onDotClick={toggleSelectedEvent} />}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            // initialEvents={INITIAL_EVENTS}
            // eventsSet={handleEvents}
            locale={esLocale}  
          />
        </div>
        
        <CalendarSidebar
          eventsOfSelectedDay={eventsOfSelectedDay}
          selectedEvent={selectedEvent}
          onSelectEvent={toggleSelectedEvent}
          selectedDateLabel={formattedSelectedDate}
        />
      </div>
        <div className="calendar-legend">
          {categoryLegend.map(cat => (
            <button
              key={cat.key}
              className={`legend-item ${cat.color} ${activeCategories[cat.key] ? '' : 'legend-disabled'}`}
              onClick={() => toggleCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      
    </div>
  );
}
