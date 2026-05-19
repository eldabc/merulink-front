import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShifts } from "../../context/ShiftContext";

import { stringCategoryEvents } from '../../utils/Events/events-utils';
import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import { EVENT_CAT } from '../../utils/eventConfig.js';

import ShiftRow from './ShiftRow';
import Pagination from '../Pagination';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate.jsx';
import FilterByFields from '../Filters/FilterByFields.jsx';
import ButtonHistory from '../Shared/ButtonHistory.jsx';
import SpanText from '../Shared/SpanText.jsx';
import RowTableLoading from '../Shared/RowTableLoading.jsx';
import HistoryNavigation from '../Shared/HistoryNavigation.jsx';

import '../../Tables.css';

export default function ShiftList({ categoryKeys }) {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, shiftData } = useShifts();
  const [searchDateValue, setSearchDateValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const currentSystemYear = new Date().getFullYear();
  const [historyYear, setHistoryYear] = useState(currentSystemYear);
  
  const prevCategoryKeys = useRef();
  const prevShowHistory = useRef();
  const prevHistoryYear = useRef(currentSystemYear);
  const isFirstRender = useRef(true);

  const itemsPerPage = 10;
   const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const SEARCH_FIELDS = useMemo(() => ['title', 'start'], []);
  const categoryKeysString = JSON.stringify(categoryKeys);
  const locationState = location.state;
  const stringCategory = stringCategoryEvents(categoryKeys);


    // Filtrar
  const filteredShifts = useMemo(() => {
      return filterData(
          shiftData,
          searchValue,
          SEARCH_FIELDS,
          "",
          normalizeText
      );
  }, [shiftData, searchValue]);

    // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredShifts : shiftData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShifts = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="main-data-cont table-container">
      <div className="titles-table">
        <TitleHeader title="Turnos" />
        <div className="text-sm">
          <ButtonNavigate url={`/empleados/horarios/turnos/nuevo`} navigate={navigate} />
        </div>
      </div>

      <FilterByFields
        searchValue={searchValue}
        searchDateValue={searchDateValue}
        onSearchChange={(val) => { setSearchValue(val); setCurrentPage(1); }}
        onFilterDate={(val) => { setSearchDateValue(val); setCurrentPage(1); }}
        moduleName='Evento'
        placeholder='Ingrese nombre del evento'
        showFilterDate={true}
      />

      {(dataToDisplay.length === 0 ) && !loading ? (
        <SpanText text={`No se encontraron turnos registrados.`} />
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
                        {paginatedShifts.map((item) => (
                          <ShiftRow 
                            key={item.id} 
                            shift={item} 
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

      {/* <Pagination
        paginatedData={paginatedShifts}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        dataToDisplay={dataToDisplay}
        hasSearched={isSearching}
        data={shiftData}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        moduleName={'Evento'}
      /> */}
    </div>        
  );
}