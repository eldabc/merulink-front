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
  const [activeCat, setActiveCat] = useState('C');

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
    
    return lockerAssignData.filter(item => {
      const matchesCategory = item?.locker?.category?.categoryKey === activeCat;
      // console.log("Coincide:", matchesCategory, "Item key:", item?.locker?.category?.categoryKey);
      
      return matchesCategory;
   });
  }, [lockerAssignData, activeCat]);
    
  console.log("filteredLockers", filteredLockers);

  // Datos para mostrar
  const dataToDisplay = filteredLockers;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  // Función para manejar el click y filtrar
  const handleFilterCategory = (category) => {
    setActiveCat(category);
    // Aquí puedes llamar a tu lógica de filtrado existente
    // p.ej: setValue('category', category); si usas React Hook Form
  };

const IconMale = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconFemale = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-8 h-8"
  >
    <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path d="M18 21a6 6 0 0 0-12 0" />
    <path d="M8 7a4 4 0 0 1 8 0" />
  </svg>
);
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
          <div className="flex w-full bg-[#1e2122] rounded-xl p-1 gap-1 mb-6 border border-gray-700">
            
            {/* Botón Caballeros */}
            <div 
              onClick={() => handleFilterCategory('C')}
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-lg cursor-pointer transition-all duration-300
                ${activeCat === 'C' 
                  ? 'bg-[#3c4042] border-b-2 border-blue-300 text-blue-300 shadow-lg' 
                  : 'text-gray-500 hover:bg-[#2a2d2e] hover:text-gray-300'}`}
            >
              <span className="text-3xl mb-1"><IconMale /></span>
              <span className="text-sm font-bold tracking-wider uppercase">Caballeros</span>
            </div>

            {/* Botón Damas */}
            <div 
              onClick={() => handleFilterCategory('D')}
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-lg cursor-pointer transition-all duration-300
                ${activeCat === 'D' 
                  ? 'bg-[#3c4042] border-b-2 border-pink-300 text-pink-300 shadow-lg' 
                  : 'text-gray-500 hover:bg-[#2a2d2e] hover:text-gray-300'}`}
            >
              <span className="text-3xl mb-1"><IconFemale /></span>
              <span className="text-sm font-bold tracking-wider uppercase">Damas</span>
            </div>
          </div>
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Estatus</th>
                <th className="px-4 py-3 text-left font-semibold">Código Locker</th>
                <th className="px-4 py-3 text-left font-semibold">Candado</th>
                <th className="px-4 py-3 text-left font-semibold">Código Asig.</th>
                <th className="px-4 py-3 text-left font-semibold">Fecha Asig.</th>
                <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((lockerAssign) => (
                <LockerAssignRow key={lockerAssign.id} lockerAssign={lockerAssign}/>
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
          data={lockerAssignData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Candado'}
        />
      </div>
  );
}

export default LockerAssignList;