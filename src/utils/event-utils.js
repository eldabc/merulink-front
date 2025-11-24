
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Evento 1',
    start: '2025-11-11',
    className: 'event-blue',
    allDay: true
  },
  {
    id: createEventId(),
    title: 'Evento 2',
    start: '2025-11-15T09:00:00',
    end:   '2025-11-15T11:00:00',
    className: 'event-red'
  },
  {
    id: createEventId(),
    title: 'Evento 3',
    start: todayStr,
    className: 'event-blue'
  },
  {
    id: createEventId(),
    title: 'Evento 4',
    start: todayStr,
    className: 'event-red'
  }
]

export function createEventId() {
  return String(eventGuid++)
}