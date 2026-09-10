import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import LabelFieldForm from '../Shared/LabelFieldForm';
import ButtonNavigate from '../Shared/ButtonNavigate';
import HasPermission from '../Shared/HasPermission';

function ScheduleFilterList({ 
  viewMode, 
  disabledClasses,
  onFilteredDepartments = [], 
  onLoadSchedules,
  loading,
  filters,
  setFilters,
  availableMonths
}) {

  const { user } = useAuth();
  const navigate = useNavigate();

  // Manejador de cambios para actualizar el estado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-seleccionar departamento para mostrar horarios segun el rol o departamento del usuario
  useEffect(() => {
    if (onFilteredDepartments.length === 1 && !filters.department) { //|| user?.roles?.includes('admin')) 
      setFilters((prev) => ({
        ...prev,
        department: onFilteredDepartments[0]?.id
      }));
    }
  }, [onFilteredDepartments, filters.department]);

  // Escucha cuando 'filters' cambia y ejecuta automáticamente la búsqueda
  useEffect(() => {
    if (!onLoadSchedules) return;

    onLoadSchedules({ 
      ...filters,
    });
  }, [filters, onLoadSchedules]);

  return (
    <div className="rounded-lg w-full p-2 div-border">
      <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">

        {/* Departamento */}
        <div className="flex-1">
          <LabelFieldForm field="Departamento" simbol="*" dinamicClasses="mb-3"/>
          <select 
            disabled={viewMode || loading} 
            name='department'
            value={filters.department}
            onChange={handleChange}
            className={`w-full text-xl px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          >
            <option className="bg-[#3c4042]" value=""> {loading ? "Cargando..." : "Seleccionar..."} </option>
            {onFilteredDepartments.map((item) => ( 
              <option key={item.id} value={item.id} className='bg-[#3c4042]'> 
                {item.departmentName} 
              </option>
            ))}
          </select>
        </div>

        {/* Mes */}
        <div className="flex-1">
          <LabelFieldForm field="Mes" dinamicClasses="mb-3"/>
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

        <div className="flex-1">
          <HasPermission permissions={["create-schedules"]}>
            <ButtonNavigate url={`/empleados/horarios/nuevo`} navigate={navigate} marginClass="mb-1" />
          </HasPermission>
        </div>
      </div>
    </div>
  );
}

export default ScheduleFilterList;