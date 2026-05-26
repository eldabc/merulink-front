import React, { useMemo, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import SpanText from '../Shared/SpanText';

import ShiftLegend from '../Shift/ShiftLegend';


// 1. Registrar los módulos de AG Grid (Requerido en versiones recientes)
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

        // ASIGNAR EL COLOR DINÁMICAMENTE SEGÚN EL VALOR DE LA CELDA
        cellStyle: (params) => {
          // Si está vacío o es el valor por defecto
          if (!params.value || params.value === '-') return null;
          
          // Si está de vacaciones
          if (params.value === 'VAC' || params.value === 'V') {
            // return { backgroundColor: '#a6a7a9', color: '#CBD5E1', fontWeight: 'bold' }; 
          }

          // Busca en el array de 'shifts' globales el turno que coincida con la letra actual
          const currentShift = shifts?.find(s => s.letterShift === params.value);
          
          if (currentShift && currentShift.color) {
            return { 
              backgroundColor: currentShift.color, 
              color: '#FFFFFF', // Texto blanco para que resalte sobre el color
              fontWeight: 'bold',
              textAlign: 'center'
            };
          }
          return null;
        },

        valueGetter: (params) => {
          // Buscamos si este nodo ya tiene un valor asignado para esta fecha
          // AG Grid guarda los estados internos aquí si usas setDataValue
          if (params.data[`date_${day.date}`]) {
            return params.data[`date_${day.date}`];
          }
          
          if (params.data.vacation) return 'VAC';
          return '-'; 
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

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border rounded-md text-sm">
        {loading ? (
          <SpanText text="Cargando..." />
        ) : (
          shifts?.length > 0 && ( 
            <ShiftLegend 
              shifts={shifts} 
              activeBrush={brushShift} // Para saber cuál está seleccionado
              onSelectBrush={setBrushShift} // Para activar/desactivar
            /> )
        )}
      </div>

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
            // isRowSelectable: (rowNode) => !rowNode.data.vacation
          }}
          onCellClicked={handleCellClicked}
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