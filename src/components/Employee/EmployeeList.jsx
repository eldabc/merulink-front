import React, { useState, useEffect } from 'react';
import EmployeeFilter from './EmployeeFilter';
import EmployeeDetail from './EmployeeDetail';
import EmployeeAdd from './EmployeeAdd';
// import Notification from '../Notification'; 
import { employees } from '../../utils/ExampleData/employee-utils';
import { useNotification } from "../../context/NotificationContext";  
import { EmployeeProvider, useEmployees } from '../../context/EmployeeContext'; 
import EmployeeRow from './EmployeeRow';
import '../../Tables.css';
import Pagination from '../Pagination';


// Componente wrapper que proporciona el contexto
export default function EmployeeList() {
  const { showNotification } = useNotification();
  return (
    <EmployeeProvider initialData={employees} showNotification={showNotification}>
      <EmployeeListContent />
    </EmployeeProvider>
  );
}

// Componente interno que usa el contexto
function EmployeeListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addEmployee, setAddEmployee] = useState(null);
  const itemsPerPage = 10;
  const [show, setShow] = useState(false);
  const { showNotification } = useNotification();
  
  // Leer del contexto (fuente única de verdad)
  const { employeeData, setEmployeeData } = useEmployees();

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
    normalizeText(emp.firstName).includes(value) ||
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
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);


  // Si hay empleado seleccionado, mostrar detalle
  if (selectedEmployee) {
    const employeeSelected = employeeData.find(e => e.id === selectedEmployee);
    return <EmployeeDetail 
      employee={employeeSelected} 
      onBack={() => setSelectedEmployee(null)} 
      onUpdate={(updated) => {
        setEmployeeData(prev => prev.map(e => e.id === employeeSelected.id ? { ...e, ...updated } : e));
        showNotification('Éxito', 'Empleado actualizado correctamente.');
        setSelectedEmployee(null);
      }}
    />
  }
  if (addEmployee) {
    return (
      <EmployeeAdd
        employee={addEmployee}
        onBack={() => setAddEmployee(null)}
        onCreated={(newEmp) => {
          // assign an id and prepend to list
          setEmployeeData(prev => [{ ...newEmp, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 }, ...prev]);
          setAddEmployee(null);
          showNotification('Éxito', 'Empleado creado correctamente.');
        }}
      />
    );
  }

return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
      
      {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )}

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

      <div className="rounded-lg shadow">
        <table className="min-w-full border-collapse text-sm sm:text-base">
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
            {paginatedData.map((emp) => (
              <EmployeeRow 
                key={emp.id}
                emp={emp} 
                setSelectedEmployee={setSelectedEmployee}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
				paginatedData={paginatedData}
				startIndex={startIndex}
				itemsPerPage={itemsPerPage}
				dataToDisplay={dataToDisplay}
				hasSearched={hasSearched}
				data={employeeData}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				totalPages={totalPages}
				moduleName={'Empleado'}
			/>
    </div>
);
}
