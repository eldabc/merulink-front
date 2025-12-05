export const calculateAge = (watchedBirthDate, setValue) => {  
    if (!watchedBirthDate) {
      setValue('age', '');
      return;
    }
    const bd = new Date(watchedBirthDate);
    if (isNaN(bd.getTime())) {
      setValue('age', '');
      return;
    }
    const today = new Date();
    let edad = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) {
      edad--;
    }
    if (edad < 0) edad = 0;
    setValue('age', String(edad));
};

/**
 * Convierte una fecha a la cadena "YYYY-MM-DD" requerida por input type="date".
 * @param {Date} date - Objeto Date a formatear.
 * @returns {string} Fecha formateada.
 */
export const todayFormatted = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  // El mes y el día necesitan ser rellenados con un cero si son menores a 10
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};