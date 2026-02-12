import { useNavigate } from 'react-router-dom';
import { useLockers } from '../../context/LockerRoomContext';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import LockerRoomRow from './LockerRoomRow';
import '../../Tables.css';


function LockerRoomList() {
  return (
    // <LockerRoomProvider>
      <LockerRoomListContent />
    // </LockerRoomProvider>
  );
}

function LockerRoomListContent() {
  const navigate = useNavigate();
  const { lockerData } = useLockers();
  console.log('lockerData', lockerData)
    return (
      <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        <div className="titles-table flex justify-between items-center mb-4">
          
          <TitleHeader title="Listado de Lockers" />
          <div className="text-sm">
            <ButtonNavigate url={`/empleados/vestuarios/lockers/nuevo`} navigate={navigate} />
          </div>
        </div>

        {/* Filtro */}
        {/* <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          moduleName='Cargo'
          placeholder={'Ingrese código o nombre del cargo'}
        /> */}

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
              {lockerData.map((locker) => (
                <LockerRoomRow 
                  key={locker.id}
                  locker={locker} 
                  // setSelectedPosition={setSelectedPosition}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {/* <Pagination
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
        /> */}
      </div>
  );
}

export default LockerRoomList;