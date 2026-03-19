import React, { useState, useEffect, useMemo } from 'react';
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
import RowTableLoading from '../Shared/RowTableLoading';

export default function SubDepartmentList() {

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // se deja por ahora mientras se define como gestionaremos estatus para departamentos
  const [hasSearched, setHasSearched] = useState(false);
  // const [selectedSubDepartment, setSelectedSubDepartment] = useState(null);
  const [addSubDepartment, setAddSubDepartment] = useState(null);
  const [show, setShow] = useState(false);
  const { showNotification } = useNotification();
  const { subDepartmentData, setSubDepartmentData } = useSubDepartments();

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

  const SUB_DEPARTMENTS_SEARCH_FIELDS = [
    'code', 
    'name',
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
  console.log("paginatedSubDepartments", paginatedSubDepartments)
  // Si hay departamento seleccionado, mostrar detalle
  // if (selectedSubDepartment) {
  //   const subDepartmentSelected = subDepartmentData .find(d => d.id === selectedSubDepartment);
  //   return <SubDepartmentForm 
	// 		mode="view"
  //     subDepartment={subDepartmentSelected} 
  //     onBack={() => setSelectedSubDepartment(null)} 
  //     onUpdate={(updated) => {
  //       setSubDepartmentData(prev => prev.map(e => e.id === subDepartmentSelected.id ? { ...e, ...updated } : e));
  //       showNotification('Éxito', 'Sub-Departamento actualizado correctamente.');
  //       setSelectedSubDepartment(null);
  //     }}
  //   />
  // }
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
      <div className="main-data-cont table-container">
        
        {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )}

        <div className="titles-table">
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
              {loading ? (
                <RowTableLoading />
              ) : (
                <>
                {paginatedSubDepartments.map((subDep) => (
                  <SubDepartmentRow 
                    key={subDep.id}
                    subDep={subDep} 
                  />
                ))}
                </>
              )} 
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
          moduleName={'Subdepartamento'}
        />
      </div>
  );
}