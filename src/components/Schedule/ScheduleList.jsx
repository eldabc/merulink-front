import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchedules } from "../../context/ScheduleContext";

import { normalizeText } from '../../utils/text-utils.js';
import { filterData } from '../../utils/filter-utils.js';

import ScheduleRow from './ScheduleRow';
import Pagination from '../Pagination.jsx';
import TitleHeader from '../Shared/TitleHeader.jsx';
import ButtonNavigate from '../Shared/ButtonNavigate.jsx';
import FilterByFields from '../Filters/FilterByFields.jsx';
import SpanText from '../Shared/SpanText.jsx';
import RowTableLoading from '../Shared/RowTableLoading.jsx';

import '../../Tables.css';

export default function ScheduleList({ categoryKeys }) {
  
  const navigate = useNavigate();
  const { loading, scheduleData } = useSchedules();
  const [searchDateValue, setSearchDateValue] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const SEARCH_FIELDS = useMemo(() => ['description'], []);

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

      <FilterByFields
        searchValue={searchValue}
        searchDateValue={searchDateValue}
        onSearchChange={(val) => { setSearchValue(val); setCurrentPage(1); }}
        onFilterDate={(val) => { setSearchDateValue(val); setCurrentPage(1); }}
        moduleName='Horario'
        placeholder='Ingrese descripción'
      />

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
                      <th className="px-4 py-3 text-left font-semibold">Código</th>
                      <th className="px-4 py-3 text-left font-semibold">Descripción</th>
                      <th className="px-4 py-3 text-left font-semibold">Hora Entrada</th>
                      <th className="px-4 py-3 text-left font-semibold">Hora Salida</th>
                      <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                      <th className="px-4 py-3 text-left font-semibold">Descanso</th>
                      <th className="px-4 py-3 text-left font-semibold">Tiempo Activo</th>
                      <th className="px-4 py-3 text-left font-semibold">Disponible</th>
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