import React, { useState, useMemo } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from '../utils/event-utils'
import esLocale from '@fullcalendar/core/locales/es';
import '../Calendar.css';

// Función para capitalizar fechas en español
function capitalizeDateString(dateString) {
  if (!dateString) return '';
  
  // Preposiciones y palabras que NO se capitalizan (excepto si son la primera palabra)
  const noCapitalize = ['de', 'del', 'y', 'la', 'el', 'en', 'a', 'por', 'para', 'con', 'sin'];
  const words = dateString.split(/\s+/);
  
  // Capitalizar cada palabra según las reglas
  const capitalized = words.map((word, index) => {
    // Si es la primera palabra, siempre capitalizar
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    
    // Si es una preposición en minúscula, mantenerla en minúscula
    const lowerWord = word.toLowerCase();
    if (noCapitalize.includes(lowerWord)) {
      return lowerWord;
    }
    
    // Para otras palabras, capitalizar solo la primera letra
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return capitalized.join(' ');
}

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])

  // Almacena el evento clicado para mostrarlo en el Sidebar
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estado para el día seleccionado (inicialmente hoy)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log("Hoy:", today);

    return today;
  });

  // Filtrar eventos del día seleccionado
  const eventsOfSelectedDay = useMemo(() => {
    return currentEvents.filter((event) => {
      const eventStart = event.start ? new Date(event.start) : null;
      if (!eventStart) return false;

      const eventDate = new Date(eventStart);
      eventDate.setHours(0, 0, 0, 0);

      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      return eventDate.getTime() === selected.getTime();
    });
  }, [currentEvents, selectedDate]);

  // Maneja el clic en el evento y actualiza el estado
  function toggleSelectedEvent(eventInfo) {
    setSelectedEvent((prev) =>
      prev?.id === eventInfo.id ? null : eventInfo
    )
  }

  function handleEventClick(clickInfo) {
    toggleSelectedEvent(clickInfo.event)
  }

  function handleEvents(events) {
    setCurrentEvents(events) // actualiza el estado en react
  }

  // Maneja el clic en un día del calendario
  function handleDateClick(arg) {
    const clickedDate = new Date(arg.date);
    clickedDate.setHours(0, 0, 0, 0);
    setSelectedDate(clickedDate);
    setSelectedEvent(null); // Limpiar evento seleccionado al cambiar de día
  }

  // Formatear la fecha seleccionada para mostrar en el sidebar
  const formattedSelectedDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

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
          initialEvents={INITIAL_EVENTS}
          eventContent={(arg) => renderEventContent(arg, toggleSelectedEvent)}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventsSet={handleEvents}
          locale={esLocale}  
        />
      </div>
       
      <Sidebar
        eventsOfSelectedDay={eventsOfSelectedDay}
        selectedEvent={selectedEvent}
        onSelectEvent={toggleSelectedEvent}
        selectedDateLabel={formattedSelectedDate}
      />
    </div>
  )
}

function renderEventContent(eventInfo, onDotClick) {
  return (
    <>
      <div onClick={() => onDotClick(eventInfo.event)} className={`event-dot`}></div>
    </>
  )
}

function Sidebar({ eventsOfSelectedDay, selectedEvent, onSelectEvent, selectedDateLabel }) {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Eventos del {selectedDateLabel} ({eventsOfSelectedDay.length})</h2>
        <ul>
          {eventsOfSelectedDay.length > 0 ? (
            eventsOfSelectedDay.map((event) => (
              <SidebarEvent 
                key={event.id} 
                event={event} 
                isSelected={selectedEvent?.id === event.id} 
                onSelectEvent={onSelectEvent} 
              />
            ))
          ) : (
            <li>No hay eventos para este día</li>
          )}
        </ul>
      </div>
      <div className='demo-app-sidebar-bottom-section'>
        <h2>Detalle de evento</h2>
        {selectedEvent ? (
          <div className='selected-event'>
            <p>
              <strong>{selectedEvent.title}</strong>{' '}
              {selectedEvent.allDay && <i>(Todo el día)</i>}
            </p>

            {!selectedEvent.allDay && (
              <>
                <p>
                  <strong>Inicio:</strong>{' '}
                  {capitalizeDateString(formatDate(selectedEvent.start, {
                    locale: esLocale,
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }))}
                </p>
                <p>
                  <strong>Fin:</strong>{' '}
                  {selectedEvent.end
                    ? capitalizeDateString(formatDate(selectedEvent.end, {
                        locale: esLocale,
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }))
                    : 'Sin hora de fin'}
                </p>
              </>
            )}

            {selectedEvent.allDay && (
              <p>
                <strong>Fecha:</strong>{' '}
                {capitalizeDateString(formatDate(selectedEvent.start, {
                  locale: esLocale,
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }))}
              </p>
            )}

            {selectedEvent.extendedProps?.description && (
              <p>
                <strong>Descripción:</strong><br />
                {selectedEvent.extendedProps.description}
              </p>
            )}
          </div>
        ) : (
          <p>Selecciona un evento para ver los detalles.</p>
        )}
      </div>
    </div>
  )
}

function SidebarEvent({ event, isSelected, onSelectEvent }) {
  // Obtener la clase CSS del color del evento
  const eventColorClass = event.classNames?.[0] || event.className || '';
  
  return (
    <li 
      key={event.id} 
      className={`sidebar-event-item ${isSelected ? 'selected' : ''}`} 
      onClick={() => onSelectEvent(event)}
      style={{ cursor: 'pointer' }}
    >
      <div className="sidebar-event-content">
        <div 
          className={`event-color-indicator ${eventColorClass}`}
          style={{
            backgroundColor: eventColorClass === 'event-red' 
              ? 'rgb(128, 0, 64)' 
              : eventColorClass === 'event-blue'
              ? 'rgb(13, 0, 128)'
              : '#ccc',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '10px',
            flexShrink: 0
          }}
        />
        <span className="event-title">{event.title}</span>
      </div>
    </li>
  )
}