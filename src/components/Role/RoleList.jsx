import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles } from "../../context/RoleContext";

import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import FilterByFields from '../Filters/FilterByFields';

import Pagination from '../Pagination';
import RoleRow from './RoleRow';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate';
import RowTableLoading  from '../Shared/RowTableLoading';
import HasPermission from '../Shared/HasPermission';
import '../../Tables.css';

export default function RoleList() {
  const navigate = useNavigate();
  const { loading, loadRoles, refreshTrigger } = useRoles();
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingData, setLoadingData] = useState(true);


  const itemsPerPage = 10; 

  useEffect(() => {
    const loadRolesData = async () => {
      try {
        const res = await loadRoles();
        // console.log("ress", res)
        setRoles(res.data || []);
      } catch (error) {
        console.error('Error cargando Roles', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadRolesData();
  }, [refreshTrigger]);

  // Ejecutar búsqueda automáticamente al teclear
  useEffect(() => {
    if (searchValue.trim()) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
    setCurrentPage(1);
  }, [searchValue]);

  const ROLES_SEARCH_FIELDS = [
    'code', 
    'name'
  ];

  // Filtrar
  const filteredRoles = useMemo(() => {
      return filterData(
          roles,
          searchValue,
          ROLES_SEARCH_FIELDS,
          "",
          normalizeText
      );
  }, [roles, searchValue]);

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredRoles : roles;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <HasPermission permissions={["view-roles"]} >
      <div className="main-data-cont table-container">      
        <div className="titles-table">
          <TitleHeader title="Listado de Roles y Permisos" />
          <HasPermission permissions={["create-roles"]}>
            <ButtonNavigate url={`/empleados/roles/nuevo`} navigate={navigate} />
          </HasPermission>
        </div>

        <FilterByFields
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          moduleName='Rol'
          placeholder={'Ingrese nombre de rol o permiso'}
        />

        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Rol</th>
                <th className="px-4 py-3 text-left font-semibold">Módulos y Permisos</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <RowTableLoading colSpan={5} />
              ) : (
                paginatedRoles.map((role) => (
                  <RoleRow 
                    key={role.id}
                    role={role} 
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          paginatedData={paginatedRoles}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          dataToDisplay={dataToDisplay}
          hasSearched={hasSearched}
          data={roles}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          moduleName={'Rol'}
        />
      </div>
    </HasPermission>
  );
}