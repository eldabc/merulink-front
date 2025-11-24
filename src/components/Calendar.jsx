import React, { useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { INITIAL_EVENTS, createEventId } from '../utils/event-utils'
import esLocale from '@fullcalendar/core/locales/es';
import '../Calendar.css';

export default function DemoApp() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])

  // Almacena el evento clicado para mostrarlo en el Sidebar
  const [selectedEvent, setSelectedEvent] = useState(null); 

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

  return (
    <div className='calendar-container'>
     
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
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
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          eventContent={(arg) => renderEventContent(arg, toggleSelectedEvent)}
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          locale={esLocale}  
        />
      </div>
       
      <Sidebar
        currentEvents={currentEvents}
        selectedEvent={selectedEvent}
        onSelectEvent={toggleSelectedEvent}
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

function Sidebar({ currentEvents, selectedEvent, onSelectEvent }) {
  console.log("selectedEvent: " , selectedEvent)
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Eventos de Hoy ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} isSelected={selectedEvent?.id === event.id} onSelectEvent={onSelectEvent} />
          ))}
        </ul>
      </div>
      <div className='demo-app-sidebar-bottom-section'>
        <h2>Detalle de evento </h2>
        {selectedEvent ? (
          <div className='selected-event'>
            <p>
              <strong>{selectedEvent.title}</strong>{' '}
              {selectedEvent.allDay && <i>(Todo el día)</i>}
            </p>

            {!selectedEvent.allDay && (
              <>
                <p>
                  Inicio:{' '}
                  {formatDate(selectedEvent.start, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p>
                  Fin:{' '}
                  {selectedEvent.end
                    ? formatDate(selectedEvent.end, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Sin hora de fin'}
                </p>
              </>
            )}

            {selectedEvent.extendedProps?.description && (
              <p>{selectedEvent.extendedProps.description}</p>
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
  return (
    <li key={event.id} className={isSelected ? 'selected' : ''} onClick={() => onSelectEvent(event)}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}