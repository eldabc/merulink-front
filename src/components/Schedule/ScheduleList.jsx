import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules } from "../../context/ScheduleContext";
import { useGlobalData } from '../../context/GlobalDataContext';

import { normalizeText } from '../../utils/text-utils.js';
import { filterData } from '../../utils/filter-utils.js';
import { statusOptions } from '../../utils/StaticData/schedule-utils';

import ScheduleRow from './ScheduleRow';
import Pagination from '../Pagination';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import SpanText from '../Shared/SpanText';
import RowTableLoading from '../Shared/RowTableLoading';
import ScheduleFilterList from './ScheduleFilterList';

import '../../Tables.css';

export default function ScheduleList({ categoryKeys }) {
  
  const navigate = useNavigate();
  const { globalLoading, departments, loadDepartments } = useGlobalData();
  const { loading, scheduleData, loadSchedules, setScheduleData } = useSchedules();
  const [currentPage, setCurrentPage] = useState(1);
  const [monthSelectedJson, setMonthSelectedJson] = useState(1);
  const [filters, setFilters] = useState({
    department: '',
    month: '',
  });

  const itemsPerPage = 10;

  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments();
    }
  }, []);

  const loadSchedulesData = useCallback((currentFilters) => {
    // console.log("monthSelectedJson",currentFilters.monthSelectedJson);
    if (currentFilters.department) {
      
      setMonthSelectedJson(currentFilters?.monthSelectedJson);
      loadSchedules(
        currentFilters.department, 
        currentFilters?.month ?? '', 
        currentFilters?.monthSelectedJson?.currentYear ?? new Date().getFullYear()
      );

    } else {
      setScheduleData([]);
      setMonthSelectedJson([]);
    }
  }, [loadSchedules]);

  // Datos para mostrar
  const dataToDisplay = scheduleData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedules = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  const statusOptionsMap = statusOptions.reduce((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {});

  return (
    <div className="main-data-cont table-container">
      <div className="titles-table">
        <TitleHeader title="Horarios" />
        <div className="text-sm">
          <ButtonNavigate url={`/empleados/horarios/nuevo`} navigate={navigate} />
        </div>
      </div>

      <ScheduleFilterList departments={departments} loading={globalLoading} onLoadSchedules={loadSchedulesData} filters={filters} setFilters={setFilters} />

      {(dataToDisplay.length === 0) && !loading ? (
        <SpanText text={`No se encontraron horarios registrados.`} />
      ) : (
        <>
        <div className="rounded-lg shadow">
            <table className="min-w-full border-collapse text-sm sm:text-base">
            {!loading ? (
                <>
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
                      {paginatedSchedules.map((item) => {
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
                          />
                        );
                      })}
                    </tbody>
                </>
                ) : (
                <tbody>
                    <RowTableLoading colSpan={6} />
                </tbody>
                )}
            </table>
        </div>
        </>
      )}

      <Pagination
        paginatedData={paginatedSchedules}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        dataToDisplay={dataToDisplay}
        data={scheduleData}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        moduleName={'Horario'}
      />
    </div>        
  );
}