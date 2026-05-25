/**
 * Genera el array de fechas de una quincena específica con nombres de días,
 * color rojo para fines de semana y azul para el día de hoy.
 * @param {number|string} year - Año actual (ej: 2026)
 * @param {number|string} monthId - ID del mes (1 = Enero, 12 = Diciembre)
 * @param {number|string} fortnight - Quincena elegida (1 o 2)
 * @returns {Array} Array de objetos de días listos para la cabecera
 */
export const getFortnightDays = (year, monthId, fortnight) => {
  const days = [];
  const monthIndex = parseInt(monthId, 10) - 1;
  const intFortnight = parseInt(fortnight, 10);

  const dayNames = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];

  // Obtener la fecha de HOY YYYY-MM-DD 
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

    // Asignación de estilos
    let colorClass = 'text-gray-700';
    let borderClass = 'border-gray-200';
    let bgHeaderClass = '';

    if (isToday) {
      colorClass = 'text-blue-600 font-bold';
      borderClass = 'border-blue-400';
      bgHeaderClass = 'bg-blue-50';
    } else if (isWeekend) {
      colorClass = 'text-red-500 font-medium';
      borderClass = 'border-red-300';
      bgHeaderClass = 'bg-red-50';
    }

    days.push({
      date: formattedDate,
      dayNumber: d,
      dayName: dayName,
      isWeekend: isWeekend,
      isToday: isToday, // Bandera para AG Grid
      colorClass: colorClass,
      borderClass: borderClass,
      bgHeaderClass: bgHeaderClass
    });
  }

  return days;
};