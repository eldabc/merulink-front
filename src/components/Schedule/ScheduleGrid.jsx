import dayjs from 'dayjs';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import React, { forwardRef, useMemo, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { useFormContext } from "react-hook-form";
import { useScheduleValidation } from '../../hooks/useScheduleValidation';

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
import PreviousFortnightViewer from './PreviousFortnightViewer';
import { EyeIcon, EyeSlashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
ModuleRegistry.registerModules([AllCommunityModule]);

const CustomTooltip = (params) => {
  if (!params.value) return null;
  return (
    <div 
      className="custom-grid-tooltip-container"
      dangerouslySetInnerHTML={{ __html: params.value }}
    />
  );
};

const ScheduleGrid = forwardRef(({ planningData, preFortnightParams, scheduleSaved, groupedEmployees, fortnightDays, shifts, loading, onSave, mode }, ref) => { // isClosed, 
  
  const { register, formState: { errors } } = useFormContext();
  const [brushShift, setBrushShift] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]); 
  const [showPastFortnight, setShowPastFortnight] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { runLiveValidation } = useScheduleValidation();
  
  const viewMode = mode === 'view';
  const disabledClasses = getDisabledClasses(viewMode);

  const daysMap = useMemo(() => {
    return fortnightDays.reduce((acc, curr) => {
      acc[curr.date] = curr;
      return acc;
    }, {});
  }, [fortnightDays]);

  useEffect(() => {
    setBrushShift(null);
    setLiveAlerts(null);
    setShowPastFortnight(false);
  }, [fortnightDays]);
  
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const exportToPDF = async () => {
    const element = document.getElementById('merulink-grid-container');
    if (!element) return;

    setIsExporting(true);

    // Ocultar botones de control para la foto
    // const actionButtons = element.querySelector('.pdf-actions-container');
    // if (actionButtons) actionButtons.style.display = 'none';

    const departmentName = `DEPARTAMENTO DE ${planningData?.departmentName.toUpperCase()}`;
    const fortnightNumber = planningData?.fortnightNumber || "1";
    const mesAño = dayjs(fortnightDays[0]?.date).format('MMMM YYYY').toUpperCase(); 

    // ENCABEZADO PDF
    const headerDiv = document.createElement('div');
    headerDiv.id = 'pdf-dynamic-header';
    headerDiv.className = 'w-full flex flex-col gap-1 pb-4 mb-4 border-b border-gray-600 text-white';
    headerDiv.innerHTML = `
      <div class="flex justify-between items-end mt-8">
        <div>
          <h1 class="text-xl font-black tracking-tight text-gray-400 pl-8">MERULINK — CONTROL DE HORARIOS</h1>
          <p class="text-sm font-bold text-gray-300 pl-8">${departmentName}</p>
        </div>
        <div class="text-right mr-5">
          <span class="text-xs bg-cyan-950 text--gray-400 font-bold px-2.5 py-1 rounded-md border border-gray-800">
            QUINCENA Nº ${fortnightNumber}
          </span>
          <p class="text-xs font-semibold text-gray-400 mt-1.5 uppercase">${dayjs().month(planningData?.month - 1).format('MMMM')} ${planningData?.year}</p>
        </div>
      </div>
    `;

    // Insertamos el título al principio de la grilla temporalmente
    element.insertBefore(headerDiv, element.firstChild);

    try {
      // Breve pausa para asegurar el renderizado del título
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Genera el Canvas de alta definición
      const canvas = await htmlToImage.toCanvas(element, {
        quality: 1,
        pixelRatio: 2, 
        backgroundColor: '#535557', 
      });

      // LIMPIEZA INMEDIATA: Restaura la interfaz original en pantalla
      // if (actionButtons) actionButtons.style.display = 'flex';
      const addedHeader = element.querySelector('#pdf-dynamic-header');
      if (addedHeader) element.removeChild(addedHeader);

      // CÁLCULO DINÁMICO
      // En lugar de usar mm fijos, adapta el PDF exacto a la relación de aspecto de la captura
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = 297; // Ancho base de referencia (A4 Horizontal en mm)
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Alto proporcional exacto

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight] // Crea la hoja a la medida de la tabla
      });

      // Coloca la imagen ocupando el 100% del espacio disponible
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Guardado final
      const fileName = `Horario_${departmentName.replace(/\s+/g, '_')}_Q${fortnightNumber}_${dayjs().format('MM_YYYY')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("Error generando el reporte PDF:", error);

      // if (actionButtons) actionButtons.style.display = 'flex';
      const addedHeader = element.querySelector('#pdf-dynamic-header');
      if (addedHeader) element.removeChild(addedHeader);
    } finally {
      setIsExporting(false);
    }
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
      setLiveAlerts(runLiveValidation(currentRows));
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
      const alerts = runLiveValidation(rowData);
      setLiveAlerts(alerts);
    }
  }, [rowData, runLiveValidation]);

  const columnDefs = useMemo(() => {
    const baseCols = [
      { 
        headerName: 'Empleado', 
        field: 'fullName', 
        pinned: 'left', 
        width: window.innerWidth < 640 ? 110 : 180,
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
        
        headerComponent: () => (
          <div className="flex flex-col items-center justify-center py-1 w-full h-full text-center">
            <span className="text-[13px] uppercase font-bold tracking-tighter opacity-80 block">
              {day.dayName.substring(0, 3)} {/* Corta a 3 letras */}
            </span>

            <span className="text-xs font-bold block mt-0.5">
              {day.dayNumber}
            </span>
          </div>
        ),

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
        minWidth: 45,      
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
    <div className="w-full flex flex-col gap-4 p-2 bg-[#535557] rounded-lg">

      <div className=" w-full flex items-center justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={exportToPDF}
          disabled={isExporting}
          title="Descargar copia impresa (PDF)"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-semibold text-sm rounded-md transition-all shadow-md"
        >
          <ArrowDownTrayIcon className={`w-5 h-5 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Generando...' : 'PDF'}
        </button>

        <button 
          type="button"
          onClick={() => setShowPastFortnight(!showPastFortnight)}
          title={showPastFortnight ? 'Ocultar Visor' : 'Ver Quincena Pasada'}
          className="flex gap-2 px-4 py-2 bg-[#525456] hover:bg-[#52545691] hover:border rounded-md"
        >
          {showPastFortnight ? ( 
            <EyeSlashIcon className='w-5 h-5 text-gray-300' />
          ) : <EyeIcon className='w-5 h-5 text-gray-300' /> }
        </button>
      </div>

      <div id="merulink-grid-container" className="w-full flex flex-col gap-4">
        {isDataPending ? (
          <SpanText text="Cargando..." />
        ) : (
          hasShiftGrid ? ( 
            <>
              <div className="div-border w-full grid grid-cols-1 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-4 p-3 rounded-lg transition-all duration-300">
                <div className="min-w-0">
                  <ShiftLegend shifts={shifts} activeBrush={brushShift} onSelectBrush={setBrushShift} viewMode={viewMode} />
                </div>
                <div className="min-w-0">
                  
                  <div className='min-h-18'>
                    {liveAlerts?.length > 0 && (<LiveAlerts alerts={liveAlerts} /> )}
                  </div>
                </div>
              </div>

              <div className="relative w-full h-auto shadow-sm rounded-lg overflow-hidden">
                {planningData?.isClosed && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden select-none bg-[#2f3d4473]">
                    <div className="dark:text-gray-400/40 text-5xl md:text-8xl font-black uppercase tracking-widest transform -rotate-20 whitespace-nowrap">
                      Quincena cerrada
                    </div>
                  </div>
                )}

                <div className={`ag-theme-quartz w-full h-auto shadow-sm rounded-lg overflow-hidden ${brushShift ? 'cursor-brocha' : ''}`}>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    readOnlyEdit={viewMode} 
                    suppressCellFocus={viewMode}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    theme={myTheme}
                    onCellClicked={handleCellClicked}
                    localeText={{ noRowsToShow: 'No hay registros para mostrar', loadingOoo: 'Cargando datos...' }}
                    onGridReady={onGridReady}
                    tooltipShowDelay={0}
                    domLayout="autoHeight"
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

      <PreviousFortnightViewer 
        isOpen={showPastFortnight} 
        onClose={() => setShowPastFortnight(false)} 
        preFortnightParams={preFortnightParams}
      />

    </div>
  );
});

export default ScheduleGrid;