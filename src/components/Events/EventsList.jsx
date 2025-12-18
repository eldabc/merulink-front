import React, { useMemo } from 'react';
import { INITIAL_EVENTS } from '../../utils/StaticData/event-utils';

export default function EventsList({ categoryKey }) {
  // categoryKey can be 'meru-events', 'wedding-nights' or 'otros'
  const items = useMemo(() => {
    if (categoryKey === 'otros') {
      // everything not meru-events nor wedding-nights
      return INITIAL_EVENTS.filter(ev => {
        const cat = ev.extendedProps?.category;
        return cat && cat !== 'meru-events' && cat !== 'wedding-nights';
      });
    }
    return INITIAL_EVENTS.filter(ev => ev.extendedProps?.category === categoryKey);
  }, [categoryKey]);

  if (!items || items.length === 0) {
    return <div className="p-4">No hay eventos en esta categoría.</div>;
  }

  return (
     <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
            
            {/* {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )} */}
    
            <div className="titles-table flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Listado de </h2>
              <div className="text-sm">
                <button
                  onClick={() => setAddDepartment({})}
                  className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
                >
                  ← Nuevo Registro
                </button>
              </div>
            </div>
            {/* Filtro */}
            {/* <FilterByFields
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filterStatus={filterStatus}
              onFilterStatus={setFilterStatus}
              moduleName='Departamento'
              placeholder='Ingrese código o nombre de departamento'
            /> */}
    
            <div className="rounded-lg shadow">
              <table className="min-w-full border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="tr-thead-table">
                    <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-left font-semibold">Hora</th>
                    <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
                    <th className="px-4 py-3 text-left font-semibold">Tipo Evento</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {paginatedDepartments.map((dep) => (
                    <DepartmentRow 
                      key={dep.id}
                      dep={dep} 
                      setSelectedDepartment={setSelectedDepartment}
                    />
                  ))} */}
                </tbody>
              </table>
            </div>
    
            {/* Paginación */}
            {/* <Pagination
              paginatedData={paginatedDepartments}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              dataToDisplay={dataToDisplay}
              hasSearched={hasSearched}
              data={departmentData}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
              moduleName={'Departamento'}
            /> */}
  </div>
  );
}
