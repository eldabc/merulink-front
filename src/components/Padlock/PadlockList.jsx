import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePadlocks } from '../../context/PadlockContext';

import FilterByFields from '../Filters/FilterByFields';
import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';

import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import RowTableLoading from '../Shared/RowTableLoading';
import PadlockRow from './PadlockRow'; 
import Pagination from '../Pagination';
import '../../Tables.css';

function PadlockList() {
  const navigate = useNavigate();
  const { loading, padlockData } = usePadlocks();

  // Para buscador y paginación
  const itemsPerPage = 10;
  const SEARCH_FIELDS = ['serial'];
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchValue.trim() || filterStatus !== 'all' ) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue, filterStatus]);

  // Filtrar
  const filteredLockers = useMemo(() => {

      return filterData(
          padlockData,
          searchValue,
          SEARCH_FIELDS,
          filterStatus,
          normalizeText
      );
  }, [padlockData, searchValue, filterStatus]);

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredLockers : padlockData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);


    return (
      <div className="main-data-cont table-container">
        <div className="titles-table">
          
          <TitleHeader title="Listado de Candados" />
          <ButtonNavigate url={`/empleados/vestuarios/candados/nuevo`} navigate={navigate} />
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          moduleName='Candado'
          placeholder={'Ingrese serial del candado'}
          showFilterStatus={true}
          active='disponible'
          inactive='asignado'
        />

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Estatus</th>
                <th className="px-4 py-3 text-left font-semibold">Serial</th>
                <th className="px-4 py-3 text-left font-semibold">Contraseña</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <RowTableLoading />
              ) : (
                paginatedData.map((padlock) => (
                  <PadlockRow key={padlock.id} padlock={padlock}/>
                ))
              )} 
            </tbody>
          </table>
        </div>

        <Pagination
          paginatedData={paginatedData}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={hasSearched}
          data={padlockData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Candado'}
        />
      </div>
  );
}

export default PadlockList;