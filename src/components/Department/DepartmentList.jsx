import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartments } from "../../context/DepartmentContext";

import DepartmentRow from './DepartmentRow';
import Pagination from '../Pagination';
import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';
import FilterByFields from '../Filters/FilterByFields';
import ButtonNavigate from '../Shared/ButtonNavigate';
import TitleHeader from '../Shared/TitleHeader';
import RowTableLoading from '../Shared/RowTableLoading';
import HasPermission from '../Shared/HasPermission';

export default function DepartmentList() {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { loading, departmentData, setDepartmentData } = useDepartments();

  const itemsPerPage = 10;
  const DEPARTMENTS_SEARCH_FIELDS = ['code', 'departmentName'];

  // Lógica Unificada: Filtro y detección de búsqueda en un solo paso
  const { dataToDisplay, isSearching } = useMemo(() => {
    // Determinamos si el usuario está buscando algo
    const searching = searchValue.trim() !== '' || filterStatus !== 'all';

    // Si está buscando, filtramos. Si no, usamos la data original.
    const filtered = searching 
      ? filterData(departmentData, searchValue, DEPARTMENTS_SEARCH_FIELDS, filterStatus, normalizeText)
      : departmentData;

    return {
      dataToDisplay: filtered,
      isSearching: searching
    };
  }, [departmentData, searchValue, filterStatus]);

  // Cálcula paginación
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  // Handlers para asegurar que la página vuelva a 1 al filtrar
  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  return (
    <HasPermission permissions={["view-departments"]}>
      <div className="main-data-cont table-container">
        <div className="titles-table">
          <TitleHeader title="Listado de Departamentos" />
          <HasPermission permissions={["create-departments"]}>
            <ButtonNavigate url={`/empleados/departamentos/nuevo`} navigate={navigate}  />
          </HasPermission>
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          filterStatus={filterStatus}
          onFilterStatus={handleFilterStatus}
          moduleName='Departamento'
          placeholder='Ingrese código o nombre de departamento'
        />

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Código</th>
                <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <RowTableLoading />
              ) : (
                paginatedDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-gray-500">
                      No se encontraron departamentos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  paginatedDepartments.map((dep) => (
                    <DepartmentRow 
                      key={dep.id}
                      dep={dep}
                    />
                  ))
                )
              )}
              
            </tbody>
          </table>
        </div>

        <Pagination
          paginatedData={paginatedDepartments}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={isSearching}
          data={departmentData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Departamento'}
        />
      </div>
    </HasPermission> 
  );
}