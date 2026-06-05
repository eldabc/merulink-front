import dayjs from 'dayjs';

/**
 * Genera el array de fechas de una quincena específica con nombres de días,
 * color rojo para fines de semana y azul para el día de hoy.
 * @param {number|string} year - Año actual (ej: 2026)
 * @param {number|string} monthId - ID del mes (1 = Enero, 12 = Diciembre)
 * @param {number|string} fortnight - Quincena elegida (1 o 2)
 * @returns {Array} Array de objetos de días listos para la cabecera
 */
export const generateDates = (year, monthIndex, date) => {
  
  const dateObjStart = new Date(year, monthIndex, date);
  
  const yyyy = dateObjStart.getFullYear();
  const mm = String(dateObjStart.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObjStart.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  return formattedDate;

};
export const getStarEndFortnight = (year, monthId, fortnight) => {

  const monthIndex = parseInt(monthId, 10) - 1;
  const intFortnight = parseInt(fortnight, 10);

  // Obtener la fecha de HOY (YYYY-MM-DD) 
  const todayObj = new Date();
  const todayFormatted = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  let startDay = 1;
  let endDay = 15;

  if (intFortnight === 2) {
    startDay = 16;
    endDay = new Date(year, monthIndex + 1, 0).getDate();
  }

  const dateStart = generateDates(year, monthIndex, startDay);
  const dateEnd = generateDates(year, monthIndex, endDay);
  // console.log("dates", dateStart,dateEnd );

  return [
    dateStart, dateEnd
  ]

};
export const getFortnightDays = (year, monthId, fortnight) => {
  
  const days = [];
  const monthIndex = parseInt(monthId, 10) - 1;
  const intFortnight = parseInt(fortnight, 10);

  const dayNames = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];

  // Obtener la fecha de HOY (YYYY-MM-DD) 
  const todayObj = new Date();
  const todayFormatted = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  let startDay = 1;
  let endDay = 15;

  if (intFortnight === 2) {
    startDay = 16;
    endDay = new Date(year, monthIndex + 1, 0).getDate();
  }

  for (let d = startDay; d <= endDay; d++) {
    const dateObj = new Date(year, monthIndex, d);
    
    const dayOfWeekIndex = dateObj.getDay();
    const dayName = dayNames[dayOfWeekIndex];

    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6;
    
    // Evalua si la cela es HOY
    const isToday = formattedDate === todayFormatted;

    days.push({
      date: formattedDate,
      dayNumber: d,
      dayName: dayName,
      isWeekend: isWeekend,
      isToday: isToday,
    });
  }

  return days;
};


/**
 * Determina qué quincena corresponde según la fecha de inicio.
 * @param {string|Date} startDate - Campo schedule.start
 * @returns {{ number: number, label: string }}
 */
export function getFortnightInfo(startDate) {
  if (!startDate) return { number: 0, label: 'Sin quincena' };

  // Días del mes (1 - 31)
  const day = dayjs(startDate).date(); 

  const fortnightNumber = day <= 15 ? 1 : 2;

  return {
    number: fortnightNumber,
    label: `${fortnightNumber}ª Quincena`
  };
}