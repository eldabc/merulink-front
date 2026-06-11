import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { radioOptions } from '../../utils/StaticData/schedule-utils';
import LabelFieldForm from '../Shared/LabelFieldForm';
import { allMonths } from '../../utils/StaticData/months-utils';

function ScheduleFilterList({ 
  viewMode, 
  departments = [], 
  months = [], 
  onLoadSchedules,
  loading, 
  disabledClasses,
  filters,
  setFilters,
  availableMonths
}) {

    // Mes actual
    // const now = dayjs();
    // const currentYear = now.year();
    // const todayFormatted = now.format('YYYY-MM-DD');
  
    // // Añadir año correspondiente a los meses
    // const mapToMonthWithYear = (d) => {
    //   const idx = d.month(); // 0-11
    //   return { ...allMonths[idx], currentYear: d.year() };
    // };
  
    // // Mes actual + anterior
    // const availableMonths = [
    //   mapToMonthWithYear(now),
    //   mapToMonthWithYear(now.subtract(1, 'month'))
    // ];

  // Manejador de cambios para actualizar el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Escucha cuando 'filters' cambia y ejecuta automáticamente la búsqueda
  useEffect(() => {
    if (!onLoadSchedules) return;

    // const monthSelectedJson = availableMonths.find(mes => Number(mes.value) === Number(filters?.month));
    onLoadSchedules({ 
      ...filters, 
      // monthSelectedJson
    });
  }, [filters, onLoadSchedules]);

  return (
    <div className="rounded-lg w-full p-2 div-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

        {/* Departamento */}
        <div>
          <LabelFieldForm field="Departamento" simbol="*" dinamicClasses="mb-3"/>
          <select 
            disabled={viewMode || loading} 
            name='department'
            value={filters.department} // Controlado por el estado
            onChange={handleChange}
            className={`w-full text-xl px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          >
            <option className="bg-[#3c4042]" value=""> 
              {loading ? "Cargando..." : "Seleccionar..."} 
            </option>
            {departments.map((item) => ( 
              <option key={item.id} value={item.id} className='bg-[#3c4042]'> 
                {item.departmentName} 
              </option>
            ))}
          </select>
        </div>

        {/* Mes */}
        <div>
          <LabelFieldForm field="Mes" simbol="*" dinamicClasses="mb-3"/>
          <select 
            disabled={viewMode || loading} 
            name='month'
            value={filters.month}
            onChange={handleChange}
            className={`w-full text-xl px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          >
            <option className="bg-[#3c4042]" value=""> 
              {loading ? "Cargando..." : "Seleccionar..."} 
            </option>
            {availableMonths.map((item) => ( 
              <option key={`${item.value}-${item.currentYear}`} value={item.value} className='bg-[#3c4042]'> 
                {item.label} 
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ScheduleFilterList;