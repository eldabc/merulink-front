import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartments } from "../../context/DepartmentContext";
import useLoadMore from '../../hooks/useLoadMore';
import { useListState } from '../../context/ListStateContext';

import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';

import FilterByFields from '../Filters/FilterByFields';
import ButtonNavigate from '../Shared/ButtonNavigate';
import TitleHeader from '../Shared/TitleHeader';
import RowTableLoading from '../Shared/RowTableLoading';
import HasPermission from '../Shared/HasPermission';
import DepartmentRow from './DepartmentRow';
import SpanText from '../Shared/SpanText';
import LoadMorePagination from '../Shared/LoadMorePagination';

export default function DepartmentList() {

  const navigate = useNavigate();
  const { get, set } = useListState();
  const { loading, departmentData, loadDepartments } = useDepartments();

  const itemsPerPage = 25;
  const LIST_KEY = 'position-list';
  
  // Restaurar búsqueda/filtro recordados
  const restoredRef = useRef(null);
  if (restoredRef.current === null) {
    restoredRef.current = get(LIST_KEY);
  }
  const restored = restoredRef.current;

  const [searchValue, setSearchValue] = useState(restored?.searchValue ?? '');
  const isFiltering = Boolean(searchValue.trim());

  // Persistir búsqueda/filtro (la posición de scroll la recuerda useLoadMore "remember")
  useEffect(() => {
    set(LIST_KEY, { ...(get(LIST_KEY) || {}), searchValue });
  }, [searchValue, get, set]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const DEPARTMENTS_SEARCH_FIELDS = ['code', 'departmentName'];

  // Filtrar
  const filteredDepartments = useMemo(() => {
    return filterData(
      departmentData,
      searchValue,
      DEPARTMENTS_SEARCH_FIELDS,
      "",
      normalizeText
    );
  }, [departmentData, searchValue]);

  // "Ver más"/paginación scroll vertical con memoria de posición
  const {
    visibleItems, isExpanded, loadMore, showLess, activePage, totalPages, goToPage,
    chunkOf, chunkClass, total,
  } = useLoadMore(isFiltering ? filteredDepartments : departmentData, itemsPerPage, {
    remember: {
      storage: { get, set },
      key: LIST_KEY,
      isBaseView: !isFiltering,
      resetToken: `${searchValue}|`,
    },
  });

  return (
    <HasPermission permissions={["view-departments"]}>
      <div className="main-data-cont table-container">
        <div className="titles-table">
          <TitleHeader title="Listado de Departamentos" />
          <HasPermission permissions={["create-departments"]}>
            <ButtonNavigate url={`/empleados/departamentos/nuevo`} navigate={navigate}  />
          </HasPermission>
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
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
              {loading ? (
                <RowTableLoading />
              ) : (
                visibleItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-gray-500">
                      <SpanText text="No se encontraron departamentos que coincidan con la búsqueda. " />
                    </td>
                  </tr>
                ) : (
                  visibleItems.map((dep, index) => (
                    <DepartmentRow 
                      key={dep.id}
                      dep={dep}
                      rowClassName={chunkClass(index)}
                      chunk={chunkOf(index)} 
                    />
                  ))
                )
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
          moduleName={'Departamento'}
        />
      </div>
    </HasPermission> 
  );
}