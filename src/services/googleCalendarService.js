import { ENV } from '../config/env';
const API_KEY = ENV.API_KEY;
import { mapGoogleEventToFullCalendar } from '../utils/mappers/googleEventMapper';

/**
 * Servicio para interactuar con la API de Google Calendar
 * Traer datos de Google manualmente
 */
export const GoogleCalendarService = {
  
  async fetchHolidays(year, fixedEventsList = []) {

    const timeMin = `${year}-01-01T00:00:00Z`;
    const timeMax = `${year}-12-31T23:59:59Z`;
    const calendarId = 'es.ve#holiday@group.v.calendar.google.com';

   const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${API_KEY}`+
                `&timeMin=${timeMin}` +
                `&timeMax=${timeMax}` +
                `&singleEvents=true` + // Divide eventos recurrentes en instancias individuales
                `&orderBy=startTime`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error en la respuesta de Google');
      
      const data = await response.json();
      return (data.items || []).map(event => mapGoogleEventToFullCalendar(event, fixedEventsList));
      
    } catch (err) {
      console.error("Error cargando Google Calendar:", err);
      return [];
    }
  }

};