import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import SpanText from '../Shared/SpanText';

import ShiftLegend from '../Shift/ShiftLegend';


// 1. Registrar los módulos de AG Grid (Requerido en versiones recientes)
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ScheduleGrid({ groupedEmployees, fortnightDays, shifts, loading }) {

  const myTheme = useMemo(() => {
    return themeQuartz.withParams({
      baseTheme: 'dark',
      accentColor: '#00A4BC', // Color para los elementos activos (puedes usar el azul de tu captura)
      backgroundColor: '#535557', // Fondo de la grilla personalizado si quieres
      textColor: '#E0E0E0', // Color del texto para mejor contraste en modo oscuro
    });
  }, []);
  
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
          'cursor-not-allowed opacity-50 select-none font-semibold text-gray-600 bg-gray-50': (params) => !!params.data.vacation
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
      console.log("headr", day.borderClass)
      return {        
        headerName: `${day.dayName} ${day.dayNumber}`, // Nombre corto número ej: "Sáb. 16"
        field: `date_${day.date}`, // Campo virtual único para cada día de la malla
        flex: 1,           // Hace que todas las columnas de los días midan lo mismo y llenen el espacio
        minWidth: 50,
        resizable: true,
        sortable: false,
        suppressMovable: true,

        headerValueGetter: (params) => {
          const columnWidth = params.column.getActualWidth();
          
          // Si la columna mide menos de 65px (pantallas chicas), muestra solo el número
          if (columnWidth < 65) {
            return `${day.dayNumber}`;
          }
          // Si hay espacio, muestra el formato completo (Ej: "Lun 18")
          return `${day.dayName} ${day.dayNumber}`;
        },

        // Celda adaptativa (Muestra 'V' o 'VAC' según el espacio)
        valueGetter: (params) => {
          if (params.data.vacation) {
            const columnWidth = params.column.getActualWidth();
            return columnWidth < 65 ? 'V' : 'VAC'; 
          }
          
          // Aquí mapearás con el array de turnos/horarios asignados que traiga el empleado de la BD
          // Ejemplo: params.data.schedules?.[day.date]?.code || '-'
          return '-'; 
        },
        
        // Estilo dinámico de celdas
        cellClass: `${day.colorClass}`,
        headerClass: `${day.bgHeaderClass} ${day.borderClass}`,
        
        // Bloquear la celda si el empleado está de vacaciones en esta quincena
        editable: (params) => !params.data.vacation,
        
        cellClassRules: {
          'pointer-events-none bg-gray-100 text-gray-400': (params) => !!params.data.vacation,
        },
      };
    });

    return [...baseCols, ...dayCols];
  }, [fortnightDays]);

  // Configuraciones por defecto para todas las columnas
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: false,
    resizable: true,
    sortingOrder: ['asc', 'desc'],
  }), []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border rounded-md text-sm">
        {loading ? (
          <SpanText text="Cargando..." />
        ) : (
          shifts?.length > 0 && ( <ShiftLegend shifts={shifts} /> )
        )}
      </div>

      {/* Contenedor AG Grid */}
      <div className="ag-theme-alpine w-full h-[500px] shadow-sm rounded-lg overflow-hidden">
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
            isRowSelectable: (rowNode) => !rowNode.data.vacation
          }}
                />
      </div>

      <div className="flex flex-col md:flex-row gap-2 p-2 bg-gray-50 border rounded-md text-sm">
        <span className="px-2 py-0.5 bg-blue-500 rounded text-xs font-bold">Fecha</span> <span className='text-gray-500'> Día de Hoy </span>
        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">Fecha</span> <span className='text-gray-500'> Feriados, Sábados, Domingos </span>
        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-bold">VAC </span><span className='text-gray-500'> (Vacaciones)</span>
      </div>
    </div>
  );
}