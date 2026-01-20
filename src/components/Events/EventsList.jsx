import React, { useMemo } from 'react';
import { useEvents } from "../../context/EventContext";
import EventRow from './EventRow';
import { stringCategoryEvents } from '../../utils/Events/events-utils';
import { useNavigate } from 'react-router-dom';
import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import { useState } from 'react';
import Pagination from '../Pagination';
import '../../Tables.css';

export default function EventsList({ categoryKeys }) {

  return <EventListContent categoryKeys={categoryKeys} />;
}

  // Componente interno que usa el contexto
 function EventListContent({ categoryKeys }) {
  const stringCategory = stringCategoryEvents(categoryKeys);
  const { eventData } = useEvents();
  const navigate = useNavigate();
  const eventWithLocation = categoryKeys[0] === 've-holidays' || categoryKeys[0] === 'google-calendar' || categoryKeys[0] === 'meru-birthdays';
  const isMeruBirthday = categoryKeys[0] === 'meru-birthdays';
  
  // Variables para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1); 
  const [hasSearched, setHasSearched] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const itemsPerPage = 10;
  
 
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

  const SEARCH_FIELDS = [
    'title'
  ];

  // Filtrar
  const filteredEvents = useMemo(() => {
      return filterData(
          items,
          searchValue,
          SEARCH_FIELDS,
          "",
          normalizeText
      );
  }, [items, searchValue]);

  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredEvents : items;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">

      <div className="titles-table flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{stringCategory} </h2>
        <div className="text-sm">
          {!isMeruBirthday && (
            <button
              onClick={() => navigate('/eventos/nuevo')}
              className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
            >
              ← Nuevo Registro
            </button>
          )}
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
              {isMeruBirthday ? (
                <th className="px-4 py-3 text-left font-semibold">Departamento</th>
              ) : (
                <th className="px-4 py-3 text-left font-semibold">Descripción</th>
              )}
              {!eventWithLocation && (
                <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
              )}
              <th className="px-4 py-3 text-left font-semibold">Tipo Evento</th>
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <EventRow key={item.id} event={item} isMeruBirthday={isMeruBirthday} eventWithLocation={eventWithLocation} />
            ))}
          </tbody>
        </table>
      </div>
      
    )}
    <Pagination
        paginatedData={paginatedEvents}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        dataToDisplay={dataToDisplay}
        hasSearched={hasSearched}
        data={items}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        moduleName={'Evento'}
      />
    </div>
            
  );
}
