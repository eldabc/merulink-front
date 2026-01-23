
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Evento 1',
    start: todayStr+ 'T13:00:00',
    end: todayStr+ 'T15:00:00',
    allDay: true,
    extendedProps: {
      category: 'meru-events',
      label: 'Eventos Merú',
      status: 'Tentativo',
      locationId: 1,
      locationName: 'Salon 1',
      repeatEvent: true,
      repeatInterval: 'Mensual',
      createAlert: true,
      coloringDay: true,
      description: 'Descripción del evento 1',
      comments: 'Comentarios del evento 1',
    },
    className: 'meru-events',

  },
  {
    id: createEventId(),
    title: 'Camilo Hernández',
    start: '2026-01-01',
    end:   '2026-01-01',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'Tentativo',
      departmentName: 'Contabilidad',
      repeatEvent: true,
      repeatInterval: 'Anual',
      coloringDay: false,
    },
    className: 'meru-birthdays',
  },
  {
    id: createEventId(),
    title: 'Evento 3',
    start: todayStr+ 'T13:00:00',
    end: todayStr+ 'T15:00:00',
    extendedProps: {
      category: 'wedding-nights',
      label: 'Plan Noche de Bodas',
      status: 'Tentativo',
      locationId: 2,
      locationName: 'Salon 2',
      coloringDay: true,
      comments: 'Comentario del evento 4'
    },
    className: 'di-heights-wedding-nights',
  },
  {
    id: createEventId(),
    title: 'Evento 4',
    start: todayStr+ 'T08:00:00',
    end: todayStr+ 'T17:00:00',
    extendedProps: {
      category: 'executive-mod',
      label: 'Ejecutivos MOD',
      status: 'Tentativo',
      locationId: 3,
      locationName: 'Salon 3',
      coloringDay: true,
      comments: 'Comentario del evento 4'
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
      status: '',
      locationId: null,
      locationName: null,
      repeatEvent: true,
      repeatInterval: 'Anual',
      coloringDay: true,
      description: '',
      comments: 'Comentario del evento 5'
    },
    className: 'g-calendar-ve-holidays',
  },
  {
    id: createEventId(),
    title: 'Evento 6',
    start: todayStr,
    extendedProps: {
      category: 've-holidays',
      label: 'Festivos Venezolanos',
      status: 'Confirmado',
      locationId: null,
      locationName: null,
      coloringDay: true,
      comments: 'Comentario del evento 6'
    },
    className: 'g-calendar-ve-holidays',
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
      locationId: 6,
      locationName: 'Salon 6',
      coloringDay: true,
    },
    className: 'executive-mod',
  },
  {
    id: createEventId(),
    title: 'Juan Perez',
    start: '2026-01-30',
    end:   '2026-01-30',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'Confirmado',
      departmentName: 'Administración',
      repeatEvent: true,
      repeatInterval: 'Anual',
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
      locationId: 7,
      locationName: 'Salon 7',
      repeatEvent: true,
      repeatInterval: 'Quincenal',
      createAlert: true,
      coloringDay: true,
    },
    className: 'meru-events',
  },
  {
    id: createEventId(),
    title: 'Evento 10',
    start: '2026-01-05T09:00:00',
    end:   '2026-01-05T11:00:00',
    extendedProps: {
      category: 'dinner-heights',
      label: 'Plan Noche de Bodas',
      status: 'Confirmado',
      locationId: 1,
      locationName: 'Salon 1',
      coloringDay: true,
      description: 'Descripción del evento 10'
    },
    className: 'di-heights-wedding-nights',
  },
  {
    id: createEventId(),
    title: 'Evento 11',
    start: '2026-01-05T09:00:00',
    end:   '2026-01-05T11:00:00',
    extendedProps: {
      category: 'banking-mondays',
      label: 'Lunes Bancario 1',
      status: '',
      locationId: null,
      locationName: '',
      coloringDay: false,
      description: 'Descripción del evento 11'
    },
    className: 'banking-mondays',
  }
]

export function createEventId() {
  return String(eventGuid++)
}