import { useEffect, useState } from 'react';
import { radioOptions } from '../../utils/StaticData/schedule-utils';
import LabelFieldForm from '../Shared/LabelFieldForm';
import { allMonths } from '../../utils/StaticData/months-utils';

function ScheduleFilterList({ 
  viewMode, 
  departments = [], 
  months = [], 
  onAccept, // Esta será la función (loadSchedules) que se ejecutará automáticamente
  loading, 
  disabledClasses 
}) {

  // Fallback a todos los meses si no se pasan como prop
  if (months?.length === 0) {
    months = allMonths;
  }

  // 1. Estado local para controlar los tres filtros
  const [filters, setFilters] = useState({
    department: '',
    month: '',
    fortnight: radioOptions[0].optionOne.value // Inicializa con la primera opción por defecto si deseas
  });

  // 2. Manejador de cambios genérico para actualizar el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. useEffect mágico: escucha cuando 'filters' cambie y ejecuta automáticamente la búsqueda
  useEffect(() => {
    if (onAccept) {
      // Envía los valores frescos directamente a tu función contenedora (loadSchedules)
      onAccept(filters); 
    }
  }, [filters, onAccept]); // Se dispara cada vez que cambias un select o radio

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
            onChange={handleChange}     // Dispara el cambio
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
            name='month' // 🛠️ Corregido: antes decía department
            value={filters.month} // Controlado por el estado
            onChange={handleChange} // Dispara el cambio
            className={`w-full text-xl px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          >
            <option className="bg-[#3c4042]" value=""> 
              {loading ? "Cargando..." : "Seleccionar..."} 
            </option>
            {months.map((item) => ( 
              <option key={item.id} value={item.value} className='bg-[#3c4042]'> 
                {item.label} 
              </option>
            ))}
          </select>
        </div>

        {/* Quincena */}
        <div>
          {/* <LabelFieldForm field="Quincena" simbol="*" dinamicClasses="mb-3"/> */}
          <div className='h-[42px] mt-1 flex items-center'> 
            {/* <div className='flex gap-4 w-full justify-center bg-field rounded-xl p-1'>      
              <label className="flex items-center gap-2 cursor-pointer p-1 text-lg">
                <input
                  type="radio"
                  name="fortnight"
                  value={radioOptions[0].optionOne.value}
                  checked={filters.fortnight === radioOptions[0].optionOne.value} // Controlado
                  onChange={handleChange} // Dispara el cambio
                  disabled={viewMode || loading}
                  className="h-5 w-5 cursor-pointer shrink-0 text-blue-600 focus:ring-blue-500" // 🚀 Tamaño aumentado a h-5 w-5
                />
                {radioOptions[0].optionOne.label}
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1 text-lg">
                <input
                  type="radio"
                  name="fortnight"
                  value={radioOptions[1].optionTwo.value}
                  checked={filters.fortnight === radioOptions[1].optionTwo.value} // Controlado
                  onChange={handleChange} // Dispara el cambio
                  disabled={viewMode || loading}
                  className="h-5 w-5 cursor-pointer shrink-0 text-blue-600 focus:ring-blue-500" // 🚀 Tamaño aumentado a h-5 w-5
                />
                {radioOptions[1].optionTwo.label}
              </label>

            </div> */}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ScheduleFilterList;