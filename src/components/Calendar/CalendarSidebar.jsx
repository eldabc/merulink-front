import React from 'react';
import { formatDate } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { capitalizeDateString } from '../../utils/date-utils';
import SidebarEvent from './SidebarEvent';

export default function CalendarSidebar({ 
  eventsOfSelectedDay, 
  selectedEvent, 
  onSelectEvent, 
  selectedDateLabel 
}) {
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
            {selectedEvent.extendedProps?.category && (
              <p>
                <strong>Tipo de evento: </strong>
                {selectedEvent.extendedProps.label}
              </p>
            )}
          </div>
        ) : (
          <p>Selecciona un evento para ver los detalles.</p>
        )}
      </div>
    </div>
  );
}

