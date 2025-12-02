import React from 'react';

export default function EmployeeFilter({ searchValue, onSearchChange, filterStatus, onFilterStatus }) {
  return (
    <div className="mb-6 p-4 rounded-lg search-container shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
        {/* Label y Input de búsqueda */}
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 font-bold">
            Buscar Empleado:
          </label>
          <input
            type="text"
            placeholder="Ingrese nombre, apellido, cédula, departamento o sub-departamento"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg filter-input focus:outline-none transition-all"
          />
        </div>

        {/* Filtros por Estado */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onFilterStatus('all')}
            className={`status-btn ${filterStatus === 'all' ? 'status-btn--all' : 'status-btn--neutral'}`}
            aria-pressed={filterStatus === 'all'}
          >
            Todos
          </button>
          <button
            onClick={() => onFilterStatus('activo')}
            className={`status-btn ${filterStatus === 'activo' ? 'status-btn--active' : 'status-btn--neutral'}`}
            aria-pressed={filterStatus === 'activo'}
          >
            Activos
          </button>
          <button
            onClick={() => onFilterStatus('inactivo')}
            className={`status-btn ${filterStatus === 'inactivo' ? 'status-btn--inactive' : 'status-btn--neutral'}`}
            aria-pressed={filterStatus === 'inactivo'}
          >
            Inactivos
          </button>
        </div>
      </div>
    </div>
  );
}
