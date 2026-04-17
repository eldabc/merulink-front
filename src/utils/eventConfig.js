export const CATEGORY_CONFIGS = {
  'meru-events': {
    hasStartDate: true,
    hasEndDate: true,
    hasStartTime: true,
    hasEndTime: true,
    hasStatus: true,
    hasLocation: true,
    hasRepeatEvent: true,
    hasCreateAlert: true,
    hasColorinDay: true,
    hasDescription: true,
    hasComments: true,
    isYearly: false,
  },
  'wedding-nights': {
    hasStartDate: true,
    hasEndDate: true,
    hasStartTime: true,
    hasEndTime: true,
    hasStatus: true,
    hasLocation: true,
    hasRepeatEvent: true,
    hasCreateAlert: true,
    hasColorinDay: true,
    hasDescription: true,
    hasComments: true,
    isYearly: false,
  },
  'dinner-heights': {
    hasStartDate: true,
    hasEndDate: false,
    hasStartTime: true,
    hasEndTime: true,
    hasStatus: true,
    hasLocation: true,
    hasRepeatEvent: true,
    hasCreateAlert: true,
    hasColorinDay: true,
    hasDescription: true,
    hasComments: true,
    isYearly: false,
  },
  've-holidays': {
    hasStartDate: true,
    hasEndDate: false,
    hasStartTime: false,
    hasEndTime: false,
    hasStatus: false,
    hasLocation: false,
    hasRepeatEvent: true,
    hasCreateAlert: false,
    hasColorinDay: true,
    hasDescription: true,
    hasComments: false,
    isYearly: true,
  },
  'google-calendar': {
    hasStartDate: true,
    hasEndDate: false,
    hasStartTime: false,
    hasEndTime: false,
    hasStatus: false,
    hasLocation: false,
    hasRepeatEvent: true,
    hasCreateAlert: true,
    hasColorinDay: true,
    hasDescription: true,
    hasComments: false,
    isYearly: true,
  },
  
  'meru-birthdays': {
    hasStartDate: true,
    hasEndDate: false,
    hasStartTime: false,
    hasEndTime: false,
    hasStatus: false,
    hasLocation: false,
    hasRepeatEvent: true,
    hasCreateAlert: false,
    hasColorinDay: false,
    hasDescription: false,
    hasComments: false,
    isYearly: true,
  },
  
  'executive-mod': {
    hasStartDate: true,
    hasEndDate: true,
    hasStartTime: true,
    hasEndTime: true,
    hasStatus: false,
    hasLocation: false,
    hasRepeatEvent: true,
    hasCreateAlert: true,
    hasColorinDay: true,
    hasDescription: true,
    hasComments: true,
    isYearly: false,
  }
};

// Configuración por defecto para categorías nuevas
export const DEFAULT_CONFIG = {
  hasStartDate: true,
  hasEndDate: true,
  hasStartTime: true,
  hasEndTime: true,
  hasStatus: false,
  hasLocation: false,
  hasRepeatEvent: false,
  hasCreateAlert: false,
  hasColorinDay: false,
  hasDescription: true,
  hasComments: false,
  isYearly: false
};

export const EVENT_CATEGORIES = {
  M_EVENTS: {
    key: "meru-events",
    path: "eventos-meru",
  },
  W_NIGHTS: {
    key: "wedding-nights",
    path: "noche-bodas-cena-alturas",
  },
  D_HEIGHTS: {
    key: "dinner-heights",
    path: "noche-bodas-cena-alturas"
  },
  VE_HOLIDAYS: {
    key: "ve-holidays",
    path: "festivos-venezolanos-calendario-google",
  },
  G_CALENDAR: {
    key: "google-calendar",
    path: "festivos-venezolanos-calendario-google",
  },
  M_BIRTHDAYS: {
    key: "meru-birthdays",
    path: "cumpleaños-merú",
  },
  E_MOD: {
    key: "executive-mod",
    path: "ejecutivo-mod",
  },
  B_MONDAYS: {
    key: "banking-mondays",
    path: "lunes-bancarios",
  },
};

// Utilidad para obtener el path rápido en el navigate
export const getPathByCategory = (key) => {
  const category = Object.values(EVENT_CATEGORIES).find(c => c.key === key);
  return category ? category.path : "eventos-meru";
};