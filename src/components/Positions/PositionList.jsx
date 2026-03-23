import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from "../../context/NotificationContext";  
import { usePositions } from "../../context/PositionContext";

import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import FilterByFields from '../Filters/FilterByFields';
import Pagination from '../Pagination';
import PositionRow from './PositionRow';
import PositionForm from './PositionForm';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import RowTableLoading  from '../Shared/RowTableLoading';

export default function PositionList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  // const [selectedPosition, setSelectedPosition] = useState(null);
  const itemsPerPage = 10;
  // const [show, setShow] = useState(false);
  // const { showNotification } = useNotification();
  
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


  // Si hay seleccionado, mostrar detalle
  // if (selectedPosition) {
  //   const positionSelected = positionData.find(d => d.id === selectedPosition);
  //   return <PositionForm 
  //           mode="view"
  //           position={positionSelected} 
  //           onBack={() => setSelectedPosition(null)} 
  //           onUpdate={(updated) => {
  //             setPositionData(prev => prev.map(e => e.id === positionSelected.id ? { ...e, ...updated } : e));
  //             showNotification('Éxito', 'Cargo actualizado correctamente.');
  //             setSelectedPosition(null);
  //           }}
  //           />
  // }
  // if (addPosition) {
  //   return (
  //     <PositionAdd
  //       position={addPosition}
  //       onBack={() => setAddPosition(null)}
  //       onCreated={(newEmp) => {
  //         // assign an id and prepend to list
  //         setPositionData(prev => [{ ...newEmp, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 }, ...prev]);
  //         setAddPosition(null);
  //         showNotification('Éxito', 'Cargo creado correctamente.');
  //       }}
  //     />
  //   );
  // }

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
                    // setSelectedPosition={setSelectedPosition}
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