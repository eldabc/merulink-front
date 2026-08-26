import { useCallback } from 'react';
import dayjs from 'dayjs';

export function useScheduleValidation() {
  
  const runLiveValidation = useCallback((currentRows) => {
    const alerts = [];

    currentRows.forEach((employee) => {
      const fortnightDates = Object.keys(employee.dates || {});
      let consecutiveWorkDays = 0;
      let maxConsecutiveWorkDays = 0;
      let maxConsecutiveEndDate = null;
      let restDaysCount = 0;

      fortnightDates.forEach((dateStr, index) => {
        const dayData = employee.dates[dateStr];
        const currentShift = dayData?.shift;

        const isRestDay = !currentShift || currentShift.id === 'S-0' || currentShift.id === 'S-1' || currentShift.id === 'S-2' || currentShift.id === 'S-3';

        if (isRestDay) {
          consecutiveWorkDays = 0;
          restDaysCount++;
        } else {
          consecutiveWorkDays++;

          if (consecutiveWorkDays > maxConsecutiveWorkDays) {
            maxConsecutiveWorkDays = consecutiveWorkDays;
            maxConsecutiveEndDate = dateStr;
          }
        }

        if (isRestDay) return;

        const hasNonWorkingHoliday = dayData?.events?.some(e => e.nonWorking === true);

        if (hasNonWorkingHoliday) {
          alerts.push({
            id: `${employee.id}-${dateStr}-holiday`,
            type: 'holiday',
            message: `⚠️ Está asignando turno a **${employee.fullName}** el día **${dayjs(dateStr).format('DD-MM-YYYY')}**, el cual es un feriado no laborable.`
          });
        }

        if (index < fortnightDates.length - 1) {
          const nextDateStr = fortnightDates[index + 1];
          const nextShift = employee.dates[nextDateStr]?.shift;

          if (nextShift && !nextShift.isSystemShift) {
            const currentCheckOut = currentShift.checkOutTime;
            const nextCheckIn = nextShift.checkInTime;

            if (currentCheckOut && nextCheckIn) {
              // Si el turno cruza medianoche (checkIn > checkOut), la salida real ocurre al día siguiente
              const crossesMidnight = currentShift.checkInTime > currentShift.checkOutTime;
              const actualOutDate = crossesMidnight ? nextDateStr : dateStr;

              const outDateTime = dayjs(`${actualOutDate} ${currentCheckOut}`);
              const inDateTime = dayjs(`${nextDateStr} ${nextCheckIn}`);
              const diffInHours = inDateTime.diff(outDateTime, 'hour', true);

              if (diffInHours < 12) {
                alerts.push({
                  id: `${employee.id}-${dateStr}-rest`,
                  type: 'rest',
                  message: `⏱️ **${employee.fullName}** termina su turno a las ${outDateTime.format('hh:mm A')} (${dayjs(actualOutDate).format('DD-MM-YYYY')}) 
                             e inicia el siguiente a las ${inDateTime.format('hh:mm A')} (${dayjs(nextDateStr).format('DD-MM-YYYY')}). 
                             ¡Descanso menor a 12 horas! (${diffInHours.toFixed(1)} hrs).`          
                });
              }
            }
          }
        }
      });

      // Se evalúa al terminar de revisar todos los días del empleado
      if (maxConsecutiveWorkDays > 5) {
        alerts.push({
          id: `${employee.id}-${maxConsecutiveEndDate}-consecutive`,
          type: 'consecutive-work',
          message: `🚨 **${employee.fullName}** lleva **${maxConsecutiveWorkDays} días seguidos** trabajando sin descanso al llegar al día **${dayjs(maxConsecutiveEndDate).format('DD/MM/YYYY')}**.`
        });
      }

      if (restDaysCount < 3) {
        alerts.push({
          id: `${employee.id}-insufficient-rest`,
          type: 'insufficient-rest',
          message: `📊 **${employee.fullName}** solo tiene **${restDaysCount} ${restDaysCount === 1 ? 'día libre' : 'días libres'}** en toda la quincena. Requiere un mínimo de 3 días de descanso.`
        });
      }
    });

    return alerts;
  }, []);

  /**
   * Valida que cada día de la quincena tenga al menos 1 trabajador asignado por turno.
   * Solo evalúa turnos reales (no libres, bajas ni vacaciones).
   */
  const runShiftCoverageValidation = useCallback((currentRows, workingShifts, fortnightDays) => {
    const alerts = [];

    if (!workingShifts || workingShifts.length === 0) return alerts;
    if (!fortnightDays || fortnightDays.length === 0) return alerts;
    if (!currentRows || currentRows.length === 0) return alerts;

    fortnightDays.forEach((day) => {
      workingShifts.forEach((shift) => {
        // Cuenta cuántos empleados tienen este turno en este día
        const assignedCount = currentRows.filter((row) => {
          const shiftId = row.dates?.[day.date]?.shift?.id;
          return shiftId === shift.id;
        }).length;

        if (assignedCount === 0) {
          alerts.push({
            id: `coverage-${day.date}-${shift.id}`,
            type: 'shift-coverage',
            message: `⚠️ El turno <strong>${shift.letterShift || shift.description || shift.id}</strong> no tiene ningún trabajador asignado el día <strong>${dayjs(day.date).format('DD/MM/YYYY')}</strong>.`
          });
        }
      });
    });

    return alerts;
  }, []);

  return { runLiveValidation, runShiftCoverageValidation };
}