import { useNavigate } from 'react-router-dom';
import { usePadlockPatterns } from '../../context/PadlockPatternContext';
import { useEffect, useMemo, useState } from 'react';

import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import PadlockPatternRow from './PadlockPatternRow'; 
import Pagination from '../Pagination';
import RowTableLoading from '../Shared/RowTableLoading';

import '../../Tables.css';

function PadlockPatternPatternList() {
  const navigate = useNavigate();
  const { loading, padlockPatternData } = usePadlockPatterns();

  // Para buscador y paginación
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);

  // Datos para mostrar
  const dataToDisplay = padlockPatternData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="main-data-cont table-container">
        <div className="titles-table">
          
          <TitleHeader title="Listado Patrones de Candados" />
          <ButtonNavigate url={`/empleados/vestuarios/candados/patrones/nuevo`} navigate={navigate} />
        </div>

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Modelo Candado</th>
                <th className="px-4 py-3 text-left font-semibold md:w-4xl">Secuencia Desbloqueo</th>
                <th className="px-4 py-3 text-left font-semibold">Reinicio</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <RowTableLoading />
              ) : (
                paginatedData.map((padlockPattern) => (
                  <PadlockPatternRow key={padlockPattern.id} padlockPattern={padlockPattern}/>
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
          data={padlockPatternData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Patrone'}
        />
      </div>
  );
};

export default PadlockPatternPatternList;