import React, { useMemo } from 'react';
import { INITIAL_EVENTS } from '../../utils/StaticData/event-utils';
import { useNotification } from "../../context/NotificationContext";  
import { EventProvider, useEvents } from "../../context/EventContext";
import EventRow from './EventRow';
import { stringCategoryEvents } from '../../utils/Events/events-utils';

export default function EventsList({ categoryKeys }) {

  const { showNotification } = useNotification();
    return (
      <EventProvider initialData={INITIAL_EVENTS} showNotification={showNotification}>
        <EventListContent categoryKeys={categoryKeys} />
      </EventProvider>
    );   
}

  // Componente interno que usa el contexto
 function EventListContent({ categoryKeys }) {
  const stringCategory = stringCategoryEvents(categoryKeys);
  const { eventData } = useEvents();

  const items = useMemo(() => {
    if (!categoryKeys || categoryKeys.length === 0) return [];

    return eventData
    .filter(ev => categoryKeys.includes(ev.extendedProps?.category))
    .map(ev => {
      
      const categoryId = ev.extendedProps?.category;
      return {
        ...ev,
        extendedProps: {
          ...ev.extendedProps,
          categoryDisplayName: stringCategoryEvents([categoryId])
        }
      };
    });
  }, [eventData, categoryKeys]);

  return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">
            
      {/* {show && ( <Notification title={show.title} message={show.message} onClose={() => setShow(null)} /> )} */}

      <div className="titles-table flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Listado de {stringCategory} </h2>
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
      {items && items.length === 0 ? (
        <div className="p-4">No hay eventos en esta categoría.</div>
      ) : (
        <div className="rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
              <thead>
            <tr className="tr-thead-table">
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Fecha</th>
              <th className="px-4 py-3 text-left font-semibold">Hora</th>
              <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
              <th className="px-4 py-3 text-left font-semibold">Tipo Evento</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <EventRow key={item.id} event={item} stringCategory={stringCategory} />
            ))}
          </tbody>
        </table>
      </div>
      
    )}
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
