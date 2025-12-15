import React, { useState, useEffect } from 'react';
import { useNotification } from "../../context/NotificationContext";  
import { SubDepartmentProvider, useSubDepartments } from "../../context/SubDepartmentContext";
import { subDepartments } from '../../utils/StaticData/subDepartments-utils';
import SubDepartmentRow from './SubDepartmentRow';
import Pagination from '../Pagination';
import SubDepartmentForm from './SubDepartmentForm';
import SubDepartmentAdd from './SubDepartmentAdd';
import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';
import FilterByFields from '../Filters/FilterByFields';
import { useMemo } from 'react';

export default function SubSubDepartmentList() {
	const { showNotification } = useNotification();
		return (
			<SubDepartmentProvider initialData={subDepartments} showNotification={showNotification}>
				<SubDepartmentListContent />
			</SubDepartmentProvider>
		);
}

// Componente interno que usa el contexto
function SubDepartmentListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // se deja por ahora mientras se define como gestionaremos estatus para departamentos
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSubDepartment, setSelectedSubDepartment] = useState(null);
  const [addSubDepartment, setAddSubDepartment] = useState(null);
  const itemsPerPage = 10;
  const [show, setShow] = useState(false);
  const { showNotification } = useNotification();
  
  // Leer del contexto (fuente única de verdad)
  const { subDepartmentData, setSubDepartmentData } = useSubDepartments();

  // Ejecutar búsqueda automáticamente al teclear o al cambiar el filtro de estado
  useEffect(() => {
    if (searchValue.trim() || filterStatus !== 'all') {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue, filterStatus]);

  const SUB_DEPARTMENTS_SEARCH_FIELDS = [
    'code', 
    'subDepartmentName',
    'departmentName'
  ];

  // Filtrar empleados
  const filteredSubDepartments = useMemo(() => {
      return filterData(
          subDepartmentData,
          searchValue,
          SUB_DEPARTMENTS_SEARCH_FIELDS,
          filterStatus,
          normalizeText
      );
  }, [subDepartmentData, searchValue, filterStatus]);

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredSubDepartments : subDepartmentData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubDepartments = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  // Si hay departamento seleccionado, mostrar detalle
  if (selectedSubDepartment) {
    const subDepartmentSelected = subDepartmentData .find(d => d.id === selectedSubDepartment);
    return <SubDepartmentForm 
			mode="view"
      subDepartment={subDepartmentSelected} 
      onBack={() => setSelectedSubDepartment(null)} 
      onUpdate={(updated) => {
        setSubDepartmentData(prev => prev.map(e => e.id === subDepartmentSelected.id ? { ...e, ...updated } : e));
        showNotification('Éxito', 'Sub-Departamento actualizado correctamente.');
        setSelectedSubDepartment(null);
      }}
    />
  }
  if (addSubDepartment) {
    return (
      <SubDepartmentAdd
        subDepartment={addSubDepartment}
        onBack={() => setAddSubDepartment(null)}
        onCreated={(newEmp) => {
          // assign an id and prepend to list
          setSubDepartmentData(prev => [{ ...newEmp, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 }, ...prev]);
          setAddSubDepartment(null);
          showNotification('Éxito', 'Sub-Departamento creado correctamente.');
        }}
      />
    );
  }

  return (
      <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        
        {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )}

        <div className="titles-table flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Listado de Sub-Departamentos</h2>
          <div className="text-sm">
            <button
              onClick={() => setAddSubDepartment({})}
              className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
            >
              ← Nuevo Registro
            </button>
          </div>
        </div>
        {/* Filtro */}
        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          moduleName='Sub-Departamento'
          placeholder='Ingrese código o nombre de Sub-departamento'
        />

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Código</th>
                <th className="px-4 py-3 text-left font-semibold">Sub-Departamento</th>
                <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubDepartments.map((subDep) => (
                <SubDepartmentRow 
                  key={subDep.id}
                  subDep={subDep} 
                  setSelectedSubDepartment={setSelectedSubDepartment}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <Pagination
          paginatedData={paginatedSubDepartments }
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={hasSearched}
          data={subDepartmentData }
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Departamento'}
        />
      </div>
  );
}