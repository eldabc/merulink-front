import dayjs from 'dayjs';

/**
 * Genera el array de fechas de una quincena específica con nombres de días,
 * @param {number|string} year
 * @param {number|string} monthId
 * @param {number|string} day
 * @returns {string}
 */
const formatDate = (year, monthId, day) => {
  const normalizedMonth = String(monthId).padStart(2, '0');
  const normalizedDay = String(day).padStart(2, '0');
  return dayjs(`${year}-${normalizedMonth}-${normalizedDay}`).format('YYYY-MM-DD');
};

export const generateDates = formatDate;
export const getStarEndFortnight = (year, monthId, fortnight) => {
  const intFortnight = parseInt(fortnight, 10);
  const monthString = String(monthId).padStart(2, '0');
  const firstOfMonth = dayjs(`${year}-${monthString}-01`);

  const startDay = intFortnight === 2 ? 16 : 1;
  const endDay = intFortnight === 2 ? firstOfMonth.endOf('month').date() : 15;

  return [
    formatDate(year, monthId, startDay),
    formatDate(year, monthId, endDay),
  ];
};
export const getFortnightDays = (year, monthId, fortnight) => {
  const days = [];
  const intFortnight = parseInt(fortnight, 10);
  const monthString = String(monthId).padStart(2, '0');
  const startDay = intFortnight === 2 ? 16 : 1;
  const endDay = intFortnight === 2
    ? dayjs(`${year}-${monthString}-01`).endOf('month').date()
    : 15;

  const dayNames = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];
  const today = dayjs();

  for (let d = startDay; d <= endDay; d += 1) {
    const dateObj = dayjs(`${year}-${monthString}-${String(d).padStart(2, '0')}`);
    const dayOfWeekIndex = dateObj.day();
    const formattedDate = dateObj.format('YYYY-MM-DD');

    days.push({
      date: formattedDate,
      dayNumber: d,
      dayName: dayNames[dayOfWeekIndex],
      isWeekend: dayOfWeekIndex === 0 || dayOfWeekIndex === 6,
      isToday: dateObj.isSame(today, 'day'),
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