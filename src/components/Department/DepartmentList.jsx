import React, { useState, useEffect } from 'react';
import { useNotification } from "../../context/NotificationContext";  
import { DepartmentProvider, useDepartments } from "../../context/DepartmentContext";
import { departments } from '../../utils/ExampleData/departments-utils';
import DepartmentRow from './DepartmentRow';

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

// Filtrar empleados según búsqueda y estado
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


  // Si hay empleado seleccionado, mostrar detalle
  if (selectedDepartment) {
    const departmentSelected = departmentData.find(e => e.id === selectedDepartment);
    return <DepartmentDetail 
      department={departmentSelected} 
      onBack={() => setSelectedDepartment(null)} 
      onUpdate={(updated) => {
        setDepartmentData(prev => prev.map(e => e.id === departmentSelected.id ? { ...e, ...updated } : e));
        showNotification('Éxito', 'Empleado actualizado correctamente.');
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
          showNotification('Éxito', 'Empleado creado correctamente.');
        }}
      />
    );
  }

return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
      
      {show && (
        <Notification title={show.title} message={show.message} onClose={() => setShow(null)} />
      )}

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
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-white-600">
          Mostrando {paginatedDepartments.length > 0 ? startIndex + 1 : 0} a {Math.min(startIndex + itemsPerPage, dataToDisplay.length)} de {dataToDisplay.length}
          <b>
            {hasSearched
              ? ` Resultados: ${dataToDisplay.length} departamento(s)`
              : ` Total: ${departments.length} departamentos`
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