import React, { useState, useEffect } from 'react';
import { useNotification } from "../../context/NotificationContext";  
import { PositionProvider, usePositions } from "../../context/PositionContext";
import { positions } from '../../utils/StaticData/positions-utils';
import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import FilterByFields from '../Filters/FilterByFields';
import Pagination from '../Pagination';
import { useMemo } from 'react';
import PositionRow from './PositionRow';
import PositionForm from './PositionForm';
import PositionAdd from './PositionAdd';

export default function PositionList() {
  const { showNotification } = useNotification();
    return (
      <PositionProvider initialData={positions} showNotification={showNotification}>
        <PositionListContent />
      </PositionProvider>
    );
}

// Componente interno que usa el contexto
function PositionListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // se deja por ahora mientras se define como gestionaremos estatus
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [addPosition, setAddPosition] = useState(null);
  const itemsPerPage = 10;
  const [show, setShow] = useState(false);
  const { showNotification } = useNotification();
  
  // Fuente única de verdad
  const { positionData, setPositionData } = usePositions();

  // Ejecutar búsqueda automáticamente al teclear o al cambiar el filtro de estado
  useEffect(() => {
    if (searchValue.trim() || filterStatus !== 'all') {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue, filterStatus]);

  const POSITIONS_SEARCH_FIELDS = [
    'code', 
    'positionName'
  ];

  // Filtrar empleados
  const filteredPositions = useMemo(() => {
      return filterData(
          positionData,
          searchValue,
          POSITIONS_SEARCH_FIELDS,
          filterStatus,
          normalizeText
      );
  }, [positionData, searchValue, filterStatus]);

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredPositions : positionData;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPositions = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);


  // Si hay departamento seleccionado, mostrar detalle
  if (selectedPosition) {
    const positionSelected = positionData.find(d => d.id === selectedPosition);
    return <PositionForm 
            mode="view"
            position={positionSelected} 
            onBack={() => setSelectedPosition(null)} 
            onUpdate={(updated) => {
              setPositionData(prev => prev.map(e => e.id === positionSelected.id ? { ...e, ...updated } : e));
              showNotification('Éxito', 'Cargo actualizado correctamente.');
              setSelectedPosition(null);
            }}
            />
  }
  if (addPosition) {
    return (
      <PositionAdd
        position={addPosition}
        onBack={() => setAddPosition(null)}
        onCreated={(newEmp) => {
          // assign an id and prepend to list
          setPositionData(prev => [{ ...newEmp, id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1 }, ...prev]);
          setAddPosition(null);
          showNotification('Éxito', 'Cargo creado correctamente.');
        }}
      />
    );
  }

  return (
      <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
        
        {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )}

        <div className="titles-table flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Listado de Cargos</h2>
          <div className="text-sm">
            <button
              onClick={() => setAddPosition({})}
              className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
            >
              ← Nuevo Registro
            </button>
          </div>
        </div>
        {/* Filtro */}
        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          moduleName='Cargo'
          placeholder='Ingrese código o nombre de departamento'
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
              {paginatedPositions.map((dep) => (
                <PositionRow 
                  key={dep.id}
                  dep={dep} 
                  setSelectedPosition={setSelectedPosition}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
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