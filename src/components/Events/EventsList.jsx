import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from "../../context/EventContext";

import { stringCategoryEvents } from '../../utils/Events/events-utils';
import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';

import EventRow from './EventRow';
import Pagination from '../Pagination';
import TitleHeader from '../Shared/TitleHeader';
import ButtonNavigate from '../Shared/ButtonNavigate.jsx';
import BankingMondaysList from './BankingMondays/BankingMondaysList.jsx';
import FilterByFields from '../Filters/FilterByFields.jsx';
import ButtonHistory from '../Shared/ButtonHistory.jsx';
import SpanText from '../Shared/SpanText.jsx';
import RowTableLoading from '../Shared/RowTableLoading.jsx';

import '../../Tables.css';

export default function EventsList({ categoryKeys }) {
  
  const navigate = useNavigate();
  const { loading, eventData, loadEvents } = useEvents();
  const [currentPage, setCurrentPage] = useState(1); 
  const [searchValue, setSearchValue] = useState('');
  const [searchDateValue, setSearchDateValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const itemsPerPage = 10;
  const SEARCH_FIELDS = ['title', 'start'];
  const stringCategory = stringCategoryEvents(categoryKeys);
  const isMeruBirthday = categoryKeys[0] === 'meru-birthdays';
  const isBankingMondays = categoryKeys[0] === 'banking-mondays' ? '/lunes-bancarios' : '';
  const holidaysEvents = categoryKeys[0] === 've-holidays' || categoryKeys[0] === 'google-calendar'
  const eventWithoutLocation = holidaysEvents || categoryKeys[0] === 'meru-birthdays' || categoryKeys[0] === 'executive-mod';
  
  useEffect(() => {
    console.log("Cargando eventos para categorías:", categoryKeys);
    setSearchValue('');
    setSearchDateValue('');
    setCurrentPage(1);
    setShowHistory(false);
    
    loadEvents(categoryKeys); // lograr que filtre si se pide y también mande todo por encima de la fecha actual y todo por debajo de la fecha actual según el caso.
  }, [categoryKeys]);

  // Filtrar eventos por categoría
  // const { items, allBankingEvents } = useMemo(() => {
  //   if (!categoryKeys || categoryKeys.length === 0) return { items: [], allBankingEvents: [] };

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const result = eventData.reduce((acc, ev) => {

  //     const categoryKey = ev.extendedProps?.category.key;
  //     const matchesCategoryKey = categoryKeys.includes(categoryKey);

  //     if (matchesCategoryKey) {
        
  //       // Extraer TODOS los banking-mondays (sin filtro de fecha)
  //       if (categoryKey === 'banking-mondays') {
  //         acc.allBankingEvents.push({ ...ev });
  //       }

  //       // Extraer TODOS los google-calendar (sin filtro de fecha)
  //       const isGoogle = categoryKey === 'google-calendar' || categoryKey === 've-holidays';
  //       const isFutureOrToday = new Date(ev.start) >= today;

  //       if (showHistory || isGoogle || isFutureOrToday) {
  //         acc.items.push({ ...ev });
  //       }
  //     }

  //     return acc;
  //   }, { items: [], allBankingEvents: [] });

  //   // Ordenar
  //   result.items.sort((a, b) => new Date(a.start) - new Date(b.start));
  //   result.allBankingEvents;

  //   return result;
  // }, [eventData, categoryKeys, showHistory]);


  // Filtrado y detección de búsqueda
  const { dataToDisplay, isSearching } = useMemo(() => {
    const hasSearchText = searchValue.trim() !== '';
    const hasSearchDate = searchDateValue && searchDateValue !== '';
    const searching = hasSearchText || hasSearchDate;

    let filtered = eventData; //items

    // Filtrar por texto
    if (hasSearchText) {
      filtered = filterData(filtered, searchValue, SEARCH_FIELDS, "", normalizeText);
    }

    // Filtrar por fecha (comparamos YYYY-MM-DD)
    if (hasSearchDate) {
      filtered = filtered.filter(ev => {
        const eventDate = ev.start.substring(0, 10);
        return eventDate === searchDateValue;
      });
    }

    return {
      dataToDisplay: filtered,
      isSearching: searching
    };
  }, [eventData, searchValue, searchDateValue]); //items
  

  const searchTextFragmentAvise = isSearching && ` para la búsqueda ${searchValue}`;
  
  const hasBankingRegisters = isBankingMondays && eventData.some( 
    ev => ev.extendedProps?.category.key === 'banking-mondays'
  ) ? true : false;

  // Cálculos de paginación
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = dataToDisplay.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="main-data-cont table-container">
      <div className="titles-table">
        <TitleHeader title={stringCategory} />
        <div className="text-sm">
          {!isMeruBirthday && (
            <ButtonNavigate url={`/eventos${isBankingMondays}/nuevo`} navigate={navigate} flagDisabled={hasBankingRegisters} />
          )}
        </div>
      </div>

      <FilterByFields
        searchValue={searchValue}
        searchDateValue={searchDateValue}
        onSearchChange={(val) => { setSearchValue(val); setCurrentPage(1); }}
        onFilterDate={(val) => { setSearchDateValue(val); setCurrentPage(1); }}
        moduleName='Evento'
        placeholder='Ingrese nombre del evento'
        showFilterDate={true}
      />
      
      {!holidaysEvents && <ButtonHistory showHistory={showHistory} setShowHistory={setShowHistory} /> }

      {(dataToDisplay.length === 0 || paginatedEvents.length === 0) && !loading ? (
        <SpanText text={`No se encontraron coincidencias en esta categoría${searchTextFragmentAvise}.`} />
      ) : (
        <>
          {hasBankingRegisters ? (

            // Listado Eventos Bancarios
            <BankingMondaysList 
              stringCategory={stringCategory} 
              navigate={navigate} 
              events={paginatedEvents} 
              allBankingEvents={eventData} //allBankingEvents
            />
          ) : (

            // Los demás Eventos
            <div className="rounded-lg shadow">
              <table className="min-w-full border-collapse text-sm sm:text-base">
                {!loading ? (
                  <>
                    <thead>
                        <tr className="tr-thead-table">
                          <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                          <th className="px-4 py-3 text-left font-semibold">Fecha</th>

                          {isMeruBirthday ? (
                            <>
                              <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                              <th className="px-4 py-3 text-left font-semibold">Cumplirá</th>
                            </>
                          ) : (
                            <th className="px-4 py-3 text-left font-semibold">Descripción/Comentarios</th>
                          )}

                          {!eventWithoutLocation && (
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
                              eventWithoutLocation={eventWithoutLocation} 
                            />
                          ))}
                      
                      </tbody>
                    </>
                  ) : (
                    <tbody>
                      <RowTableLoading colSpan={6} />
                    </tbody>
                  )}
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
        data={eventData}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        moduleName={'Evento'}
      />
    </div>        
  );
}