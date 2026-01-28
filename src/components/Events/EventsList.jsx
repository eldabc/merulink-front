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
import FilterByFields from '../Filters/FilterByFields.jsx'
import '../../Tables.css';

export default function EventsList({ categoryKeys }) {
  return <EventListContent categoryKeys={categoryKeys} />;
}

function EventListContent({ categoryKeys }) {
  
  const navigate = useNavigate();
  const { eventData } = useEvents();
  const [currentPage, setCurrentPage] = useState(1); 
  const [searchValue, setSearchValue] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const itemsPerPage = 10;
  const SEARCH_FIELDS = ['title', 'start'];
  const stringCategory = stringCategoryEvents(categoryKeys);
  const isMeruBirthday = categoryKeys[0] === 'meru-birthdays';
  const bankingMondaysCategoryKey = categoryKeys[0] === 'banking-mondays' ? '/lunes-bancarios' : '';
  const eventWithLocation = categoryKeys[0] === 've-holidays' || categoryKeys[0] === 'google-calendar' || categoryKeys[0] === 'meru-birthdays';
   
  // Filtrar para mostrar eventos en la categoría
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
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }, [eventData, categoryKeys]);

  // Filtrado y detección de búsqueda
  const { dataToDisplay, isSearching } = useMemo(() => {
    const searching = searchValue.trim() !== '';
    
    const filtered = searching
      ? filterData(items, searchValue, SEARCH_FIELDS, "", normalizeText)
      : items;

    return {
      dataToDisplay: filtered,
      isSearching: searching
    };
  }, [items, searchValue]);

  const hasBankingRegisters = items[0]?.extendedProps.category === 'banking-mondays' && items?.length > 0;
  const searchTextFragmentAvise = isSearching ? "para la búsqueda" : '';


  // Cálculos de paginación
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  if (selectedEvent) {
    const eventSelected = items.find(e => e.id === selectedEvent);
    return <EventForm mode="view" event={eventSelected} onBack={() => setSelectedEvent(null)} />;
  }

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

      <FilterByFields
        searchValue={searchValue}
        onSearchChange={(val) => { setSearchValue(val); setCurrentPage(1); }}
        moduleName='Evento'
        placeholder='Ingrese nombre del evento'
        showFilterDate={true}
      />

      {items.length === 0  || paginatedEvents.length === 0 ? (
        <div className="p-4 text-gray-500 italic">{`No se encontraron coincidencias esta categoría ${searchTextFragmentAvise}.`}</div>
      ) : (
        <>
          {hasBankingRegisters ? (
            <BankingMondaysList stringCategory={stringCategory} navigate={navigate} events={dataToDisplay} />
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
                  {paginatedEvents.map((item) => (
                    <EventRow 
                      key={item.id} 
                      event={item} 
                      isMeruBirthday={isMeruBirthday} 
                      eventWithLocation={eventWithLocation} 
                      setSelectedEvent={setSelectedEvent}
                    />
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
        hasSearched={isSearching}
        data={items}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        moduleName={'Evento'}
      />
    </div>        
  );
}