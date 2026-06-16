import React, { useState, useEffect, useMemo  } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import { Rnd } from 'react-rnd';
import dayjs from 'dayjs';

import { useSchedules } from '../../context/ScheduleContext';
import { useScheduleValidation } from '../../hooks/useScheduleValidation';
import ShiftLegend from '../Shift/ShiftLegend';

import { getFortnightDays } from '../../utils/Schedule/schedule-utils';
import { truncateText } from '../../utils/text-utils';

import LabelFieldForm from '../Shared/LabelFieldForm';
import LiveAlerts from '../Shared/LiveAlerts';

const PreviousFortnightViewer = ({ isOpen, onClose, preFortnightParams  }) => {
  
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [previousData, setPreviousData] = useState({});
  const { loadFormData } = useSchedules();
  const { runLiveValidation } = useScheduleValidation();
  const [previousFortnightDays, setPreviousFortnightDays] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  
  const viewMode = true;
  const startDate = preFortnightParams.start;
  const endDate = preFortnightParams.end;
  
  const CustomTooltip = (params) => {
    if (!params.value) return null;
    return (
      <div 
        className="custom-grid-tooltip-container"
        dangerouslySetInnerHTML={{ __html: params.value }}
      />
    );
  };

  // Mapeo rápido de días quincenales indexados por fecha para agilizar lecturas de festivos
  const daysMap = useMemo(() => {
    return previousFortnightDays.reduce((acc, curr) => {
      acc[curr.date] = curr;
      return acc;
    }, {});
  }, [previousFortnightDays]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const myTheme = useMemo(() => {
    return themeQuartz.withParams({
      baseTheme: 'dark',
      accentColor: '#00A4BC', 
      backgroundColor: '#535557', 
      textColor: '#E0E0E0',
    });
  }, []); 
    
  const rowData = useMemo(() => {
    if (!previousData?.employees) return [];
    
    const flatRows = [];
    Object.keys(previousData?.employees).forEach((subDeptName) => {
      previousData?.employees[subDeptName].forEach((employee) => {
        flatRows.push({
          ...employee,
          fullName: `${employee.firstName} ${employee.lastName || ''}`.trim()
        });
      });
    });
    
    return flatRows;
  }, [previousData]);

  useEffect(() => {
    if (rowData.length > 0) {
      const alerts =runLiveValidation(rowData);
      setLiveAlerts(alerts);
      console.log("alerts", alerts)
    }
  }, [rowData, runLiveValidation]);
  
  const columnDefs = useMemo(() => {
    const baseCols = [
      { 
        headerName: 'Empleado', 
        field: 'fullName', 
        pinned: 'left', 
        width: 140,
        cellClass: 'text-xs font-semibold',
        cellRenderer: (params) => {
          if (params.data.vacation) return `🌴 ${params.value} (Vacaciones)`;
          return params.value;
        }
      }
    ];

    const dayCols = previousFortnightDays.map((day) => {
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
  }, [previousFortnightDays]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: false,
    resizable: true,
    sortingOrder: ['asc', 'desc'],
    tooltipComponent: CustomTooltip,
  }), []);

  // Solo busca la quincena pasada si el visor está abierto
  useEffect(() => {
    const loadPreFortninght = async () => {
      if (!isOpen) return;
      
      const departmentId = preFortnightParams.departmentId;

        if (departmentId && startDate && endDate) {
          // console.log("aqui", departmentId , startDate, endDate)
          setLoadingPrevious(true);
          try {
            const date = dayjs(startDate);
            const year = date.year();
            const month = date.month() + 1;

            // Determinar el número de quincena
            const dayOfMonth = date.date();
            const fortnightNumber = dayOfMonth <= 15 ? 1 : 2;
            
            const days = getFortnightDays(year, Number(month), fortnightNumber);
            const previousSchedule = await loadFormData(departmentId, startDate, endDate);

            setPreviousFortnightDays(days);
            setPreviousData(previousSchedule);
  
          } catch (error) {
            console.error("Error cargando quincena anterior", error);
          } finally {
            setLoadingPrevious(false);
          }
        }
      };
  
    loadPreFortninght();   
    
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Rnd
      default={{
        x: 600,
        y: 0,
        width: 500,
        height: 350,
      }}
      minWidth={400}
      minHeight={300}
      bounds="window" // Evita que el usuario arrastre la ventana fuera de la pantalla
      className="fixed z-50 bg-[#3a3c3e] border border-gray-600 rounded-lg shadow-2xl overflow-hidden text-gray-200"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Barra de Arrastre */}
      <div className="drag-handle bg-[#2f3132] px-4 py-2 flex items-center justify-between cursor-move select-none border-b border-gray-600">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <span>📋 Visor: Quincena Anterior</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-red-400 text-sm font-bold p-1 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Contenido de la Tabla */}
      <div className="flex-1 min-h-0 p-3 overflow-auto text-xs" style={{ minHeight: 0 }}>
        {loadingPrevious ? (
          <div className="text-center py-8 text-gray-400">Cargando Quincena Anterior...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className='w-full text-center'>
              <h2 className='text-lg font-bold mb-2'> {`Quincena ${dayjs(startDate).format('DD/MM/YYYY')} al ${dayjs(endDate).format('DD/MM/YYYY')} `} </h2>
            </div>

            <div className="div-border w-full grid grid-cols-1 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-6 p-4 rounded-lg transition-all duration-300">
              <div className="min-w-0">
                <ShiftLegend shifts={previousData?.shifts} viewMode={true} dynamicClasses='pl-2 py-4' />
              </div>
              <div className="min-w-0">
                {liveAlerts?.length > 0 && (<LiveAlerts alerts={liveAlerts} /> )}
              </div>
            </div>
              <div className={`ag-theme-quartz w-full h-[500px] shadow-sm rounded-lg overflow-hidden`}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  readOnlyEdit={viewMode} 
                  suppressCellFocus={viewMode}
                  defaultColDef={defaultColDef}
                  animateRows={true}
                  theme={myTheme}
                  localeText={{ noRowsToShow: 'No hay registros para mostrar', loadingOoo: 'Cargando datos...' }}
                  onGridReady={onGridReady}
                  tooltipShowDelay={0}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full div-border">
                <div className="flex flex-col w-full md:flex-1"> 
                  <LabelFieldForm field="Observación" dinamicClasses="mb-2" />
                  <textarea
                    readOnly={viewMode}
                    value={previousData?.observations ?? ''}
                    rows="5"                 
                    cols="33"                 
                    placeholder="Escribe aquí una observación..."
                    className={`filter-input p-2 cursor-not-allowed opacity-50 select-none`}
                  />
                </div>  
              </div>
          </div> 
        )}
      </div>   

      {/* ADVERTENCIA INFERIOR */}
      <div className="bg-[#2f3132] px-3 py-1 text-[10px] text-gray-400 border-t border-gray-700 select-none text-center">
        Ventana de Solo lectura • Estira los bordes para redimensionar
      </div>
    </Rnd>
  );
};

export default PreviousFortnightViewer;