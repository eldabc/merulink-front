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

  const handleCellClicked = (params) => {
    if (!brushShift) return;
    
    // Si la celda es de vacaciones (ID -1), bloquea que la brocha pinte encima
    const currentShiftId = params.value;
    if (currentShiftId === -1) return;

    const dateFieldName = params.column.getColId();
    const updatedData = { ...params.data };

    // Extrae la fecha limpia quitando el prefijo 'date_'
    const rawDate = dateFieldName.replace('date_', '');

    // Actualiza la estructura de la celda con el nuevo turno de la brocha
    updatedData.dates[rawDate] = {
      shift: { ...brushShift }
    };

    // Notificar a AG Grid el cambio de fila
    params.node.setData(updatedData);

    // Refrescar celda para recalcular estilos de color
    params.api.refreshCells({ rowNodes: [params.node], columns: [dateFieldName], force: true });
  };

  // RECOLECCIÓN DEL LOTE (Simplificado: Ya viene listo desde el backend)
  const collectGridPayload = useCallback(() => {
    if (!gridApi) return { shifts: shifts || [], schedules: [] };

    const schedulesBatch = [];

    gridApi.forEachNode((node) => {
      const row = node.data;
      
      schedulesBatch.push({
        employeeId: row.id,
        subDepartmentId: row.subDepartment?.id || null,
        isVacation: !!row.vacation,
        dates: row.dates // Directo: Ya mantiene la estructura JSON exacta
      });
    });

  return {
      shifts: shifts || [],
      schedules: schedulesBatch
    };
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
  
  // RENDERIZADO DE FILAS
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

    // Columnas de días dinámicas mapeadas directamente desde el objeto 'dates' enviado por el Back
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
          return params.data.dates?.[day.date]?.shift?.id ?? 0;
        },

        // MÁSCARA VISUAL: Retorna el código o letterShift directo del objeto mandado por el Back
        valueFormatter: (params) => {
          const shiftObj = params.data.dates?.[day.date]?.shift;
          return shiftObj?.letterShift || shiftObj?.letterShift || 'L';
        },

        // Estilos
        cellStyle: (params) => {
          
          const baseStyle = { textAlign: 'center' };
          
          // Extrae el objeto shift directo de la fila usando la fecha de la columna
          const shiftObj = params.data.dates?.[day.date]?.shift;
          const currentShiftId = shiftObj?.id;

          // Si el objeto tiene un color definido por el backend, lo pinta de inmediato
          if (shiftObj?.color) {
            // Si es fin de semana y es un día libre (ID 0), fuerza el color de fin de semana
            if (currentShiftId === 0 && day.isWeekend) {
              return {
                ...baseStyle,
                backgroundColor: '#f8d7da',
                color: '#81262e'
              };
            }

            if (currentShiftId === 0) {              
              if (day.isToday) return { ...baseStyle, backgroundColor: '#3b82f6' };
              if (day.isWeekend) return { ...baseStyle, backgroundColor: '#f8d7da', color: '#81262e' };
            }

            return {
              ...baseStyle,
              backgroundColor: shiftObj.color
            };
          }    

          return baseStyle;
        },
        flex: 1,          
        minWidth: 35,      
        resizable: true,
        sortable: false,
        suppressMovable: true,
        
        // Bloquea edición si es vacaciones (ID -1)
        editable: (params) => params.value !== -1,

        // Clases utilitarias de AG Grid según el tipo de celda
        cellClassRules: {
          'cursor-not-allowed opacity-60 select-none text-gray-400 bg-gray-100 pointer-events-none': (params) => params.value === -1,
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
                  rowSelection={{ mode: 'multiRow', checkboxes: false, headerCheckbox: false, enableClickSelection: false }}
                  onCellClicked={handleCellClicked}
                  localeText={{ noRowsToShow: 'No hay registros para mostrar', loadingOoo: 'Cargando datos...' }}
                  onGridReady={onGridReady}
                />
              </div>

              <ScheduleLegend />
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