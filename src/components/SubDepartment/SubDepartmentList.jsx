import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useNotification } from "../../context/NotificationContext";  
import { useSubDepartments } from "../../context/SubDepartmentContext";
import SubDepartmentRow from './SubDepartmentRow';
import Pagination from '../Pagination';
import { filterData } from '../../utils/filter-utils';
import { normalizeText } from '../../utils/text-utils';
import FilterByFields from '../Filters/FilterByFields';
import RowTableLoading from '../Shared/RowTableLoading';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';

export default function SubDepartmentList() {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  // const [filterStatus, setFilterStatus] = useState('all'); // se deja por ahora mientras se define como gestionaremos estatus para departamentos
  const [hasSearched, setHasSearched] = useState(false);

  // const [addSubDepartment, setAddSubDepartment] = useState(null);
  // const [show, setShow] = useState(false);
  // const { showNotification } = useNotification();
  const { loading, subDepartmentData, setSubDepartmentData } = useSubDepartments();

  const itemsPerPage = 10;

  // Ejecutar búsqueda automáticamente al teclear o al cambiar el filtro de estado
  useEffect(() => {
    if (searchValue.trim()) { //|| filterStatus !== 'all'
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue]); // , filterStatus

  const SUB_DEPARTMENTS_SEARCH_FIELDS = [
    'code', 
    'name',
    'departmentName'
  ];

  // Filtrar empleados
  const filteredSubDepartments = useMemo(() => {
      return filterData(
          subDepartmentData,
          searchValue,
          SUB_DEPARTMENTS_SEARCH_FIELDS,
          // filterStatus,
          normalizeText
      );
  }, [subDepartmentData, searchValue]); // , filterStatus

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredSubDepartments : subDepartmentData;
  
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubDepartments = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
      <div className="main-data-cont table-container">
        <div className="titles-table">
          <TitleHeader title="Listado de Sub-Departamentos" />
          <ButtonNavigate url={`/empleados/sub-departamentos/nuevo`} navigate={navigate}  />
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          // filterStatus={filterStatus}
          onFilterStatus={setFilterStatus}
          moduleName='Sub-Departamento'
          placeholder='Ingrese código o nombre de Sub-departamento'
        />

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Código</th>
                <th className="px-4 py-3 text-left font-semibold">Sub-Departamento</th>
                <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <RowTableLoading />
              ) : (
                <>
                {paginatedSubDepartments.map((subDep) => (
                  <SubDepartmentRow 
                    key={subDep.id}
                    subDep={subDep} 
                  />
                ))}
                </>
              )} 
            </tbody>
          </table>
        </div>

        <Pagination
          paginatedData={paginatedSubDepartments }
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={hasSearched}
          data={subDepartmentData }
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Subdepartamento'}
        />
      </div>
  );
}