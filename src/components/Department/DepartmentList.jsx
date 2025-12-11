import React, { useState, useEffect } from 'react';
import { useNotification } from "../../context/NotificationContext";  
import { DepartmentProvider, useDepartments } from "../../context/DepartmentContext";
import { departments } from '../../utils/ExampleData/departments-utils';
import DepartmentRow from './DepartmentRow';
import Pagination from '../Pagination';
import DepartmentForm from './DepartmentForm';
import DepartmentAdd from './DepartmentAdd';

export default function DepartmentList() {
	const { showNotification } = useNotification();
		return (
			<DepartmentProvider initialData={departments} showNotification={showNotification}>
				<DepartmentListContent />
			</DepartmentProvider>
		);
}

// Componente interno que usa el contexto
function DepartmentListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [addDepartment, setAddDepartment] = useState(null);
  const itemsPerPage = 10;
  const [show, setShow] = useState(false);
  const { showNotification } = useNotification();
  
  // Leer del contexto (fuente única de verdad)
  const { departmentData, setDepartmentData } = useDepartments();

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

// Filtrar Despartamentos según búsqueda y estado
const filteredDepartments = departmentData.filter(emp => {
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
  const dataToDisplay = hasSearched ? filteredDepartments : departmentData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);


  // Si hay departamento seleccionado, mostrar detalle
  if (selectedDepartment) {
    const departmentSelected = departmentData.find(d => d.id === selectedDepartment);
    return <DepartmentForm 
			mode="view"
      department={departmentSelected} 
      onBack={() => setSelectedDepartment(null)} 
      onUpdate={(updated) => {
        setDepartmentData(prev => prev.map(e => e.id === departmentSelected.id ? { ...e, ...updated } : e));
        showNotification('Éxito', 'Departamento actualizado correctamente.');
        setSelectedDepartment(null);
      }}
    />
  }
  if (addDepartment) {
    return (
      <DepartmentAdd
        department={addDepartment}
        onBack={() => setAddDepartment(null)}
        onCreated={(newEmp) => {
          // assign an id and prepend to list
          setDepartmentData(prev => [{ ...newEmp, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 }, ...prev]);
          setAddDepartment(null);
          showNotification('Éxito', 'Departamento creado correctamente.');
        }}
      />
    );
  }

return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
      
			{show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )}

      <div className="titles-table flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Listado de Departamentos</h2>
        <div className="text-sm">
          <button
            onClick={() => setAddDepartment({})}
            className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
          >
            ← Nuevo Registro
          </button>
        </div>
      </div>
      {/* Filtro */}
      {/* <DepartmentFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatus}
      /> */}

      <div className="rounded-lg shadow">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="tr-thead-table">
              <th className="px-4 py-3 text-left font-semibold">Código</th>
              <th className="px-4 py-3 text-left font-semibold">Departamento</th>
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDepartments.map((dep) => (
              <DepartmentRow 
                key={dep.id}
                dep={dep} 
                setSelectedDepartment={setSelectedDepartment}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
			<Pagination
				paginatedData={paginatedDepartments}
				startIndex={startIndex}
				itemsPerPage={itemsPerPage}
				dataToDisplay={dataToDisplay}
				hasSearched={hasSearched}
				data={departmentData}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				totalPages={totalPages}
				moduleName={'Departamento'}
			/>
    </div>
);
}