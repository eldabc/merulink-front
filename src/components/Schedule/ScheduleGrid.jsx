import React, { forwardRef, useMemo, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { useFormContext } from "react-hook-form";
import dayjs from 'dayjs';

import { truncateText } from '../../utils/text-utils';
import { getDisabledClasses } from '../../utils/global-utils';
import { statusOptions } from '../../utils/StaticData/schedule-utils';

import SpanText from '../Shared/SpanText';
import ShiftLegend from '../Shift/ShiftLegend';
import ScheduleLegend from './ScheduleLegend';
import LabelFieldForm from '../Shared/LabelFieldForm';
import SelectGeneric from '../Shared/SelectGeneric';
import ErrorMessage from '../Shared/ErrorMessage';
import LiveAlerts from '../Shared/LiveAlerts';
import ScheduleWorkflowSteps from './ScheduleWorkflowSteps';

// Registrar los módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

// Componente personalizado para renderizar HTML en ToolTip
const CustomTooltip = (params) => {
  if (!params.value) return null;
  return (
    <div 
      className="custom-grid-tooltip-container"
      dangerouslySetInnerHTML={{ __html: params.value }}
    />
  );
};

const ScheduleGrid = forwardRef(({ isClosed, scheduleSaved, groupedEmployees, fortnightDays, shifts, loading, onSave, mode }, ref) => {
  
  const { register, formState: { errors } } = useFormContext();
  const [brushShift, setBrushShift] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]); // Almacenar las alertas en vivo
  
  const viewMode = mode === 'view';
  const disabledClasses = getDisabledClasses(viewMode);

  // Mapeo rápido de días quincenales indexados por fecha para agilizar lecturas de festivos
  const daysMap = useMemo(() => {
    return fortnightDays.reduce((acc, curr) => {
      acc[curr.date] = curr;
      return acc;
    }, {});
  }, [fortnightDays]);

  useEffect(() => {
    setBrushShift(null);
    setLiveAlerts(null);
  }, [fortnightDays]);

  // VALIDACIÓN EN VIVO
  const runLiveValidation = useCallback((currentRows) => {
    const alerts = [];

    currentRows.forEach((employee) => {
      const fortnightDates = Object.keys(employee.dates || {});
      let consecutiveWorkDays = 0;

      fortnightDates.forEach((dateStr, index) => {
        const dayData = employee.dates[dateStr];
        const currentShift = dayData?.shift;

        const isRestDay = !currentShift || currentShift.id === 'S-0' || currentShift.id === 'S-1' || currentShift.id === 'S-2';

        if (isRestDay) {
          consecutiveWorkDays = 0;
        } else {
          consecutiveWorkDays++;

          // ALERTA: Más de 5 días seguidos trabajando
          if (consecutiveWorkDays > 5) {
            alerts.push({
              id: `${employee.id}-${dateStr}-consecutive`,
              type: 'consecutive-work',
              message: `🚨 **${employee.fullName}** lleva **${consecutiveWorkDays} días seguidos** trabajando sin descanso al llegar al día **${dayjs(dateStr).format('DD/MM/YYYY')}**.`
            });
          }
        }

        // Si es día descanso, no ejecuta el resto de validaciones
        if (isRestDay) return;

        const hasNonWorkingHoliday = dayData?.events?.some(e => e.nonWorking === true);

        // ALERTA: Trabajando en día feriado
        if (hasNonWorkingHoliday) {
          alerts.push({
            id: `${employee.id}-${dateStr}-holiday`,
            type: 'holiday',
            message: `⚠️ Está asignando turno a **${employee.fullName}** el día **${dayjs(dateStr).format('DD-MM-YYYY')}**, el cual es un feriado no laborable.`
          });
        }

        // ALERTA: Descanso menor a 12 horas entre turnos consecutivos
        if (index < fortnightDates.length - 1) {
          const nextDateStr = fortnightDates[index + 1];
          const nextShift = employee.dates[nextDateStr]?.shift;

          // Si el día siguiente tiene un turno asignado no libre o del sistema especial
          if (nextShift && !nextShift.isSystemShift) {
            const currentCheckOut = currentShift.checkOutTime; // Esperado: "HH:mm:ss" o "HH:mm"
            const nextCheckIn = nextShift.checkInTime;

            if (currentCheckOut && nextCheckIn) {
              // Combina la fecha real con la hora para tener instancias exactas en el tiempo
              const outDateTime = dayjs(`${dateStr} ${currentCheckOut}`);
              const inDateTime = dayjs(`${nextDateStr} ${nextCheckIn}`);

              // .diff() calcula la diferencia ('hour' con decimales)
              const diffInHours = inDateTime.diff(outDateTime, 'hour', true);

              if (diffInHours < 12) {
                alerts.push({
                  id: `${employee.id}-${dateStr}-rest`,
                  type: 'rest',
                  message: `⏱️ **${employee.fullName}** termina su turno a las ${outDateTime.format('hh:mm A')} 
                            (${dayjs(dateStr).format('DD-MM-YYYY')}) e inicia el siguiente a las 
                            ${inDateTime.format('hh:mm A')} (${dayjs(nextDateStr).format('DD-MM-YYYY')}). 
                            ¡Descanso menor a 12 horas! (${diffInHours.toFixed(1)} hrs).`
                });
              }
            }
          }
        }
      });
    });

    setLiveAlerts(alerts);
  }, [daysMap]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const handleCellClicked = (params) => {
    if (!brushShift) return;
    
    const dateFieldName = params.column.getColId();
    const currentShiftId = params.value;

    // Si es baja/vacaciones bloquea que la brocha pinte encima
    if (currentShiftId === 'S-1' || currentShiftId === 'S-2') return;

    const updatedData = { ...params.data };
    // Extrae la fecha limpia quitando el prefijo 'date_'
    const rawDate = dateFieldName.replace('date_', '');

    if (currentShiftId === brushShift.id) {
      updatedData.dates[rawDate] = {
        ...updatedData.dates[rawDate],
        shift: {
          id: 'S-0',
          letterShift: 'L',
          color: '#535759',
          isSystemShift: true
        }
      };
    } else {
      updatedData.dates[rawDate] = {
        ...updatedData.dates[rawDate],
        shift: { ...brushShift }
      };
    }

    params.node.setData(updatedData);
    params.api.refreshCells({ rowNodes: [params.node], columns: [dateFieldName], force: true });

    // Disparar validación inmediatamente después de cambiar la celda activa
    if (gridApi) {
      const currentRows = [];
      gridApi.forEachNode(node => currentRows.push(node.data));
      runLiveValidation(currentRows);
    }
  };

  const collectGridPayload = useCallback(() => {
    if (!gridApi) return { shifts: shifts || [], schedules: [] };

    const schedulesBatch = [];
    gridApi.forEachNode((node) => {
      const row = node.data;
      schedulesBatch.push({
        employeeId: row.id,
        subDepartmentId: row.subDepartment?.id || null,
        isVacation: !!row.vacation,
        dates: row.dates
      });
    });

    return { shifts: shifts || [], schedules: schedulesBatch };
  }, [gridApi, shifts]);

  useImperativeHandle(ref, () => ({
    collectGridPayload
  }), [collectGridPayload]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setBrushShift(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const myTheme = useMemo(() => {
    return themeQuartz.withParams({
      baseTheme: 'dark',
      accentColor: '#00A4BC', 
      backgroundColor: '#535557', 
      textColor: '#E0E0E0',
    });
  }, []); 
  
  const rowData = useMemo(() => {
    if (!groupedEmployees) return [];
    
    const flatRows = [];
    Object.keys(groupedEmployees).forEach((subDeptName) => {
      groupedEmployees[subDeptName].forEach((employee) => {
        flatRows.push({
          ...employee,
          fullName: `${employee.firstName} ${employee.lastName || ''}`.trim()
        });
      });
    });
    
    return flatRows;
  }, [groupedEmployees]);

  // Ejecutar la validación al renderizar por primera vez
  useEffect(() => {
    if (rowData.length > 0) {
      runLiveValidation(rowData);
    }
  }, [rowData, runLiveValidation]);

  const columnDefs = useMemo(() => {
    const baseCols = [
      { 
        headerName: 'Empleado', 
        field: 'fullName', 
        pinned: 'left', 
        width: 200,
        cellRenderer: (params) => {
          if (params.data.vacation) return `🌴 ${params.value} (Vacaciones)`;
          return params.value;
        }
      }
    ];

    const dayCols = fortnightDays.map((day) => {
      return {        
        headerName: `${day.dayName} ${day.dayNumber}`, 
        field: `date_${day.date}`, 
        
        headerValueGetter: (params) => {
          const columnWidth = params.column.getActualWidth();
          if (columnWidth < 65) return `${day.dayNumber}`;
          return `${day.dayName} ${day.dayNumber}`;
        },

        // Retorna el ID del shift asignado a esa fecha específica
        valueGetter: (params) => {
          return params.data.dates?.[day.date]?.shift?.id ?? 'S-0';
        },

        // MÁSCARA VISUAL: Retorna el código o letterShift directo del objeto mandado por el Back
        valueFormatter: (params) => {
          const shiftObj = params.data.dates?.[day.date]?.shift;
          return shiftObj?.letterShift || 'L'; 
        },

        cellStyle: (params) => {
          const baseStyle = { textAlign: 'center' };
          const dayData = params.data.dates?.[day.date];
          const shiftObj = dayData?.shift;
          const eventsList = dayData?.events || [];
          const currentShiftId = shiftObj?.id;

          // Si hay al menos un evento para colorear, pinta el borde
          const hasHighlightedEvent = eventsList.length > 0;

          if (hasHighlightedEvent) {
            baseStyle.boxShadow = 'inset 0 0 0 2px #ef4444';
          }

          if (shiftObj?.color) {
            if (currentShiftId === 'S-0' && day.isWeekend) {
              return { ...baseStyle, backgroundColor: '#f8d7da', color: '#81262e' };
            }
            if (currentShiftId === 'S-0') {              
              if (day.isToday) return { ...baseStyle, backgroundColor: '#3b82f6' };
              if (day.isWeekend) return { ...baseStyle, backgroundColor: '#f8d7da', color: '#81262e' };
            }
            return { ...baseStyle, backgroundColor: shiftObj.color };
          }    

          return baseStyle;
        },
        tooltipValueGetter: (params) => {
          const eventsList = params.data.dates?.[day.date]?.events || [];
          if (!eventsList || eventsList.length === 0) return null;

          const titleHtml = `<div class="tooltip-title">Eventos Destacados</div>`;
          const listHtml = eventsList
            .map((e, index) => `<div class="tooltip-item">${index + 1}. ${truncateText(e?.title ?? '', 25)}</div>`)
            .join('');

          return `<div class="custom-grid-tooltip">${titleHtml}${listHtml}</div>`;
        },
        flex: 1,          
        minWidth: 35,      
        resizable: true,
        sortable: false,
        suppressMovable: true,
        // Bloquea edición si es baja/vacaciones
        editable: (params) => params.value !== 'S-1' && params.value !== 'S-2',
        cellClassRules: {
          'cursor-not-allowed opacity-60 select-none text-gray-400 bg-gray-100': (params) => params.value === 'S-1' || params.value === 'S-2' ,
        },
        cellClass: '!font-bold',
        headerClass: () => {
          const classes = [];
          if (day.isToday) classes.push('header-today');
          if (day.isWeekend) classes.push('header-weekend');
          return classes.join(' ');
        }
      };
    });

    return [...baseCols, ...dayCols];
  }, [fortnightDays]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: false,
    resizable: true,
    sortingOrder: ['asc', 'desc'],
    tooltipComponent: CustomTooltip,
  }), []);

  const isDataPending = loading || shifts === undefined;
  const hasShiftGrid = !isDataPending && shifts?.length > 0;
  
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 p-2 rounded-md text-sm">
        {isDataPending ? (
          <SpanText text="Cargando..." />
        ) : (
          hasShiftGrid ? ( 
            <>
            <div className="div-border w-full flex flex-col md:flex-row gap-6 items-center justify-between p-4 rounded-lg transition-all duration-300">
              <div className="w-full md:w-auto md:max-w-[40%] flex-shrink-0">
                <ShiftLegend shifts={shifts} activeBrush={brushShift} onSelectBrush={setBrushShift} viewMode={viewMode} />
              </div>

              {liveAlerts.length > 0 && <LiveAlerts alerts={liveAlerts} /> }
            </div>

              <div className="relative w-full h-auto shadow-sm rounded-lg overflow-hidden">
                {isClosed && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden select-none bg-[#2f3d4473]">
                    <div className="dark:text-gray-400/40 text-5xl md:text-8xl font-black uppercase tracking-widest transform -rotate-20 whitespace-nowrap">
                      Quincena cerrada
                    </div>
                  </div>
                )}

                <div className={`ag-theme-quartz w-full h-[500px] shadow-sm rounded-lg overflow-hidden ${brushShift ? 'cursor-brocha' : ''}`}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    readOnlyEdit={viewMode} 
                    suppressCellFocus={viewMode}
                    rowSelection={
                      viewMode 
                        ? { mode: 'none' } 
                        : { mode: 'multiRow', checkboxes: false, headerCheckbox: false, enableClickSelection: true } 
                    }
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    theme={myTheme}
                    onCellClicked={handleCellClicked}
                    localeText={{ noRowsToShow: 'No hay registros para mostrar', loadingOoo: 'Cargando datos...' }}
                    onGridReady={onGridReady}
                    tooltipShowDelay={0}
                  />
                </div>
              </div>
              
              {scheduleSaved && ( <ScheduleWorkflowSteps viewMode={viewMode} /> )}

              <div className="flex flex-col md:flex-row gap-3 w-full div-border">
                <ScheduleLegend />
                <div className="flex flex-col w-full md:flex-1"> 
                  <LabelFieldForm field="Observación" dinamicClasses="mb-2" />
                  <textarea
                    readOnly={mode === 'view'}
                    {...register('observations')}
                    rows="5"                 
                    cols="33"                 
                    placeholder="Escribe aquí una observación..."
                    className={`filter-input p-2 ${disabledClasses}`}
                  />
                  {errors?.observations && <ErrorMessage msg={errors.observations.message} />}  
                </div>  
              </div>
            </>
          ) : (
            <SpanText text="Sin turnos disponibles para este departamento" />
          )
        )}
      </div>
    </div>
  );
});

export default ScheduleGrid;