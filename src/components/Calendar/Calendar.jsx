import React, { useState, useMemo, useEffect } from 'react';
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

export default function Calendar() {

  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayNormalized);

  // Categorías activas
  const [activeCategories, setActiveCategories] = useState({
    "meru-events": true,
    "venezuelan-holidays": true,
    "event-wedding": true,
    "event-executive": true,
    "meru-birthday": true,
    "christian-holidays": true,
  });

  // Categorías para la leyenda
  const categoryLegend = [
    { key: "meru-events", label: "Eventos Merú", color: "meru-events" },
    { key: "meru-birthday", label: "Cumpleaños Merú", color: "meru-birthday" },
    { key: "event-wedding", label: "Plan Noche de Bodas", color: "event-wedding" },
    { key: "event-executive", label: "Ejecutivos MOD", color: "event-executive" },
    { key: "venezuelan-holidays", label: "Festivos Venezolanos", color: "venezuelan-holidays" },
    { key: "christian-holidays", label: "Festivos Cristianos", color: "christian-holidays" }
  ];

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
        <div className='demo-app-main'><h2 className="title">Calendario Plaza Meru</h2>
          <div className='flex flex-row absolute mb-2 bg-gray-600 p-1.5 rounded-xl hover:text-[#9fd8ff]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: ''
            }}
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
