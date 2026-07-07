import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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

  // Manejador de cambios para actualizar el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-seleccionar departamento cuando solo hay uno disponible
  useEffect(() => {
    if (departments.length === 1 && !filters.department) {
      setFilters((prev) => ({
        ...prev,
        department: departments[0].id
      }));
    }
  }, [departments, filters.department]);

  // Escucha cuando 'filters' cambia y ejecuta automáticamente la búsqueda
  useEffect(() => {
    if (!onLoadSchedules) return;

    onLoadSchedules({ 
      ...filters,
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
            value={filters.department}
            onChange={handleChange}
            className={`w-full text-xl px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          >
            <option className="bg-[#3c4042]" value=""> {loading ? "Cargando..." : "Seleccionar..."} </option>
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