import React, { forwardRef, useMemo, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { useFormContext } from "react-hook-form";

import { truncateText } from '../../utils/text-utils';
import { getDisabledClasses } from '../../utils/global-utils';
import { statusOptions } from '../../utils/StaticData/schedule-utils';

import SpanText from '../Shared/SpanText';
import ShiftLegend from '../Shift/ShiftLegend';
import ScheduleLegend from './ScheduleLegend';
import LabelFieldForm from '../Shared/LabelFieldForm';
import SelectGeneric from '../Shared/SelectGeneric';
import ErrorMessage from '../Shared/ErrorMessage';

// Registrar los módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

// Componente personalizado para renderizar HTML en ToolTip
const CustomTooltip = (params) => {
  if (!params.value) return null;

  return (
    <div 
      className="custom-grid-tooltip-container"
      dangerouslySetInnerHTML={{ __html: params.value }} // Inyecta el HTML armado
    />
  );
};

const ScheduleGrid = forwardRef(({ isClosed, scheduleSaved, groupedEmployees, fortnightDays, shifts, loading, onSave, mode }, ref) => {
  
  const { register, formState: { errors } } = useFormContext();
  const [brushShift, setBrushShift] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const viewMode = mode === 'view';
  const disabledClasses = getDisabledClasses(viewMode);

  useEffect(() => {
    setBrushShift(null);
  }, [fortnightDays]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const handleCellClicked = (params) => {
    if (!brushShift) return;
    
    const currentShiftId = params.value;

    // Si es baja/vacaciones bloquea que la brocha pinte encima
    if (currentShiftId === 'S-1' || currentShiftId === 'S-2') return;

    const dateFieldName = params.column.getColId();
    const updatedData = { ...params.data };

    // Extrae la fecha limpia quitando el prefijo 'date_'
    const rawDate = dateFieldName.replace('date_', '');

    // Actualiza la estructura de la celda con el nuevo turno de la brocha
    updatedData.dates[rawDate] = {
      ...updatedData.dates[rawDate],
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
          return params.data.dates?.[day.date]?.shift?.id ?? 'S-0';
        },

        // MÁSCARA VISUAL: Retorna el código o letterShift directo del objeto mandado por el Back
        valueFormatter: (params) => {
          const shiftObj = params.data.dates?.[day.date]?.shift;
          return shiftObj?.letterShift || shiftObj?.letterShift || 'L';
        },

        // Estilos
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

        // Clases utilitarias de AG Grid según el tipo de celda
        cellClassRules: {
          'cursor-not-allowed opacity-60 select-none text-gray-400 bg-gray-100': (params) => params.value === 'S-1' || params.value === 'S-2' , // pointer-events-none
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
              <div className="div-border w-full flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-lg">
                <ShiftLegend shifts={shifts} activeBrush={brushShift} onSelectBrush={setBrushShift} viewMode={viewMode} />
                {scheduleSaved && (
                  <div>
                    <LabelFieldForm field="Estado" dinamicClasses="mb-3"/>
                    <SelectGeneric 
                      name="status"
                      disabled={viewMode} 
                      dynamicClasses={`${disabledClasses}`} 
                      dataSelect={statusOptions}
                    />
                </div>
                )}
              </div>
              <div className="relative w-full h-auto shadow-sm rounded-lg overflow-hidden">
                {isClosed && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#2f3d4473]">
                    <div className="bg-[#2f3d44] px-6 py-3 rounded-xl shadow-2xl border border-[#9fd8ff] flex items-center gap-3">
                      Quincena cerrada
                    </div>
                  </div>
                )}

                <div className={`ag-theme-quartz w-full h-[500px] shadow-sm rounded-lg overflow-hidden ${brushShift ? 'cursor-brocha' : ''}`}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    readOnlyEdit={viewMode} 
                    suppressCellFocus={viewMode} // Evita el recuadro de enfoque en modo vista  
                    rowSelection={
                      viewMode 
                        ? { mode: 'none' } // En modo vista, apaga por completo cualquier selección
                        : { mode: 'multiRow', checkboxes: false, headerCheckbox: false, enableClickSelection: true } // En modo edición, permite seleccionar filas normalmente
                    }
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    theme={myTheme}
                    onCellClicked={handleCellClicked}
                    localeText={{ noRowsToShow: 'No hay registros para mostrar', loadingOoo: 'Cargando datos...' }}
                    onGridReady={onGridReady}
                    tooltipShowDelay={0}
                    enableHtmlTooltips={true}
                  />
                </div>
              </div>
              
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