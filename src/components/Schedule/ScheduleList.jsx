import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules } from "../../context/ScheduleContext";
import { useGlobalData } from '../../context/GlobalDataContext';

import { normalizeText } from '../../utils/text-utils.js';
import { filterData } from '../../utils/filter-utils.js';

import ScheduleRow from './ScheduleRow';
import Pagination from '../Pagination';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import FilterByFields from '../Filters/FilterByFields';
import SpanText from '../Shared/SpanText';
import RowTableLoading from '../Shared/RowTableLoading';
import ScheduleFilter from './ScheduleFilterList';

import '../../Tables.css';

export default function ScheduleList({ categoryKeys }) {
  
  const navigate = useNavigate();
  const { globalLoading, departments, loadDepartments } = useGlobalData();
  const { loading, scheduleData, loadSchedules } = useSchedules();
  const [searchDateValue, setSearchDateValue] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const SEARCH_FIELDS = useMemo(() => ['description'], []);

  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments();
    }
    // loadSchedules(); // Esto se usara más adelante pero para traer segun el departamente sobre el que tiene permisos el usuario
  }, []);

  useEffect(() => {
    if (searchValue.trim()) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue]);

  // Filtrar
  const filteredSchedules = useMemo(() => {
      return filterData(
          scheduleData,
          searchValue,
          SEARCH_FIELDS,
          "",
          normalizeText
      );
  }, [scheduleData, searchValue]);

    // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredSchedules : scheduleData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedules = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="main-data-cont table-container">
      <div className="titles-table">
        <TitleHeader title="Horarios" />
        <div className="text-sm">
          <ButtonNavigate url={`/empleados/horarios/nuevo`} navigate={navigate} />
        </div>
      </div>

      <ScheduleFilter departments={departments} globalLoading={globalLoading} />

      {(dataToDisplay.length === 0 ) && !loading ? (
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
                      <th className="px-4 py-3 text-left font-semibold">Empleado</th>
                      <th className="px-4 py-3 text-left font-semibold">Turno</th>
                      <th className="px-4 py-3 text-left font-semibold">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                        {paginatedSchedules.map((item) => (
                          <ScheduleRow 
                            key={item?.id} 
                            schedule={item} 
                          />
                        ))}
                    
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
        hasSearched={hasSearched}
        data={scheduleData}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        moduleName={'Horario'}
      />
    </div>        
  );
}