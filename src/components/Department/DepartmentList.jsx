import React, { useState, useMemo } from 'react';
import { useNotification } from "../../context/NotificationContext";  
import { DepartmentProvider, useDepartments } from "../../context/DepartmentContext";
import { departments } from '../../utils/StaticData/departments-utils';
import DepartmentRow from './DepartmentRow';
import Pagination from '../Pagination';
import DepartmentForm from './DepartmentForm';
import DepartmentAdd from './DepartmentAdd';
import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';
import FilterByFields from '../Filters/FilterByFields';

export default function DepartmentList() {
  const { showNotification } = useNotification();
  return (
    <DepartmentProvider initialData={departments} showNotification={showNotification}>
      <DepartmentListContent />
    </DepartmentProvider>
  );
}

function DepartmentListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [addDepartment, setAddDepartment] = useState(null);
  const itemsPerPage = 10;
  const { showNotification } = useNotification();
  
  const { departmentData, setDepartmentData } = useDepartments();

  const DEPARTMENTS_SEARCH_FIELDS = ['code', 'departmentName'];

  // Lógica Unificada: Filtro y detección de búsqueda en un solo paso
  const { dataToDisplay, isSearching } = useMemo(() => {
    // Determinamos si el usuario está buscando algo
    const searching = searchValue.trim() !== '' || filterStatus !== 'all';

    // Si está buscando, filtramos. Si no, usamos la data original.
    const filtered = searching 
      ? filterData(departmentData, searchValue, DEPARTMENTS_SEARCH_FIELDS, filterStatus, normalizeText)
      : departmentData;

    return {
      dataToDisplay: filtered,
      isSearching: searching
    };
  }, [departmentData, searchValue, filterStatus]);

  // Cálculos de paginación basados en la data procesada
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  // Handlers para asegurar que la página vuelva a 1 al filtrar
  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

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
          setDepartmentData(prev => [{ ...newEmp, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 }, ...prev]);
          setAddDepartment(null);
          showNotification('Éxito', 'Departamento creado correctamente.');
        }}
      />
    );
  }

  return (
      <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        <div className="titles-table flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Listado de Departamentos</h2>
          <button
            onClick={() => setAddDepartment({})}
            className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2 border border-gray-200"
          >
            ← Nuevo Registro
          </button>
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          filterStatus={filterStatus}
          onFilterStatus={handleFilterStatus}
          moduleName='Departamento'
          placeholder='Ingrese código o nombre de departamento'
        />

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
              {paginatedDepartments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-500">
                    No se encontraron departamentos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                paginatedDepartments.map((dep) => (
                  <DepartmentRow 
                    key={dep.id}
                    dep={dep} 
                    setSelectedDepartment={setSelectedDepartment}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          paginatedData={paginatedDepartments}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={isSearching}
          data={departmentData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Departamento'}
        />
      </div>
  );
}