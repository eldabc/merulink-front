import React, { useState, useEffect } from 'react';
import EmployeeFilter from './EmployeeFilter';
import EmployeeDetail from './EmployeeDetail';
import '../../Tables.css';
import { employees } from '../../utils/employee-utils';

export default function EmployeeTable() {

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const itemsPerPage = 10;

  // Ejecutar búsqueda automáticamente al teclear o al cambiar el filtro de estado
  useEffect(() => {
    if (searchValue.trim() || filterStatus !== 'all') {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue, filterStatus]);

  // Filtrar empleados según búsqueda y estado
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = searchValue.trim() === '' || 
      emp.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.cedula.includes(searchValue) ||
      emp.cargo.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.departamento.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'activo' && emp.estatus === 'Activo') ||
      (filterStatus === 'inactivo' && emp.estatus === 'Inactivo');

    return matchesSearch && matchesStatus;
  });

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredEmployees : employees;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (estatus) => {
    return estatus === 'Activo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Si hay empleado seleccionado, mostrar detalle
  if (selectedEmployee) {
    return <EmployeeDetail employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
  }

  return (
    <div className="table-container p-6 bg-white-50 rounded-lg">
      <div className="titles-table flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Listado de Empleados</h2>
        <div className="text-sm">         
          {hasSearched  
            ? `Resultados: ${dataToDisplay.length} empleado(s)` 
            : `Total: ${employees.length} empleados`
          }
        </div>
      </div>
      {/* Filtro de búsqueda */}
      <EmployeeFilter 
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatus}
      />

      <div className="hidden lg:block overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="tr-thead-table">
              <th className="px-4 py-3 text-left font-semibold">No. Empleado</th>
              <th className="px-4 py-3 text-left font-semibold">Cédula</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Apellido</th>
              <th className="px-4 py-3 text-left font-semibold">Departamento</th>
              <th className="px-4 py-3 text-left font-semibold">Sub-Departamento</th>
              <th className="px-4 py-3 text-left font-semibold">Cargo</th>
              <th className="px-4 py-3 text-left font-semibold">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((emp) => (
              <tr
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              >
                <td className="px-4 py-3 text-white-800 font-medium">{emp.noEmpleado}</td>
                <td className="px-4 py-3 text-white-700">{emp.cedula}</td>
                <td className="px-4 py-3 text-white-700">{emp.nombre}</td>
                <td className="px-4 py-3 text-white-700">{emp.apellido}</td>
                <td className="px-4 py-3 text-white-700">{emp.departamento}</td>
                <td className="px-4 py-3 text-white-700">{emp.subDepartamento}</td>
                <td className="px-4 py-3 text-white-700">{emp.cargo}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(emp.estatus)}`}>
                    {emp.estatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-white-600">
          Mostrando {paginatedEmployees.length > 0 ? startIndex + 1 : 0} a {Math.min(startIndex + itemsPerPage, dataToDisplay.length)} de {dataToDisplay.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}