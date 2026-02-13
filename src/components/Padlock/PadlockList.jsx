import { useNavigate } from 'react-router-dom';
import { usePadlocks } from '../../context/PadlockContext';

import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import ButtonDelete from '../Shared/ButtonDelete';

import '../../Tables.css';


function PadlockList() {
  const navigate = useNavigate();
  const { padlockData } = usePadlocks();
console.log("padlocks", padlockData)

    return (
      <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        <div className="titles-table flex justify-between items-center mb-4">
          
          <TitleHeader title="Listado de Candados" />
          <div className="text-sm">
            <ButtonNavigate url={`/empleados/vestuarios/candados/nuevo`} navigate={navigate} />
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
              {padlockData.map((padlok) => (
                <>
                  <tr
                    key={padlok.id}
                    onClick={() => selectedLocker(padlok)}
                    className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-white-800 font-medium ">{padlok.status}</td>
                    <td className="px-4 py-3 text-white-800 font-medium">{padlok.serial}</td>
                    <td className="px-4 py-3 text-white-800 font-medium ">{padlok?.pass}</td>
                    <td className="px-4 py-3 text-white-700">
                      <ButtonDelete setIsModalOpen={() => handleDeleteClick(padlok)} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {/* <ConfirmDialog 
                        isOpen={isModalOpen}
                        onClose={() => {
                          setIsModalOpen(false);
                          setSelectedTemplate(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        title="Eliminar Locker"
                        message={`¿Estás seguro de que deseas eliminar Locker "${selectedTemplate?.code}"?`}
                      /> */}
                    </td>
                  </tr>
                </>
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

export default PadlockList;