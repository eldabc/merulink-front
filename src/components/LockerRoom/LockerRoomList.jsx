import { useNavigate } from 'react-router-dom';
import { useLockers } from '../../context/LockerRoomContext';
import { useEffect, useMemo, useState } from 'react';

import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import LockerRoomRow from './LockerRoomRow';
import Pagination from '../Pagination';
import FilterByFields from '../Filters/FilterByFields';
import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';

import '../../Tables.css';


function LockerRoomList() {
  const navigate = useNavigate();
  const { lockerData } = useLockers();

  const itemsPerPage = 10;

  // Al cargar el componente
  const SEARCH_FIELDS = ['code'];
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
          lockerData,
          searchValue,
          SEARCH_FIELDS,
          filterStatus,
          normalizeText
      );
  }, [lockerData, searchValue, filterStatus]);

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredLockers : lockerData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        <div className="titles-table flex justify-between items-center mb-4">
          
          <TitleHeader title="Listado de Lockers" />
          <div className="text-sm">
            <ButtonNavigate url={`/empleados/vestuarios/lockers/nuevo`} navigate={navigate} />
          </div>
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          moduleName='Locker'
          placeholder={'Ingrese código o categoría del locker'}
          showFilterStatus={true}
          active='disponible'
          inactive='ocupado'
        />

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Estatus</th>
                <th className="px-4 py-3 text-left font-semibold">Código</th>
                <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((locker) => (
                <LockerRoomRow 
                  key={locker.id}
                  locker={locker} 
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          paginatedData={paginatedData}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={hasSearched}
          data={lockerData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Locker'}
        />
      </div>
  );
}

export default LockerRoomList;