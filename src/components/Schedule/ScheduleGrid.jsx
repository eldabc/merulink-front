import React, { forwardRef, useMemo, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import SpanText from '../Shared/SpanText';

import ShiftLegend from '../Shift/ShiftLegend';
import ScheduleLegend from './ScheduleLegend';

// Registrar los módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

const ScheduleGrid = forwardRef(({ groupedEmployees, fortnightDays, shifts, loading, onSave }, ref) => {

  const [brushShift, setBrushShift] = useState(null);
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  // Busca el ID del turno 'L' para usarlo por defecto
  const freeShiftObj = useMemo(() => {
    return shifts?.find(s => s.letterShift === 'L') || { id: null };
  }, [shifts]);

  const absenceShiftObj = useMemo(() => {
    return shifts?.find(s => s.letterShift === 'VAC') || { id: null };
  }, [shifts]);

  const handleCellClicked = (params) => {
    if (!brushShift) return;
    
    // Modificamos la validación por si params.value ahora es un objeto o sigue siendo un ID
    const currentShiftId = params.value?.id ?? params.value;
    if (currentShiftId === absenceShiftObj.id) return;

    const dateFieldName = params.column.getColId();

    // Clona la data actual de la fila para no mutar el estado directamente
    const updatedData = { ...params.data };

    // Asigna el OBJETO COMPLETO de la brocha a la fecha params.data[`date_2026-05-01`] será { id: X, letterShift: 'A', color: '#fff'... }
    updatedData[dateFieldName] = brushShift;

    // Forzar AG Grid a actualizar los datos de la fila completa e interniar el objeto
    params.node.setData(updatedData);

    // Refrescar la celda para que el renderizador aplique los nuevos estilos
    params.api.refreshCells({ rowNodes: [params.node], columns: [dateFieldName], force: true });
    console.log(`Empleado ID: ${updatedData.id}, Guardando Objeto de Turno completo:`, brushShift);
  };

  const formatShiftDay = (shiftData) => {
    return {
      shift: {
        ...shiftData
      }
    }
  };

  // RECOLECCIÓN DEL LOTE
  const collectGridPayload = useCallback(() => {
    if (!gridApi) return { shifts: shifts || [], schedules: [] };

    const schedulesBatch = [];

    gridApi.forEachNode((node) => {
      const row = node.data;
      // console.log("row", row)
      
      const employeeSchedule = {
        employeeId: row.id,
        subDepartmentId: row.subDepartmentId || null,
        isVacation: !!row.vacation,
        dates: {}
      };

      fortnightDays.forEach((day) => {
        const dateKey = `date_${day.date}`;       
        if (row.vacation && row.vacation.start && row.vacation.end) {
          const columnDate = new Date(day.date.replace(/-/g, '/'));
          const startDate = new Date(row.vacation.start.replace(/-/g, '/'));
          const endDate = new Date(row.vacation.end.replace(/-/g, '/'));
          
          if (columnDate >= startDate && columnDate <= endDate) {
            employeeSchedule.dates[day.date] = formatShiftDay(absenceShiftObj);
          } else {
            employeeSchedule.dates[day.date] = formatShiftDay(row[dateKey] || freeShiftObj);
          }

        } else {
          employeeSchedule.dates[day.date] = formatShiftDay(row[dateKey] || freeShiftObj);
        }
      });

      schedulesBatch.push(employeeSchedule);
    });

    return {
      shifts: shifts || [],
      schedules: schedulesBatch
    };
  }, [gridApi, fortnightDays, shifts, absenceShiftObj, freeShiftObj]);

  const handleBulkCollect = () => {
    const payload = collectGridPayload();

    if (onSave) {
      onSave(payload);
    } else {
      console.log("Payload 100% IDs listo para la BD:", payload);
    }

    return payload;
  };

  useImperativeHandle(ref, () => ({
    collectGridPayload
  }), [collectGridPayload]);

  const localeText = useMemo(() => ({
    noRowsToShow: 'No hay registros para mostrar',
    loadingOoo: 'Cargando datos...',
  }), []);

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
  
  // TRADUCCIÓN INICIAL DE LETRAS A IDs
  const rowData = useMemo(() => {
    if (!groupedEmployees || !shifts) return [];
    
    const flatRows = [];
    Object.keys(groupedEmployees).forEach((subDeptName) => {
      groupedEmployees[subDeptName].forEach((employee) => {
        const formattedEmployee = {
          ...employee,
          // subDepartmentName: subDeptName, 
          fullName: `${employee.firstName} ${employee.lastName || ''}`.trim()
        };

        // Si el backend mandó letras (ej: "M"), las convertimos inmediatamente al ID del catálogo
        fortnightDays.forEach((day) => {
          const dateKey = `date_${day.date}`;
          const currentLetter = employee[dateKey];
          
          if (currentLetter && currentLetter !== 'L') {
            const matchShift = shifts.find(s => s.letterShift === currentLetter);
            formattedEmployee[dateKey] = matchShift ? matchShift : freeShiftObj;
          } else {
            // Si viene vacío o es 'L', le setea directamente ID del turno libre
            formattedEmployee[dateKey] = freeShiftObj;
          }
        });

        flatRows.push(formattedEmployee);
      });
    });
    
    return flatRows;
  }, [groupedEmployees, shifts, fortnightDays, freeShiftObj]);

  const columnDefs = useMemo(() => {
    const baseCols = [
      { 
        headerName: 'Empleado', 
        field: 'fullName', 
        pinned: 'left', 
        width: 200,
        cellClassRules: {
          'pointer-events-none cursor-not-allowed opacity-50 select-none text-gray-600 bg-gray-50': (params) => !!params.data.vacation, 
          'pointer-events-none': (params) => !params.data.vacation,
        },
        cellRenderer: (params) => {
          if (params.data.vacation) return `🌴 ${params.value} (Vacaciones)`;
          return params.value;
        }
      }
    ];

    // Días de la quincena
    const dayCols = fortnightDays.map((day) => {
  
      // Evalua si esta columna específica coincide con el día de hoy
      return {        
        headerName: `${day.dayName} ${day.dayNumber}`, 
        field: `date_${day.date}`, 
        
        headerValueGetter: (params) => {
          const columnWidth = params.column.getActualWidth();
          if (columnWidth < 65) return `${day.dayNumber}`;
          return `${day.dayName} ${day.dayNumber}`;
        },

        // Asigna 'VAC' solo si el día actual está en el rango
        valueGetter: (params) => {
          const vacation = params.data.vacation;
          if (vacation && vacation.start && vacation.end) {
            const columnDate = new Date(day.date.replace(/-/g, '/'));
            const startDate = new Date(vacation.start.replace(/-/g, '/'));
            const endDate = new Date(vacation.end.replace(/-/g, '/'));

            if (columnDate >= startDate && columnDate <= endDate) {
              return 'VAC';
            }
          }

          // Extrae el valor crudo que da la consola
          const cellValue = params.data[`date_${day.date}`];

          if (cellValue && typeof cellValue === 'object') {
            return cellValue.id;
          }

          // Si es 0 (u otro ID primitivo), lo deja pasar. Si es null/undefined, usa el id del libre (0)
          return cellValue.id ?? freeShiftObj.id;
        },

        // MÁSCARA VISUAL: Muestra 'VAC' o la letra del turno
        valueFormatter: (params) => {
          if (params.value === 'VAC') return 'VAC';
          const found = shifts?.find(s => s.id === params.value);
          return found ? found.letterShift : 'L';
        },

        cellStyle: (params) => {
          if (params.value === 'VAC') return null;
          
          const cellValue = params.data[`date_${day.date}`];
          const currentShiftId = cellValue.id ?? freeShiftObj.id;
          // console.log("aquiii",params.data)
          const baseStyle = { textAlign: 'center' };
          const currentShift = shifts?.find(s => s.id === Number(currentShiftId));
          const isFreeShift = Number(currentShiftId) === Number(freeShiftObj.id);

          // SOLO L usa colores especiales
          if (isFreeShift) {

            if (day.isToday) {
              return {
                ...baseStyle,
                backgroundColor:'#3b82f6'
              };
            }

            if (day.isWeekend) {
              return {
                ...baseStyle,
                backgroundColor:'#f8d7da',
                color:'#81262e'
              };
            }
          }

          // cualquier otro turno
          if (currentShift?.color) {
            return {
              ...baseStyle,
              backgroundColor: currentShift.color
            };
          }

          return baseStyle;
        },

        flex: 1,           
        minWidth: 35,      
        resizable: true,
        sortable: false,
        suppressMovable: true,
        
        // Bloquea la celda si es 'VAC'
        editable: (params) => params.value !== 'VAC',

        //  Aplica opacidad gris y bloquea clics en celdas 'VAC'
        cellClassRules: {
          'cursor-not-allowed opacity-60 select-none text-gray-400 bg-gray-100 pointer-events-none': (params) => params.value === 'VAC',
        },
        
        cellClass: '!font-bold',
        // headerClass: `${day.bgHeaderClass} ${day.borderClass}`,
        headerClass: params => {
          const classes = [];

          if (day.isToday) {
            classes.push('header-today');
          }

          if (day.isWeekend) {
            classes.push('header-weekend');
          }

          return classes.join(' ');
        }
      };
    });

    return [...baseCols, ...dayCols];
  }, [fortnightDays, shifts, freeShiftObj]);

  // Configuración por defecto todas las columnas
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: false,
    resizable: true,
    sortingOrder: ['asc', 'desc'],
  }), []);

  const isDataPending = loading || shifts === undefined;
  const hasShiftGrid = !isDataPending && shifts?.length > 2;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border rounded-md text-sm">
        {isDataPending ? (
          <SpanText text="Cargando..." />
        ) : (
          hasShiftGrid ? ( 
            <>
              <ShiftLegend shifts={shifts} activeBrush={brushShift} onSelectBrush={setBrushShift} /> 

              <div className={`ag-theme-quartz w-full h-[500px] shadow-sm rounded-lg overflow-hidden ${brushShift ? 'cursor-brocha' : ''}`}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  animateRows={true}
                  theme={myTheme}
                  rowSelection={{
                    mode: 'multiRow',
                    checkboxes: false, 
                    headerCheckbox: false,
                    enableClickSelection: false,
                  }}
                  
                  onCellClicked={handleCellClicked}
                  localeText={localeText}
                  onGridReady={onGridReady}
                />
              </div>

              <ScheduleLegend />

              {/* <div className="w-full flex justify-between items-center bg-white p-2 border rounded-md shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 px-2">Planificación de Horarios</h3>
                <button
                  onClick={handleBulkCollect}
                  disabled={isDataPending || !gridApi}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 text-white font-semibold rounded shadow-sm text-sm transition-all duration-200 cursor-pointer"
                >
                  Guardar Cambios por Lote
                </button>
              </div> */}
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
