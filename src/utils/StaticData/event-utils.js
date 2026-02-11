
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Evento 1',
    start: todayStr+ 'T13:00:00',
    end: todayStr+ 'T15:00:00',
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
      createdBy: "Ana Luna"
    },
    className: 'meru-events',

  },
  {
    id: createEventId(),
    title: 'Camilo Hernández',
    start: '2026-02-10T00:00:00',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'Tentativo',
      departmentName: 'Contabilidad',
      repeatEvent: true,
      repeatInterval: 'Anual',
      coloringDay: true,
      createdBy: "Sistema"
    },
    className: 'meru-birthdays',
  },
  {
    id: createEventId(),
    title: 'Juan Perez',
    start: '2026-01-30T00:00:00',
    extendedProps: {
      category: 'meru-birthdays',
      label: 'Cumpleañeros Merú',
      status: 'Confirmado',
      departmentName: 'Administración',
      repeatEvent: true,
      repeatInterval: 'Anual',
      coloringDay: true,
      createdBy: "Sistema"
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
      comments: 'Comentario del evento 4',
      createdBy: "Ana Luna"
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
      coloringDay: true,
      comments: 'Comentario del evento 4',
      createdBy: "Riad Abdo"
    },
    className: 'executive-mod',
  },
  {
    id: createEventId(),
    title: 'Evento 5',
    start: todayStr+'T00:00:00',
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
      comments: 'Comentario del evento 5',
      createdBy: "Sistema"
    },
    className: 'g-calendar-ve-holidays',
  },
  {
    id: createEventId(),
    title: 'Evento 6',
    start: todayStr+'T00:00:00',
    extendedProps: {
      category: 've-holidays',
      label: 'Festivos Venezolanos',
      status: 'Confirmado',
      locationId: null,
      locationName: null,
      repeatEvent: true,
      repeatInterval: 'Anual',
      coloringDay: true,
      comments: 'Comentario del evento 6',
      createdBy: "Sistema"
    },
    className: 'g-calendar-ve-holidays',
  },
  {
    id: createEventId(),
    title: 'Evento 7',
    start: '2026-02-18T09:00:00',
    end:   '2026-02-18T11:00:00',
    extendedProps: {
      category: 'executive-mod',
      label: 'Ejecutivos MOD',
      status: 'Confirmado',
      // locationId: 6,
      // locationName: 'Salon 6',
      coloringDay: true,
      createdBy: "Ana Luna"
    },
    className: 'executive-mod',
  },
  {
    id: createEventId(),
    title: 'Evento 9',
    start: '2026-02-01T09:00:00',
    end:   '2026-02-01T11:00:00',
    extendedProps: {
      category: 'meru-events',
      label: 'Eventos Merú',
      status: 'Finalizado',
      locationId: 7,
      locationName: 'Salon 7',
      repeatEvent: true,
      repeatInterval: 'Quincenal',
      createAlert: true,
      coloringDay: true,
      createdBy: "Ana Luna"
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
      label: 'Cena en las Alturas',
      status: 'Confirmado',
      locationId: 1,
      locationName: 'Salon 1',
      coloringDay: true,
      description: 'Descripción del evento 10',
      createdBy: "Ana Luna"
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
      label: 'Lunes Bancarios',
      status: '',
      locationId: null,
      locationName: '',
      coloringDay: false,
      description: 'Descripción del evento 11',
      createdBy: "Riad Abdo"
    },
    className: 'banking-mondays',
  },
   {
    id: createEventId(),
    title: 'Evento 12 Plantilla',
    start: todayStr+ 'T13:00:00',
    end: todayStr+ 'T15:00:00',
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
      description: 'Descripción del evento 12',
      comments: 'Comentarios del evento 12',
      createdBy: "Ana Luna",
      isTemplate: true,
      templateName: 'Plantilla Eventos Uno'
    },
    className: 'meru-events',

  },
  {
    id: createEventId(),
    title: 'Evento 13 Plantilla',
    start: '2026-02-10T00:00:00',
    end:   '2026-02-10T15:00:00',
    extendedProps: {
     category: 'meru-events',
      label: 'Eventos Merú',
      status: 'Tentativo',
      locationId: 2,
      locationName: 'Salon 2',
      repeatEvent: false,
      repeatInterval: '',
      createAlert: true,
      coloringDay: true,
      description: 'Descripción del evento 13',
      comments: 'Comentarios del evento 13',
      createdBy: "Ana Luna",
      isTemplate: true,
      templateName: 'Plantilla Eventos Dos'
    },
    className: 'meru-events',
  },
  {
    id: createEventId(),
    title: 'Evento 14',
    start: todayStr+ 'T13:00:00',
    end: todayStr+ 'T15:00:00',
    extendedProps: {
      category: 'wedding-nights',
      label: 'Plan Noche de Bodas',
      status: 'Tentativo',
      locationId: 2,
      locationName: 'Salon 2',
      coloringDay: true,
      comments: 'Comentario del evento 14',
      createdBy: "Ana Luna",
      isTemplate: true,
      templateName: 'Plantilla Eventos Tres'
    },
    className: 'di-heights-wedding-nights', 
  }
]

export function createEventId() {
  return String(eventGuid++)
}

export const fixedEvents = [
  '01-01', '05-01', '06-24', '07-05', '07-24', '10-12', '12-24', '12-25', '12-31'
];