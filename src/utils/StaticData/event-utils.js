
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Evento 1',
    start: '2025-11-11',
    allDay: true,
    extendedProps: {
      category: 'meru-events',
      label: 'Eventos Merú',
      status: 'active',
    },
    className: 'meru-events',
    type: 'meru-events',

  },
  {
    id: createEventId(),
    title: 'Evento 2',
    start: '2025-11-15T09:00:00',
    end:   '2025-11-15T11:00:00',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'active',
    },
    className: 'meru-birthdays',
    type: 'meru-birthdays',
  },
  {
    id: createEventId(),
    title: 'Evento 3',
    start: todayStr,
    extendedProps: {
      category: 'wedding-nights',
      label: 'Plan Noche de Bodas',
      status: 'active',
    },
    className: 'wedding-nights',
    type: 'wedding-nights',
  },
  {
    id: createEventId(),
    title: 'Evento 4',
    start: todayStr,
    extendedProps: {
      category: 'executive-mod',
      label: 'Ejecutivos MOD',
      status: 'active',
    },
    className: 'executive-mod',
    type: 'executive-mod',
  },
  {
    id: createEventId(),
    title: 'Evento 5',
    start: todayStr,
    extendedProps: {
      category: 'venezuelan-holidays',
      label: 'Festivos Venezolanos',
      status: 'active',
    },
    className: 'venezuelan-holidays',
    type: 'venezuelan-holidays',
  },
  {
    id: createEventId(),
    title: 'Evento 6',
    start: todayStr,
    extendedProps: {
      category: 'christian-holidays',
      label: 'Festivos Cristianos',
      status: 'active',
    },
    className: 'christian-holidays',
    type: 'christian-holidays',
  },
  {
    id: createEventId(),
    title: 'Evento 7',
    start: '2025-11-18T09:00:00',
    end:   '2025-11-18T11:00:00',
    extendedProps: {
      category: 'executive-mod',
      label: 'Ejecutivos MOD',
      status: 'active',
    },
    className: 'executive-mod',
    type: 'executive-mod',
  },
  {
    id: createEventId(),
    title: 'Evento 8',
    start: '2025-11-30T09:00:00',
    end:   '2025-11-30T11:00:00',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'active',
    },
    className: 'meru-birthdays',
    type: 'meru-birthdays',
  },
  {
    id: createEventId(),
    title: 'Evento 9',
    start: '2025-12-01T09:00:00',
    end:   '2025-12-01T11:00:00',
    extendedProps: {
      category: 'meru-events',
      label: 'Eventos Merú',
      status: 'active',
    },
    className: 'meru-events',
    type: 'meru-events',
  },
  {
    id: createEventId(),
    title: 'Evento 10',
    start: '2025-12-05T09:00:00',
    end:   '2025-12-05T11:00:00',
    extendedProps: {
      category: 'wedding-nights',
      label: 'Plan Noche de Bodas',
      status: 'active',
    },
    className: 'wedding-nights',
    type: 'wedding-nights',
  }
]

export function createEventId() {
  return String(eventGuid++)
}