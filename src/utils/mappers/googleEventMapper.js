/**
 * Transforma un evento Google Calendar al formato 
 * requerido por FullCalendar y la lógica interna de MeruLink.
 */
export const mapGoogleEventToFullCalendar = (event, fixedEventsList = []) => {
    const dateStr = event.start.date || event.start.dateTime;
    const monthDay = dateStr.substring(5, 10); 
    const isFixed = fixedEventsList.includes(monthDay);

    return {
        id: event.id,
        title: event.summary,
        // Normalización de fecha para compatibilidad
        start: event.start.date ? `${event.start.date}T00:00:00` : event.start.dateTime,
        allDay: !!event.start.date,
        display: 'block',
        className: 'g-calendar-ve-holidays',
        extendedProps: {
            category: {
                key: 'google-calendar',
                label: 'Calendario Google',
                color: 'g-calendar-ve-holidays'
            },
            description: event.description || 'Feriado oficial de Venezuela',
            externalDate: true,
            repeatEvent: true, 
            repeatInterval: isFixed ? 'Anual' : 'Rotativo',
            isFixed,
            createdBy: 'Calendario Google'
        }
    };
};