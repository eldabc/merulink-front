import React, { useState } from 'react';
import EmployeeFilter from './EmployeeFilter';
import EmployeeDetail from './EmployeeDetail';
import '../../Tables.css';
//  '../../Calendar.css';

export default function EmployeeTable() {

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const itemsPerPage = 10;

  // Datos de ejemplo
  const employees = [
    { id: 1, noEmpleado: 'EMP001', cedula: '12345678', nombre: 'Juan', apellido: 'Pérez', departamento: 'TI', subDepartamento: 'Desarrollo', cargo: 'Desarrollador', estatus: 'Activo' },
    { id: 2, noEmpleado: 'EMP002', cedula: '87654321', nombre: 'María', apellido: 'García', departamento: 'RRHH', subDepartamento: 'Nómina', cargo: 'Especialista', estatus: 'Activo' },
    { id: 3, noEmpleado: 'EMP003', cedula: '11223344', nombre: 'Carlos', apellido: 'López', departamento: 'Ventas', subDepartamento: 'Directa', cargo: 'Vendedor', estatus: 'Inactivo' },
    { id: 4, noEmpleado: 'EMP004', cedula: '55667788', nombre: 'Ana', apellido: 'Martínez', departamento: 'TI', subDepartamento: 'Infraestructura', cargo: 'Administrador', estatus: 'Activo' },
    { id: 5, noEmpleado: 'EMP005', cedula: '99887766', nombre: 'Pedro', apellido: 'Rodríguez', departamento: 'Finanzas', subDepartamento: 'Contabilidad', cargo: 'Contador', estatus: 'Activo' },
    { id: 6, noEmpleado: 'EMP006', cedula: '44332211', nombre: 'Laura', apellido: 'Fernández', departamento: 'Marketing', subDepartamento: 'Digital', cargo: 'Community Manager', estatus: 'Activo' },
    { id: 7, noEmpleado: 'EMP007', cedula: '22334455', nombre: 'Diego', apellido: 'Sánchez', departamento: 'TI', subDepartamento: 'Desarrollo', cargo: 'Junior Dev', estatus: 'Activo' },
    { id: 8, noEmpleado: 'EMP008', cedula: '66778899', nombre: 'Sofia', apellido: 'González', departamento: 'RRHH', subDepartamento: 'Selección', cargo: 'Recruiter', estatus: 'Activo' },
    { id: 9, noEmpleado: 'EMP009', cedula: '33445566', nombre: 'Ricardo', apellido: 'Jiménez', departamento: 'Ventas', subDepartamento: 'Indirecta', cargo: 'Gerente', estatus: 'Activo' },
    { id: 10, noEmpleado: 'EMP010', cedula: '77889900', nombre: 'Valentina', apellido: 'Morales', departamento: 'TI', subDepartamento: 'Desarrollo', cargo: 'Frontend Dev', estatus: 'Activo' },
    { id: 11, noEmpleado: 'EMP011', cedula: '11223344', nombre: 'Miguel', apellido: 'Castro', departamento: 'Finanzas', subDepartamento: 'Tesorería', cargo: 'Tesorero', estatus: 'Inactivo' },
    { id: 12, noEmpleado: 'EMP012', cedula: '55667788', nombre: 'Gabriela', apellido: 'Ruiz', departamento: 'Marketing', subDepartamento: 'Eventos', cargo: 'Coordinadora', estatus: 'Activo' },
  ];

  // Función para manejar búsqueda
  const handleSearch = () => {
    if (searchValue.trim() || filterStatus !== 'todos') {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  };

  // Filtrar empleados según búsqueda y estado
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = searchValue.trim() === '' || 
      emp.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.cedula.includes(searchValue) ||
      emp.cargo.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.departamento.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = filterStatus === 'todos' ||
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
        onSearch={handleSearch}
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