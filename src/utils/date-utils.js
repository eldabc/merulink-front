// Función para capitalizar fechas en español
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

// Obtener fecha de hoy normalizada
export function getTodayNormalized() {
  return normalizeDate(new Date());
}

export function formatDateToEvent(dateEvent, timeEvent) {
  const datePart = new Date(dateEvent).toISOString().split('T')[0];
  const timePart = timeEvent ? `${timeEvent}:00` : "00:00:00";

  // Concatenar en formato ISO
  return `${datePart}T${timePart}`;
}

