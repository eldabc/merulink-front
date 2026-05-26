import React, { useMemo, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import SpanText from '../Shared/SpanText';

import ShiftLegend from '../Shift/ShiftLegend';
import ScheduleLegend from './ScheduleLegend';

// Registrar los módulos de AG Grid
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ScheduleGrid({ groupedEmployees, fortnightDays, shifts, loading }) {

  const [brushShift, setBrushShift] = useState(null);

  const handleCellClicked = (params) => {
    if (!brushShift) return;
    if (params.data.vacation) return;

    const fieldName = params.column.getColId();

    // Guardar el valor en el objeto de datos de la fila de AG Grid
    params.data[fieldName] = brushShift.code;

    // Avisa a AG Grid que el valor cambió para que ejecute 'cellStyle' y cambie el color
    params.node.setDataValue(fieldName, brushShift.code);
    
    // Forzar refresh de esta celda en particular para asegurar el render inmediato
    params.api.refreshCells({ rowNodes: [params.node], columns: [fieldName] });
    console.log(`Empleado N: ${params.data.id}, Nombre: ${params.data.fullName} Fecha: ${fieldName}, Nuevo Turno: ${brushShift.id}`);
  };


  const localeText = useMemo(() => ({
    noRowsToShow: 'No hay registros para mostrar',
    loadingOoo: 'Cargando datos...',
  }), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setBrushShift(null); // Apaga la brocha
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const myTheme = useMemo(() => {
    return themeQuartz.withParams({
      baseTheme: 'dark',
      accentColor: '#00A4BC', // Color para los elementos activos
      backgroundColor: '#535557', // Fondo de la grilla
      textColor: '#E0E0E0',
    });
  }, [shifts]); 
  
  // Aplanar los datos que vienen agrupados por subdepartamento de Laravel
  const rowData = useMemo(() => {
    if (!groupedEmployees) return [];
    
    const flatRows = [];
    // Itera sobre cada subdepartamento (ej: 'Contabilidad')
    Object.keys(groupedEmployees).forEach((subDeptName) => {
      groupedEmployees[subDeptName].forEach((employee) => {
        flatRows.push({
          ...employee,
          subDepartmentName: subDeptName, // Guardamos el nombre para poder agrupar o mostrar
          fullName: `${employee.firstName} ${employee.lastName || ''}`.trim()
        });
      });
    });
    
    return flatRows;
  }, [groupedEmployees]);

  // Construcción Dinámica de Columnas (Definición de Columnas)
  const columnDefs = useMemo(() => {
    // Columnas fijas iniciales para los datos del empleado
    const baseCols = [
      { 
        headerName: 'Empleado', 
        field: 'fullName', 
        pinned: 'left', // Mantiene el nombre congelado a la izquierda al hacer scroll horizontal
        width: 200,
        // Estilar la celda si el empleado está de vacaciones
        cellClassRules: {
          'pointer-events-none cursor-not-allowed opacity-50 select-none font-semibold text-gray-600 bg-gray-50': (params) => !!params.data.vacation,
          'pointer-events-none': (params) => !params.data.vacation,
        },
        cellRenderer: (params) => {
          if (params.data.vacation) {
            return `🌴 ${params.value} (Vacaciones)`;
          }
          return params.value;
        }
      }
    ];

    // Columnas dinámicas por cada día de la quincena
    const dayCols = fortnightDays.map((day) => {
      return {        
        headerName: `${day.dayName} ${day.dayNumber}`, 
        field: `date_${day.date}`, 
        
        headerValueGetter: (params) => {
          const columnWidth = params.column.getActualWidth();
          if (columnWidth < 65) return `${day.dayNumber}`;
          return `${day.dayName} ${day.dayNumber}`;
        },

        // COLOR DINÁMICAMENTE SEGÚN EL VALOR DE LA CELDA
        cellStyle: (params) => {

          if (!params.value) return null;

          // Si es fin de semana y tiene turno 'L' (Libre), priorizamos el estilo limpio de fin de semana
          if (day.isWeekend && params.value === 'L') {
            return { fontWeight: 'bold', textAlign: 'center' };
          }

          // Busca el turno actual
          const currentShift = shifts?.find(s => s.letterShift === params.value);

          if (currentShift?.color) {
            return {
              backgroundColor: currentShift.color,
              color: '#FFFFFF',
              fontWeight: 'bold',
              textAlign: 'center'
            };
          }

          // Retornamos null en background para asegurar que el Hover nativo de AG Grid funcione
          return { 
            fontWeight: 'bold', 
            textAlign: 'center' 
          };
        },

        valueGetter: (params) => {
          // Busca si este nodo ya tiene un valor asignado para esta fecha
          // AG Grid guarda los estados internos aquí si usas setDataValue
          if (params.data[`date_${day.date}`]) {
            return params.data[`date_${day.date}`];
          }
          
          if (params.data.vacation) return 'VAC';
          return 'L'; 
        },

        flex: 1,           
        minWidth: 35,      
        resizable: true,
        sortable: false,
        suppressMovable: true,
        cellClass: `${day.colorClass}`,
        headerClass: `${day.bgHeaderClass} ${day.borderClass}`,
        editable: (params) => !params.data.vacation,
        cellClassRules: {
          'cursor-not-allowed opacity-50 select-none font-semibold text-gray-600 bg-gray-50 pointer-events-none': (params) => !!params.data.vacation,
        }
      };
    }, [fortnightDays, shifts]);

    return [...baseCols, ...dayCols];
  }, [fortnightDays, shifts]);

  // Configuraciones por defecto para todas las columnas
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: false,
    resizable: true,
    sortingOrder: ['asc', 'desc'],
  }), []);

  const isDataPending = loading || shifts === undefined;
  const hasShiftGrid = !isDataPending && shifts?.length > 1;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border rounded-md text-sm">
        {isDataPending ? (
          <SpanText text="Cargando..." />
        ) : (
          hasShiftGrid ? ( 
            <>
            <ShiftLegend 
              shifts={shifts} 
              activeBrush={brushShift} // Para saber cuál está seleccionado
              onSelectBrush={setBrushShift} // Para activar/desactivar
            /> 

            {/* Contenedor AG Grid */}
            <div className={`ag-theme-alpine w-full h-[500px] shadow-sm rounded-lg overflow-hidden ${brushShift ? 'cursor-brocha' : ''}`}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                theme={myTheme}
                // Evita que las filas de vacaciones tengan interacciones
                suppressRowClickSelection={true} 
        
                rowSelection={{
                  mode: 'multiRow',
                  checkboxes: false, // Fuerte en false para que no dibuje nada
                  headerCheckbox: false, // Desactiva explícitamente el del header en el config del nodo
                }}
                onCellClicked={handleCellClicked}
                localeText={localeText}
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
}