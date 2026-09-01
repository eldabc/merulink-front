import { useState, useEffect, useMemo } from 'react';
import { useEmployees } from '../../context/EmployeeContext'; 
import { useNavigate } from 'react-router-dom';
import useLoadMore from '../../hooks/useLoadMore';

import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';

import EmployeeRow from './EmployeeRow';
import FilterByFields from '../Filters/FilterByFields';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import RowTableLoading from '../Shared/RowTableLoading';
import HasPermission from '../Shared/HasPermission';
import LoadMorePagination from '../Shared/LoadMorePagination';
import '../../Tables.css';

export default function EmployeeList() {
  const { loadingEmployeeData, employeeData, loadEmployees } = useEmployees();
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const getEmployees = async () => {
      await loadEmployees();
    }
    getEmployees();
  }, []);

  // Ejecutar búsqueda automáticamente al teclear o al cambiar el filtro de estado
  useEffect(() => {
    if (searchValue.trim() || filterStatus !== 'all') {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
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

  // Datos para mostrar + "Ver más"/paginación scroll vertical (reutilizable)
  const dataToDisplay = hasSearched ? filteredEmployees : employeeData;
  const {
    visibleItems, isExpanded, loadMore, showLess, activePage, totalPages, goToPage, chunkOf, chunkClass, total,
  } = useLoadMore(dataToDisplay, itemsPerPage);

return (
  <HasPermission permissions={['view-employees']} >
    <div className="main-data-cont table-container">    
      <div className="titles-table">
        <TitleHeader title='Listado de Empleados' />
        <HasPermission permissions={["create-employees"]}>
          <ButtonNavigate url={`/empleados/nuevo`} navigate={navigate} />
        </HasPermission>
      </div>

      <FilterByFields
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatus}
        showFilterStatus={true}
        moduleName='Empleado'
        placeholder='Ingrese nombre, apellido, cédula, departamento o sub-departamento'
      />

      <div className="rounded-lg shadow overflow-x-auto">
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
            {loadingEmployeeData ? (
              <RowTableLoading colSpan={8} />
            ) : (
              visibleItems.map((emp, index) => (
                <EmployeeRow
                  key={emp.id}
                  emp={emp}
                  rowClassName={chunkClass(index)}
                  chunk={chunkOf(index)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <LoadMorePagination
        activePage={activePage}
        totalPages={totalPages}
        goToPage={goToPage}
        isExpanded={isExpanded}
        loadMore={loadMore}
        showLess={showLess}
        itemsPerPage={itemsPerPage}
        visibleCount={visibleItems.length}
        total={total}
        moduleName={'Empleado'}
      />
    </div>
  </HasPermission>
);
}
