export const calculateWorkPeriods = (
  checkInTime,
  checkOutTime,
  restValue = 0,
  restUnit = "minutes"
) => {

  // HH:mm -> minutos
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours * 60) + minutes;
  };

  // minutos -> HH:mm
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}`;
  };

  // Convierte descanso según unidad
  const getRestMinutes = () => {

    const value = Number(restValue) || 0;

    switch (restUnit.toLowerCase()) {
      case "hours":
        return value * 60;

      case "minutes":
      default:
        return value;
    }
  };

  let checkIn = timeToMinutes(checkInTime);
  let checkOut = timeToMinutes(checkOutTime);

  // Soporte turno nocturno
  if (checkOut < checkIn) {
    checkOut += 24 * 60;
  }

  const totalMinutesWorked = checkOut - checkIn;

  const restMinutes = getRestMinutes();

  const activeMinutes = Math.max(
    totalMinutesWorked - restMinutes,
    0
  );

  return {
    totalPeriod: minutesToTime(totalMinutesWorked),
    activePeriod: minutesToTime(activeMinutes),

    totalMinutes: totalMinutesWorked,
    activeMinutes,
    restMinutes
  };
}