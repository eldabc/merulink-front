import { useNavigate } from 'react-router-dom';
import { useLockerAssigns } from '../../context/LockerAssignContext';
import { useEffect, useMemo, useState } from 'react';

import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import LockerAssignRow from './LockerAssignRow'; 
import Pagination from '../Pagination';
import FilterByFields from '../Filters/FilterByFields';
import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';

import '../../Tables.css';

function LockerAssignList() {
  const navigate = useNavigate();
  const { lockerAssignData } = useLockerAssigns();

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
          lockerAssignData,
          searchValue,
          SEARCH_FIELDS,
          filterStatus,
          normalizeText
      );
  }, [lockerAssignData, searchValue, filterStatus]);
// console.log("lockerAssignData", lockerAssignData)
  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredLockers : lockerAssignData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        <div className="titles-table flex justify-between items-center mb-4">
          
          <TitleHeader title="Asignación de Casilleros" />
          <div className="text-sm">
            <ButtonNavigate url={`/empleados/vestuarios/casilleros/nuevo`} navigate={navigate} />
          </div>
        </div>

        {/* <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          moduleName='Candado'
          placeholder={'Ingrese serial del candado'}
          showFilterStatus={true}
          active='disponible'
          inactive='asignado'
        /> */}

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
              {paginatedData.map((padlock) => (
                <LockerAssignRow key={padlock.id} padlock={padlock}/>
              ))}
            </tbody>
          </table>
        </div>

        {/* <Pagination
          paginatedData={paginatedData}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={hasSearched}
          data={lockerAssignData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Candado'}
        /> */}
      </div>
  );
}

export default LockerAssignList;