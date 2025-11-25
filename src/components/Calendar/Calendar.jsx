import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios'
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS } from '../../utils/event-utils';
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

  // --- Estados principales ---
  const [events, setEvents] = useState([]);             // todos los eventos desde API

  // -----------------------------------
  // 1) Cargar eventos desde backend con AXIOS
  // -----------------------------------
  useEffect(() => {
    axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=EsFHMrENSgZMEQRfre6wUuUZMFJTaWqU")
      .then(res => {
        const loadedEvents = res.data._embedded.events.map(e => ({
          ...e,
          start: new Date(e.start),
          end: e.end ? new Date(e.end) : null
        }));
        console.log("loadedEvents: ", loadedEvents);
        setCurrentEvents(loadedEvents);
        // eventsOfSelectedDay(new Date(), loadedEvents);  // mostrar eventos del día actual
      })
      .catch(err => console.error("Error cargando eventos:", err));
  }, []);

  // Filtrar eventos del día seleccionado
  const eventsOfSelectedDay = useMemo(() => {
    return filterEventsByDate(currentEvents, selectedDate);
  }, [currentEvents, selectedDate]);

  // Formatear la fecha seleccionada para mostrar en el sidebar
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

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  function handleDateClick(arg) {
    const clickedDate = new Date(arg.date);
    clickedDate.setHours(0, 0, 0, 0);
    setSelectedDate(clickedDate);
    setSelectedEvent(null);
  }

  return (
    <div className='calendar-container'>
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          // initialEvents={INITIAL_EVENTS}
          events={currentEvents}
          eventContent={(arg) => <EventContent eventInfo={arg} onDotClick={toggleSelectedEvent} />}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventsSet={handleEvents}
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
  );
}