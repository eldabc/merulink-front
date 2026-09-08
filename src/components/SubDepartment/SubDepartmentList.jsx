import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoadMore from '../../hooks/useLoadMore';
import { useListState } from '../../context/ListStateContext';
import { useSubDepartments } from "../../context/SubDepartmentContext";

import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';
import FilterByFields from '../Filters/FilterByFields';

import SubDepartmentRow from './SubDepartmentRow';
import RowTableLoading from '../Shared/RowTableLoading';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import HasPermission from '../Shared/HasPermission';
import LoadMorePagination from '../Shared/LoadMorePagination';

export default function SubDepartmentList() {

  const navigate = useNavigate();
  const { get, set } = useListState();
  const { loading, subDepartmentData, loadSubDepartments } = useSubDepartments();

  const itemsPerPage = 25;
  const LIST_KEY = 'subdepartment-list';

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
    loadSubDepartments();
  }, []);

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
      "",
      normalizeText
    );
  }, [subDepartmentData, searchValue]);

  
  // "Ver más"/paginación scroll vertical con memoria de posición
  const {
    visibleItems, isExpanded, loadMore, showLess, activePage, totalPages, goToPage,
    chunkOf, chunkClass, total,
  } = useLoadMore(isFiltering ? filteredSubDepartments : subDepartmentData, itemsPerPage, {
    remember: {
      storage: { get, set },
      key: LIST_KEY,
      isBaseView: !isFiltering,
      resetToken: `${searchValue}|`,
    },
  });
  
  return (
    <HasPermission permissions={["view-subdepartments"]}>
      <div className="main-data-cont table-container">
        <div className="titles-table">
          <TitleHeader title="Listado de Sub-Departamentos" />
            <HasPermission permissions={["create-subdepartments"]}>
              <ButtonNavigate url={`/empleados/sub-departamentos/nuevo`} navigate={navigate}  />
            </HasPermission>
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
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
                {visibleItems.map((subDep, index) => (
                  <SubDepartmentRow 
                    key={subDep.id}
                    subDep={subDep}
                    rowClassName={chunkClass(index)}
                    chunk={chunkOf(index)} 
                  />
                ))}
                </>
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
          moduleName={'Subdepartamento'}
        />
      </div>
    </HasPermission>
  );
}