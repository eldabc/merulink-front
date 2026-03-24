import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePositions } from "../../context/PositionContext";

import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import FilterByFields from '../Filters/FilterByFields';
import Pagination from '../Pagination';
import PositionRow from './PositionRow';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import RowTableLoading  from '../Shared/RowTableLoading';

export default function PositionList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const itemsPerPage = 10;
  
  // Fuente única de verdad
  const { loading, positionData } = usePositions();

  // Ejecutar búsqueda automáticamente al teclear
  useEffect(() => {
    if (searchValue.trim()) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue]);

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

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredPositions : positionData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPositions = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

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
                <RowTableLoading />
              ) : (
                paginatedPositions.map((position) => (
                  <PositionRow 
                    key={position.id}
                    position={position} 
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          paginatedData={paginatedPositions}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={hasSearched}
          data={positionData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Cargo'}
        />
      </div>
  );
}