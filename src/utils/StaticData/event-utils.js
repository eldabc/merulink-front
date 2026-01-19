
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
      status: 'Tentativo',
      location: 'Oficinas Merú',
      coloringDay: true,
    },
    className: 'meru-events',

  },
  {
    id: createEventId(),
    title: 'Camilo Hernández',
    start: '2025-11-15T09:00:00',
    end:   '2025-11-15T11:00:00',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'Tentativo',
      department: 'Contabilidad',
      coloringDay: true,
    },
    className: 'meru-birthdays',
  },
  {
    id: createEventId(),
    title: 'Evento 3',
    start: todayStr,
    extendedProps: {
      category: 'wedding-nights',
      label: 'Plan Noche de Bodas',
      status: 'Tentativo',
      location: 'Oficinas Merú',
      coloringDay: true,
    },
    className: 'wedding-nights',
  },
  {
    id: createEventId(),
    title: 'Evento 4',
    start: todayStr,
    extendedProps: {
      category: 'executive-mod',
      label: 'Ejecutivos MOD',
      status: 'Tentativo',
      location: 'Oficinas Merú',
      coloringDay: true,
    },
    className: 'executive-mod',
  },
  {
    id: createEventId(),
    title: 'Evento 5',
    start: todayStr,
    extendedProps: {
      category: 've-holidays',
      label: 'Festivos Venezolanos',
      status: 'Tentativo',
      location: 'Oficinas Merú',
      coloringDay: true,
      description: 'Descripción del evento 5',
    },
    className: 've-holidays',
  },
  {
    id: createEventId(),
    title: 'Evento 6',
    start: todayStr,
    extendedProps: {
      category: 'christian-holidays',
      label: 'Festivos Cristianos',
      status: 'Confirmado',
      location: 'Oficinas Merú',
      coloringDay: true,
    },
    className: 'christian-holidays',
  },
  {
    id: createEventId(),
    title: 'Evento 7',
    start: '2025-11-18T09:00:00',
    end:   '2025-11-18T11:00:00',
    extendedProps: {
      category: 'executive-mod',
      label: 'Ejecutivos MOD',
      status: 'Confirmado',
      location: 'Oficinas Merú',
      coloringDay: true,
    },
    className: 'executive-mod',
  },
  {
    id: createEventId(),
    title: 'Juan Perez',
    start: '2025-11-30T09:00:00',
    end:   '2025-11-30T11:00:00',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'Confirmado',
      department: 'Administración',
      coloringDay: true,
    },
    className: 'meru-birthdays',
  },
  {
    id: createEventId(),
    title: 'Evento 9',
    start: '2025-12-01T09:00:00',
    end:   '2025-12-01T11:00:00',
    extendedProps: {
      category: 'meru-events',
      label: 'Eventos Merú',
      status: 'Confirmado',
      location: 'Oficinas Merú',
      coloringDay: true,
    },
    className: 'meru-events',
  },
  {
    id: createEventId(),
    title: 'Evento 10',
    start: '2025-12-05T09:00:00',
    end:   '2025-12-05T11:00:00',
    extendedProps: {
      category: 'dinner-heights',
      label: 'Plan Noche de Bodas',
      status: 'Confirmado',
      location: 'Oficinas Merú',
      coloringDay: true,
    },
    className: 'dinner-heights',
  }
]

export function createEventId() {
  return String(eventGuid++)
}