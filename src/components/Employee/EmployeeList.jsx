import { useState, useEffect, useMemo } from 'react';
import { useNotification } from "../../context/NotificationContext";  
import { useEmployees } from '../../context/EmployeeContext'; 
import { useNavigate } from 'react-router-dom';

import EmployeeDetail from './EmployeeDetail';
import EmployeeAdd from './EmployeeAdd';
import EmployeeRow from './EmployeeRow';
import Pagination from '../Pagination';
import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import FilterByFields from '../Filters/FilterByFields';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import '../../Tables.css';

// Componente wrapper que proporciona el contexto
export default function EmployeeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addEmployee, setAddEmployee] = useState(null);
  const [show, setShow] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const itemsPerPage = 10;
  
  // Leer del contexto (fuente única de verdad)
  const { employeeData, setEmployeeData, createEmployee } = useEmployees();

  // Ejecutar búsqueda automáticamente al teclear o al cambiar el filtro de estado
  useEffect(() => {
    if (searchValue.trim() || filterStatus !== 'all') {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue, filterStatus]);

  const EMPLOYEE_SEARCH_FIELDS = [
      'numEmployee', 
      'firstName', 
      'lastName', 
      'ci', 
      'position', 
      'department', 
      'subDepartment'
  ];

  // Filtrar empleados
  const filteredEmployees = useMemo(() => {
      return filterData(
          employeeData,
          searchValue,
          EMPLOYEE_SEARCH_FIELDS,
          filterStatus,
          normalizeText
      );
  }, [employeeData, searchValue, filterStatus]);

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredEmployees : employeeData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);


  // Si hay empleado seleccionado, mostrar detalle
  // if (selectedEmployee) {
  //   const employeeSelected = employeeData.find(e => e.id === selectedEmployee);
  //   return <EmployeeDetail 
  //     employee={employeeSelected} 
  //     onBack={() => setSelectedEmployee(null)} 
  //     onUpdate={(updated) => {
  //       setEmployeeData(prev => prev.map(e => e.id === employeeSelected.id ? { ...e, ...updated } : e));
  //       showNotification('Éxito', 'Empleado actualizado correctamente.');
  //       setSelectedEmployee(null);
  //     }}
  //   />
  // }

return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
      
      {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )}

      <div className="titles-table flex justify-between items-center mb-4">
        <TitleHeader title='Listado de Empleados' />
        <ButtonNavigate url={`/empleados/nuevo`} navigate={navigate} />
      </div>
      {/* Filtro */}
      <FilterByFields
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatus}
        showFilterStatus={true}
        moduleName='Empleado'
        placeholder='Ingrese nombre, apellido, cédula, departamento o sub-departamento'
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
