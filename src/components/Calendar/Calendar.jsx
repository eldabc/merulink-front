import React, { useState, useMemo, useEffect, useRef } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { EventProvider, useEvents } from "../../context/EventContext";
import { useNotification } from "../../context/NotificationContext";  
import { capitalizeDateString } from '../../utils/date-utils';
import { filterEventsByDate } from '../../utils/calendar-utils';
import { getTodayNormalized } from '../../utils/date-utils';
import CalendarSidebar from './CalendarSidebar';
import EventContent from './EventContent';
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { categoryLegend } from '../../utils/Events/events-utils';
import esLocale from '@fullcalendar/core/locales/es';
import '../../Calendar.css';

export default function Calendar() {

  const { showNotification } = useNotification();
  return (
    <EventProvider showNotification={showNotification}>
      <EventsCalendar />
    </EventProvider>
  );
}

function EventsCalendar() {
  const navigate = useNavigate();
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayNormalized);
  const calendarRef = useRef(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const { eventData } = useEvents();

  // Funciones para controlar el calendario manualmente
  const handlePrev = () => calendarRef.current.getApi().prev();
  const handleNext = () => calendarRef.current.getApi().next(); 

  // Categorías activas
  const [activeCategories, setActiveCategories] = useState({
    "meru-events": true,
    "ve-holidays": true,
    "wedding-nights": true,
    "executive-mod": true,
    "meru-birthdays": true,
    "christian-holidays": true,
  });


  //  Filtrado dinámico según categorías activas
  const filteredEvents = useMemo(() => {
    return eventData.filter(ev =>
      activeCategories[ev.extendedProps?.category]
    );
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
    toggleSelectedEvent(clickInfo.event);
  }

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

const API_KEY = import.meta.env.API_KEY;
  return (
    <div className='container'>
      <div className='calendar-container'>
        <div className='demo-app-main'>
          <div className='w-full flex justify-around mb-2'> 
            <div className="flex gap-2">
              <button onClick={handlePrev} className="bg-gray-700 p-2 rounded">Ant.</button>
              <button onClick={handleNext} className="bg-gray-700 p-2 rounded">Sig.</button>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className="text-2xl font-bold text-white">Calendario Plaza Meru</h3>
              <span className="text-2xl font-bold text-white capitalize">
                {currentTitle}
              </span>
            </div>
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
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
            ref={calendarRef}
            headerToolbar={false}
            initialView='dayGridMonth'
            googleCalendarApiKey={API_KEY}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            // events={filteredEvents}
            eventSources={[
              { 
                events: filteredEvents
              },
              {
                googleCalendarId: 'es.ve#holiday@group.v.calendar.google.com',
                className: 'g-calendar-ve-holidays',
                display: 'block'
              }
            ]}
            eventContent={(arg) => <EventContent eventInfo={arg} onDotClick={toggleSelectedEvent} />}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            locale={esLocale}
            datesSet={(arg) => {
              setCurrentTitle(arg.view.title);
            }} 
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
          {categoryLegend
            .filter(cat => !cat.itsMixedCategory)
            .map(cat => (
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
