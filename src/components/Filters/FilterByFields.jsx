import React from 'react';

export default function FilterByFields({ 
  searchValue, 
  searchDateValue, 
  onSearchChange, 
  filterStatus, 
  onFilterStatus, 
  onFilterDate, 
  showFilterStatus = false, 
  showFilterDate = false, 
  moduleName = '', 
  placeholder = '',
  active = 'activo',
  inactive = 'inactivo'}) {

  return (
    <div className="mb-6 p-4 rounded-lg search-container shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
        {/* Label y Input de búsqueda */}
        <div className="flex-1">
          <label className="block text-sm mb-2 font-bold">
            Buscar {moduleName}:
          </label>
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg filter-input focus:outline-none transition-all placeholder:text-gray-500 placeholder:italic"
          />
        </div>

        {/* Filtros por Estado */}
        {showFilterStatus && (
        <div className="flex-1">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onFilterStatus('all')}
              className={`skip-style-btn status-btn ${filterStatus === 'all' ? 'status-btn--all' : 'status-btn--neutral'}`}
              aria-pressed={filterStatus === 'all'}
            >
              Todos
            </button>
            <button
              onClick={() => onFilterStatus(active)}
              className={`skip-style-btn status-btn ${filterStatus === active ? 'status-btn--active' : 'status-btn--neutral'}`}
              aria-pressed={filterStatus === active}
            >
              <span className="capitalize"> {active}s </span>
            </button>
            <button
              onClick={() => onFilterStatus(inactive)}
              className={`skip-style-btn status-btn ${filterStatus === inactive ? 'status-btn--inactive' : 'status-btn--neutral'}`}
              aria-pressed={filterStatus === inactive}
            >
              <span className="capitalize"> {inactive}s </span>
            </button>
          </div>
        </div>

        )}

        {showFilterDate && (
          <div className="flex-1 gap-2 flex-wrap">
            <input 
              onChange={(e) => onFilterDate(e.target.value) } value={searchDateValue}
              type='date' className="px-3 py-2 rounded-lg filter-input"  />
          </div>
        )}
      </div>
    </div>
  );
}
