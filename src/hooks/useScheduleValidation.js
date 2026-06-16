import { useCallback } from 'react';
import dayjs from 'dayjs';

export function useScheduleValidation() {
  
  const runLiveValidation = useCallback((currentRows) => {
    const alerts = [];

    currentRows.forEach((employee) => {
      const fortnightDates = Object.keys(employee.dates || {});
      let consecutiveWorkDays = 0;
      let restDaysCount = 0;

      fortnightDates.forEach((dateStr, index) => {
        const dayData = employee.dates[dateStr];
        const currentShift = dayData?.shift;

        const isRestDay = !currentShift || currentShift.id === 'S-0' || currentShift.id === 'S-1' || currentShift.id === 'S-2';

        if (isRestDay) {
          consecutiveWorkDays = 0;
          restDaysCount++;
        } else {
          consecutiveWorkDays++;

          if (consecutiveWorkDays > 5) {
            alerts.push({
              id: `${employee.id}-${dateStr}-consecutive`,
              type: 'consecutive-work',
              message: `🚨 **${employee.fullName}** lleva **${consecutiveWorkDays} días seguidos** trabajando sin descanso al llegar al día **${dayjs(dateStr).format('DD/MM/YYYY')}**.`
            });
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
              const outDateTime = dayjs(`${dateStr} ${currentCheckOut}`);
              const inDateTime = dayjs(`${nextDateStr} ${nextCheckIn}`);
              const diffInHours = inDateTime.diff(outDateTime, 'hour', true);

              if (diffInHours < 12) {
                alerts.push({
                  id: `${employee.id}-${dateStr}-rest`,
                  type: 'rest',
                  message: `⏱️ **${employee.fullName}** termina su turno a las ${outDateTime.format('hh:mm A')} (${dayjs(dateStr).format('DD-MM-YYYY')}) e inicia el siguiente a las ${inDateTime.format('hh:mm A')} (${dayjs(nextDateStr).format('DD-MM-YYYY')}). ¡Descanso menor a 12 horas! (${diffInHours.toFixed(1)} hrs).`
                });
              }
            }
          }
        }
      });

      // Se evalúa al terminar de revisar todos los días del empleado
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

  return { runLiveValidation };
}