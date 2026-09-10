import dayjs from 'dayjs';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useSchedules } from "../../context/ScheduleContext";
import { useGlobalData } from '../../context/GlobalDataContext';
import useLoadMore from '../../hooks/useLoadMore';
import { useListState } from '../../context/ListStateContext';

import { statusOptions } from '../../utils/StaticData/schedule-utils';
import { allMonths } from '../../utils/StaticData/months-utils';

import ScheduleRow from './ScheduleRow';
import LoadMorePagination from '../Shared/LoadMorePagination';
import TitleHeader from '../Shared/TitleHeader';
import SpanText from '../Shared/SpanText';
import RowTableLoading from '../Shared/RowTableLoading';
import HasPermission from '../Shared/HasPermission';
import ScheduleFilterList from './ScheduleFilterList';

import '../../Tables.css';

export default function ScheduleList() {
  const { get, set } = useListState();
  const { globalLoading, filteredDepartments } = useGlobalData();
  const { loading, scheduleData, loadSchedules, setScheduleData } = useSchedules();
  const [monthSelectedJson] = useState(1);

  const itemsPerPage = 10;
  const LIST_KEY = 'schedule-list';
  
  // Restaurar búsqueda/filtro recordados
  const restoredRef = useRef(null);
  if (restoredRef.current === null) {
    restoredRef.current = get(LIST_KEY);
  }

  const [filters, setFilters] = useState({
    department: '',
    month: '',
    ...(restoredRef.current?.filters ?? {}),
  });
  
  // ¿Hay algún filtro aplicado? (departamento o mes)
  const isFiltering = Boolean(filters.department || filters.month);

  // Persistir los filtros (la posición de scroll la recuerda useLoadMore "remember")
  useEffect(() => {
    set(LIST_KEY, { ...(get(LIST_KEY) || {}), filters });
  }, [filters, get, set]);

  // Mes actual
  const now = dayjs();

  // Añadir año correspondiente a los meses (dayjs maneja el cambio de año)
  const mapToMonthWithYear = (d) => {
    const idx = d.month(); // 0-11
    return { ...allMonths[idx], currentYear: d.year() };
  };

  // Orden del selector: mes próximo, mes actual y dos meses atrás
  const availableMonths = [
    mapToMonthWithYear(now.add(1, 'month')),
    mapToMonthWithYear(now),
    mapToMonthWithYear(now.subtract(1, 'month')),
    mapToMonthWithYear(now.subtract(2, 'month'))
  ];

  const loadSchedulesData = useCallback((currentFilters) => {
    
    if (currentFilters.department) {
     
      loadSchedules(
        currentFilters.department, 
        currentFilters?.month ?? '', 
        currentFilters?.monthSelectedJson?.currentYear ?? new Date().getFullYear()
      );

    } else {
      setScheduleData([]);
    }
  }, [loadSchedules]);


  // "Ver más"/paginación scroll vertical con memoria de posición
  const {
    visibleItems, isExpanded, loadMore, showLess, activePage, totalPages, goToPage,
    chunkOf, chunkClass, total,
  } = useLoadMore(scheduleData, itemsPerPage, {
    remember: {
      storage: { get, set },
      key: LIST_KEY,
      isBaseView: !isFiltering,
      resetToken: `${filters.department}|${filters.month}`,
    },
  });

  const statusOptionsMap = statusOptions.reduce((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {});

  return (
    <HasPermission permissions={["view-schedules"]}>
      <div className="main-data-cont table-container">
        <div className="titles-table">
          <TitleHeader title="Listado de Horarios" />
        </div>

        <ScheduleFilterList 
          onFilteredDepartments={filteredDepartments} 
          onLoadSchedules={loadSchedulesData} 
          loading={globalLoading} 
          filters={filters} 
          setFilters={setFilters} 
          availableMonths={availableMonths}
        />

        {(visibleItems.length === 0) && !loading ? (
          <SpanText text={`No se encontraron horarios registrados.`} dynamicClasses="inline-block mt-5" />
        ) : (
          <div className="rounded-lg shadow">
            <table className="min-w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="tr-thead-table">
                  <th className="px-4 py-3 text-left font-semibold">Mes</th>
                  <th className="px-4 py-3 text-left font-semibold">Quincena</th>
                  <th className="px-4 py-3 text-left font-semibold">Observación</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!loading ? (
                  visibleItems.map((item, index) => {
                    const statusInfo = statusOptionsMap[item?.status] || { 
                      value: item?.status || '', 
                      label: 'Sin estado', 
                      color: '#ffffff' 
                    };

                    return (
                      <ScheduleRow 
                        key={item?.id} 
                        schedule={item}
                        statusInfo={statusInfo}
                        departmentId={filters.department}
                        monthSelectedJson={monthSelectedJson}
                        availableMonths={availableMonths}
                        rowClassName={chunkClass(index)}
                        chunk={chunkOf(index)}
                      />
                    );
                  })
                ) : (
                  <RowTableLoading colSpan={6} />
                )}
              </tbody>
            </table>
          </div>
        )}

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
          moduleName={'Horario'}
        />
      </div>
    </HasPermission>        
  );
}