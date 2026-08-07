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

const monthNamesES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function getFortnightDetails(date, indicator = 'current') {
  const referenceDate = dayjs(date);
  if (!referenceDate.isValid()) {
    return null;
  }

  const currentDay = referenceDate.date();
  const currentFortnight = currentDay <= 15 ? 1 : 2;

  let year = referenceDate.year();
  let month = referenceDate.month() + 1; // dayjs months are 0-indexed
  let fortnightNumber = currentFortnight;

  if (indicator === 'next') {
    if (currentFortnight === 1) {
      fortnightNumber = 2;
    } else {
      fortnightNumber = 1;
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  } else if (indicator === 'before') {
    if (currentFortnight === 2) {
      fortnightNumber = 1;
    } else {
      fortnightNumber = 2;
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
    }
  }

  const monthString = String(month).padStart(2, '0');
  const startDay = fortnightNumber === 1 ? 1 : 16;
  const endDay = fortnightNumber === 1
    ? 15
    : dayjs(`${year}-${monthString}-01`).endOf('month').date();

  return {
    year,
    month,
    monthName: monthNamesES[month - 1],
    fortnightNumber,
    fortnightLabel: `${fortnightNumber}ª Quincena`,
    start: formatDate(year, month, startDay),
    end: formatDate(year, month, endDay),
  };
}

// Determina el estado final del horario
export function resolveFinalStatus(data) {

  if (data.isClosed) return 'closed';

  if (data.isApproved) return 'approved';

  if (data.isReviewed) return 'reviewed';

  return 'created'; // Estado por defecto
};
