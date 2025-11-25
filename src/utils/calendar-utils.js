import { normalizeDate } from './date-utils';

// Filtrar eventos de un día específico
export function filterEventsByDate(events, selectedDate) {
  if (!events || events.length === 0) return [];
  
  const normalizedSelectedDate = normalizeDate(selectedDate);
  
  return events.filter((event) => {
    if (!event.start) return false;
    
    const eventStartDate = normalizeDate(event.start);
    return eventStartDate.getTime() === normalizedSelectedDate.getTime();
  });
}

