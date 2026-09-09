import { useState, useEffect, useMemo, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePositions } from "../../context/PositionContext";
import useLoadMore from '../../hooks/useLoadMore';
import { useListState } from '../../context/ListStateContext';

import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import FilterByFields from '../Filters/FilterByFields';

import PositionRow from './PositionRow';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import RowTableLoading  from '../Shared/RowTableLoading';
import LoadMorePagination from '../Shared/LoadMorePagination';

export default function PositionList() {
  const navigate = useNavigate();
  const { get, set } = useListState();
  const { loading, positionData, loadPositions } = usePositions();
  
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
    loadPositions();
  }, []);

  const POSITIONS_SEARCH_FIELDS = [
    'code', 
    'name'
  ];

  // Filtrar
  const filteredPositions = useMemo(() => {
    return filterData(
      positionData,
      searchValue,
      POSITIONS_SEARCH_FIELDS,
      "",
      normalizeText
    );
  }, [positionData, searchValue]);

  // "Ver más"/paginación scroll vertical con memoria de posición
  const {
    visibleItems, isExpanded, loadMore, showLess, activePage, totalPages, goToPage,
    chunkOf, chunkClass, total,
  } = useLoadMore(isFiltering ? filteredPositions : positionData, itemsPerPage, {
    remember: {
      storage: { get, set },
      key: LIST_KEY,
      isBaseView: !isFiltering,
      resetToken: `${searchValue}|`,
    },
  });

  return (
      <div className="main-data-cont table-container">      
        <div className="titles-table">
          <TitleHeader title="Listado de Cargos" />
          <ButtonNavigate url={`/empleados/cargos/nuevo`} navigate={navigate}  />
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          moduleName='Cargo'
          placeholder={'Ingrese código o nombre del cargo'}
        />

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Código</th>
                <th className="px-4 py-3 text-left font-semibold">Cargo</th>
                <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                <th className="px-4 py-3 text-left font-semibold">Sub-Departamento</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <RowTableLoading colSpan={5} />
              ) : (
                visibleItems.map((position, index) => (
                  <PositionRow 
                    key={position.id}
                    position={position}
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
          moduleName={'Cargo'}
        />
      </div>
  );
}