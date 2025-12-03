import React, { useState, useEffect } from 'react';
import EmployeeFilter from './EmployeeFilter';
import EmployeeDetail from './EmployeeDetail';
import EmployeeAdd from './EmployeeAdd';
import Notification from '../Notification'; 
import { getStatusColor, getStatusName } from '../../utils/statusColor';
import { employees } from '../../utils/employee-utils';
import '../../Tables.css';
export default function EmployeeList() {

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addEmployee, setAddEmployee] = useState(null);
  const itemsPerPage = 10;
  const [employeeData, setEmployeeData] = useState(employees);
  const [show, setShow] = useState(false);

  const showNotification = (title, message) => {
    setShow({ title, message });
    setTimeout(() => setShow(null), 2500);
  };

  const toggleEmployeeField = (id, field) => {
    setEmployeeData(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, [field]: !emp[field] } : emp
      )
    );
    showNotification( "Éxito", `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado.`);
  };

  // Ejecutar búsqueda automáticamente al teclear o al cambiar el filtro de estado
  useEffect(() => {
    if (searchValue.trim() || filterStatus !== 'all') {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue, filterStatus]);

  // Normalizar strings para la busqueda
  function normalizeText(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

// Filtrar empleados según búsqueda y estado
const filteredEmployees = employeeData.filter(emp => {
  const value = normalizeText(searchValue);

  const matchesSearch = value === '' ||
    normalizeText(emp.name).includes(value) ||
    normalizeText(emp.lastName).includes(value) ||
    normalizeText(emp.ci).includes(value) ||
    normalizeText(emp.position).includes(value) ||
    normalizeText(emp.department).includes(value) ||
    normalizeText(emp.subDepartment).includes(value);

  const matchesStatus = filterStatus === 'all' ||
    (filterStatus === 'activo' && emp.status === true) ||
    (filterStatus === 'inactivo' && emp.status === false);

  return matchesSearch && matchesStatus;
});

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredEmployees : employeeData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);


  // Si hay empleado seleccionado, mostrar detalle
  if (selectedEmployee) {
    const employeeSelected = employeeData.find(e => e.id === selectedEmployee);
    return <EmployeeDetail 
      employee={employeeSelected} 
      onBack={() => setSelectedEmployee(null)} 
      onToggleField={toggleEmployeeField}
    />
  }
  if (addEmployee) {
    return <EmployeeAdd employee={addEmployee} onBack={() => setAddEmployee(null)} />;
  }

return (
  <div className="table-container p-4 bg-white-50 rounded-lg">
    
    {show && (
      <Notification title={show.title} message={show.message} onClose={() => setShow(null)} />
    )}

    <div className="titles-table flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Listado de Empleados</h2>
      <div className="text-sm">
        <button
          onClick={() => setAddEmployee({})}
          className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
        >
          ← Nuevo Registro
        </button>
      </div>
    </div>
    {/* Filtro */}
    <EmployeeFilter
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      filterStatus={filterStatus}
      onFilterStatus={setFilterStatus}
    />

    <div className="-mx-6 px-6 overflow-x-auto rounded-lg shadow">
      <table className="min-w-max border-collapse text-sm sm:text-base">
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
              onClick={() => setSelectedEmployee(emp.id)}
              className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
            >
              <td className="px-4 py-3 text-white-800 font-medium">{emp.numEmployee}</td>
              <td className="px-4 py-3 text-white-700">{emp.ci}</td>
              <td className="px-4 py-3 text-white-700">{emp.name}</td>
              <td className="px-4 py-3 text-white-700">{emp.lastName}</td>
              <td className="px-4 py-3 text-white-700">{emp.department}</td>
              <td className="px-4 py-3 text-white-700">{emp.subDepartment}</td>
              <td className="px-4 py-3 text-white-700">{emp.position}</td>
              <td className="px-4 py-3">
                <span className={getStatusColor(emp.status)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEmployeeField(emp.id, "status");
                  }}
                >{getStatusName(emp.status)}</span>
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
        <b>
          {hasSearched
            ? ` Resultados: ${dataToDisplay.length} empleado(s)`
            : ` Total: ${employees.length} empleados`
          }
        </b>
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
                  : 'bg-gray-200 text-sky-200 hover:bg-gray-300'
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