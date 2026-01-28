import React, { useMemo, useState } from 'react';
import { useEvents } from "../../context/EventContext";
import { useNavigate } from 'react-router-dom';
import { stringCategoryEvents } from '../../utils/Events/events-utils';
import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import Pagination from '../Pagination';
import EventForm from './EventForm';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate.jsx';
import EventRow from './EventRow';
import BankingMondaysList from './BankingMondays/BankingMondaysList.jsx';
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const bankingMondaysCategoryKey = categoryKeys[0] === 'banking-mondays' ? '/lunes-bancarios' : '';
  
  // Variables para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1); 
  const [hasSearched, setHasSearched] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const itemsPerPage = 10;
  const SEARCH_FIELDS = ['title'];
 
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
    })
    .sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      
      // Orden ascendente
      return dateA - dateB;
    });
}, [eventData, categoryKeys]);

  const hasBankingRegisters = items[0]?.extendedProps.category === 'banking-mondays' && items?.length > 0;

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

  if (selectedEvent) {
    const eventSelected = items.find(e => e.id === selectedEvent);
    return <EventForm mode="view" event={eventSelected} onBack={() => setSelectedEvent(null)} />;
  }
  // Datos para mostrar
  const dataToDisplay = hasSearched ? filteredEvents : items;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">

      <div className="titles-table flex justify-between items-center mb-4">
        <TitleHeader title={stringCategory} />

        <div className="text-sm">
          {!isMeruBirthday && (
            <ButtonNavigate url={`/eventos${bankingMondaysCategoryKey}/nuevo`} navigate={navigate} flagDisabled={hasBankingRegisters} />
          )}
        </div>
      </div>

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
        <>
        {hasBankingRegisters ? (
          <BankingMondaysList stringCategory={stringCategory} navigate={navigate} events={items} />
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
                  <th className="px-4 py-3 text-left font-semibold">Descripción/Comentarios</th>
                )}
                {!eventWithLocation && (
                  <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
                )}
                <th className="px-4 py-3 text-left font-semibold">Tipo Evento</th>
                {!isMeruBirthday && <th className="px-4 py-3 text-left font-semibold">Acciones</th> }
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <EventRow key={item.id} event={item} isMeruBirthday={isMeruBirthday} eventWithLocation={eventWithLocation} setSelectedEvent={setSelectedEvent}/>
              ))}
            </tbody>
          </table>
        </div>
        
      )}
      </>
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
