import { normalizeDate } from './date-utils';
/**
 * Filtra una lista de eventos para encontrar aquellos que ocurren en una fecha específica.
 * @param {Array<Object>} events - La lista de eventos (ya filtrada por categoría).
 * @param {Date} date - La fecha seleccionada (formato Date, normalizada a medianoche).
 * @returns {Array<Object>} Lista de eventos que caen en la fecha.
 */
export function filterEventsByDate(events, date) {
  if (!events || !date) return [];

  const targetDateStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  return events.filter(event => {
      // FullCalendar almacena las fechas como strings o Date objects
      const startDate = event.start instanceof Date ? event.start.toISOString().slice(0, 10) : event.start.slice(0, 10);
      
      // Comprobar si la fecha de inicio coincide
      if (startDate === targetDateStr) {
          return true;
      }

      // Manejar eventos de varios días (si la fecha seleccionada está entre start y end)
      if (event.end) {
          const endDate = event.end instanceof Date ? event.end.toISOString().slice(0, 10) : event.end.slice(0, 10);
          
          // Si event.allDay es true, el 'end' es exclusivo (el día después del último día real del evento).
          // Lo ajustamos para que sea inclusivo para el cálculo.
          let inclusiveEndDate = endDate;
          if (event.allDay) {
              const end = new Date(endDate);
              end.setDate(end.getDate() - 1);
              inclusiveEndDate = end.toISOString().slice(0, 10);
          }

          // Comprobar si la fecha seleccionada cae entre el inicio y el final (inclusivo)
          return targetDateStr >= startDate && targetDateStr <= inclusiveEndDate;
      }

      return false;
  });
}


// Filtrar eventos de un día específico
// export function filterEventsByDate(events, selectedDate) {
//   if (!events || events.length === 0) return [];
  
//   const normalizedSelectedDate = normalizeDate(selectedDate);
  
//   return events.filter((event) => {
//     if (!event.start) return false;
    
//     const eventStartDate = normalizeDate(event.start);
//     return eventStartDate.getTime() === normalizedSelectedDate.getTime();
//   });
// }

