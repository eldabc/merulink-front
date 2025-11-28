import React from 'react';

export default function EmployeeFilter({ searchValue, onSearchChange, onSearch, filterStatus, onFilterStatus }) {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
        {/* Label y Input de búsqueda */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Búsqueda por:
          </label>
          <input
            type="text"
            placeholder="Buscar empleado"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Botón Buscar */}
        <button
          onClick={onSearch}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap"
        >
          Buscar
        </button>

        {/* Filtros de Estado */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onFilterStatus('activo')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'activo'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-sky-200 hover:bg-gray-300'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => onFilterStatus('inactivo')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'inactivo'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-sky-200 hover:bg-gray-300'
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>
    </div>
  );
}
