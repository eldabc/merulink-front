/**
 * Genera el array de fechas de una quincena específica con nombres de días y colores de fin de semana.
 * @param {number|string} year - Año actual (ej: 2026)
 * @param {number|string} monthId - ID del mes (1 = Enero, 12 = Diciembre)
 * @param {number|string} fortnight - Quincena elegida (1 o 2)
 * @returns {Array} Array de objetos de días listos para la cabecera
 */
export const getFortnightDays = (year, monthId, fortnight) => {
  const days = [];
  const monthIndex = parseInt(monthId, 10) - 1;
  const intFortnight = parseInt(fortnight, 10);

  // Mapeo corto en español como se ve en tu imagen
  const dayNames = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'];

  let startDay = 1;
  let endDay = 15;

  if (intFortnight === 2) {
    startDay = 16;
    endDay = new Date(year, monthIndex + 1, 0).getDate();
  }

  for (let d = startDay; d <= endDay; d++) {
    const dateObj = new Date(year, monthIndex, d);
    
    // Obtener el índice del día de la semana (0 = Domingo, 6 = Sábado)
    const dayOfWeekIndex = dateObj.getDay();
    const dayName = dayNames[dayOfWeekIndex];

    // Formatear string YYYY-MM-DD
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Determinar si es fin de semana (Sábado o Domingo)
    const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6;

    days.push({
      date: formattedDate,     // "2026-05-16"
      dayNumber: d,            // 16
      dayName: dayName,        // "Sáb."
      isWeekend: isWeekend,    // true/false (Útil por si necesitas lógica extra)
      // Te añado las propiedades de estilos de Tailwind listas para usar
      colorClass: isWeekend ? 'text-red-400 font-medium' : 'text-gray-700',
      borderClass: isWeekend ? 'border-red-300' : 'border-gray-200'
    });
  }

  return days;
};