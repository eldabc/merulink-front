import { useState, useEffect, useMemo, useRef } from 'react';
import { useEmployees } from '../../context/EmployeeContext'; 
import { useNavigate } from 'react-router-dom';
import { useListState } from '../../context/ListStateContext';
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
  const { get, set } = useListState();
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const LIST_KEY = 'employee-list';

  // Estado recordado entre navegaciones (se lee UNA vez al montar)
  const restoredRef = useRef(null);
  if (restoredRef.current === null) {
    restoredRef.current = get(LIST_KEY);
  }
  const restored = restoredRef.current;

  const [searchValue, setSearchValue] = useState(restored?.searchValue ?? '');
  const [filterStatus, setFilterStatus] = useState(restored?.filterStatus ?? 'all');

  // ¿Estamos filtrando? (búsqueda activa o estatus distinto de "todos")
  const isFiltering = Boolean(searchValue.trim()) || filterStatus !== 'all';

  // Posición del listado COMPLETO (se restaura al limpiar búsqueda o volver de un detalle)
  const fullPosRef = useRef(restored?.fullPosition ?? { visibleCount: itemsPerPage, activePage: 1 });

  // Token del filtro para detectar cambios de búsqueda/estatus
  const filterToken = `${searchValue}|${filterStatus}`;
  const wasFilteringRef = useRef(isFiltering);
  const prevTokenRef = useRef(filterToken);

  useEffect(() => {
    const getEmployees = async () => {
      await loadEmployees();
    }
    getEmployees();
  }, []);

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
  const dataToDisplay = isFiltering ? filteredEmployees : employeeData;
  const {
    visibleItems, isExpanded, loadMore, showLess, activePage, totalPages, goToPage,
    resetToFirstPage, restorePosition, visibleCount, chunkOf, chunkClass, total,
  } = useLoadMore(dataToDisplay, itemsPerPage, {
    // Al volver al listado completo (sin filtro) se restaura la posición recordada
    initial: isFiltering ? null : fullPosRef.current,
  });

  // Un solo efecto: resetea/restaura la posición según el filtro y guarda el estado recordado
  useEffect(() => {
    const wasFiltering = wasFilteringRef.current;
    const tokenChanged = filterToken !== prevTokenRef.current;
    wasFilteringRef.current = isFiltering;
    prevTokenRef.current = filterToken;

    // Nueva búsqueda/filtro → el resultado filtrado empieza en la página 1
    if (isFiltering && (!wasFiltering || tokenChanged)) {
      resetToFirstPage();
    }

    // Se limpió la búsqueda → volver a la posición del listado completo
    if (!isFiltering && wasFiltering) {
      restorePosition(fullPosRef.current);
      set(LIST_KEY, { searchValue, filterStatus, fullPosition: fullPosRef.current });
      return; // no pisar fullPos con la posición "de filtrado" de este mismo render
    }

    // Guardar la posición base solo cuando estamos en el listado completo
    if (!isFiltering) {
      fullPosRef.current = { visibleCount, activePage };
    }
    set(LIST_KEY, { searchValue, filterStatus, fullPosition: fullPosRef.current });
  }, [isFiltering, filterToken, visibleCount, activePage, searchValue, filterStatus, set, resetToFirstPage, restorePosition]);

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
