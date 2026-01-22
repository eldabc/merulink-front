// Capitalizar fechas en español
export function capitalizeDateString(dateString) {
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

// Normalizar fecha (solo año, mes, día, sin horas)
export function normalizeDate(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Devolver fecha como cadena
export function normalizeDateToString(date) {
  const normalizedDate = normalizeDate(date);
  return normalizedDate.toLocaleDateString();
}

// Obtener fecha de hoy normalizada
export function getTodayNormalized() {
  return normalizeDate(new Date());
}

// Devolver fecha en formato ISO (YYYY-MM-DDTHH:MM:SS)
export function formatDateToEvent(dateEvent, timeEvent) {
  const datePart = new Date(dateEvent).toISOString().split('T')[0];
  const timePart = timeEvent ? `${timeEvent}:00` : "00:00:00";

  return `${datePart}T${timePart}`;
}

export function divideDateTime(isoString) {
  if (!isoString) return { date: '', time: '' };

  const [date, fullTime] = isoString.split('T');
  const time = fullTime ? fullTime.substring(0, 5) : '';

  return { date, time };
};

// Calcular NextHour (HH:mm)
export function getNextHour(startTime) {
  if (!startTime) return "";

  let [hours, minutes] = startTime.split(':').map(Number);

  // Sumamos una hora
  hours = (hours + 1) % 24;

  // Formateamos (HH:mm)
  const nextHoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');

  return `${nextHoursStr}:${minutesStr}`;
};
