
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Evento 1',
    start: '2025-11-11',
    allDay: true,
    extendedProps: {
      category: 'Eventos Merú',
      status: 'active',
    },
    className: 'meru-events'

  },
  {
    id: createEventId(),
    title: 'Evento 2',
    start: '2025-11-15T09:00:00',
    end:   '2025-11-15T11:00:00',
    extendedProps: {
      category: 'Cumpleaños Merú',
      status: 'active',
    },
    className: 'meru-birthday'
  },
  {
    id: createEventId(),
    title: 'Evento 3',
    start: todayStr,
    extendedProps: {
      category: 'Plan Noche de Bodas',
      status: 'active',
    },
    className: 'event-wedding'
  },
  {
    id: createEventId(),
    title: 'Evento 4',
    start: todayStr,
    extendedProps: {
      category: 'Ejecutivos MOD',
      status: 'active',
    },
    className: 'event-executive'
  },
  {
    id: createEventId(),
    title: 'Evento 5',
    start: todayStr,
    extendedProps: {
      category: 'Festivos Venezolanos',
      status: 'active',
    },
    className: 'venezuelan-holidays'
  },
  {
    id: createEventId(),
    title: 'Evento 6',
    start: todayStr,
    extendedProps: {
      category: 'Festivos Cristianos',
      status: 'active',
    },
    className: 'christian-holidays'
  },
  {
    id: createEventId(),
    title: 'Evento 7',
    start: '2025-11-18T09:00:00',
    end:   '2025-11-18T11:00:00',
    extendedProps: {
      category: 'Ejecutivos MOD',
      status: 'active',
    },
    className: 'event-executive'
  },
  {
    id: createEventId(),
    title: 'Evento 8',
    start: '2025-11-30T09:00:00',
    end:   '2025-11-30T11:00:00',
    extendedProps: {
      category: 'Cumpleaños Merú',
      status: 'active',
    },
    className: 'meru-birthday'
  },
  {
    id: createEventId(),
    title: 'Evento 9',
    start: '2025-12-01T09:00:00',
    end:   '2025-12-01T11:00:00',
    extendedProps: {
      category: 'Eventos Merú',
      status: 'active',
    },
    className: 'meru-events'
  },
  {
    id: createEventId(),
    title: 'Evento 10',
    start: '2025-12-05T09:00:00',
    end:   '2025-12-95T11:00:00',
    extendedProps: {
      category: 'Plan Noche de Bodas',
      status: 'active',
    },
    className: 'event-wedding'
  }
]

export function createEventId() {
  return String(eventGuid++)
}