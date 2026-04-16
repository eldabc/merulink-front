import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEvents } from "../../context/EventContext";

import { stringCategoryEvents } from '../../utils/Events/events-utils';
import { normalizeText } from '../../utils/text-utils';
import { filterData } from '../../utils/filter-utils';
import { EVENT_CATEGORIES } from '../../utils/eventConfig.js';

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
  const { loading, eventData, loadEvents, initialLoadCategory } = useEvents();
  const [currentPage, setCurrentPage] = useState(1); 
  const [searchValue, setSearchValue] = useState('');
  const [searchDateValue, setSearchDateValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const prevCategoryKeys = useRef();
  const prevShowHistory = useRef();
  const isFirstRender = useRef(true);
  const categoryChanged = prevCategoryKeys.current !== JSON.stringify(categoryKeys);
  const ShowHistoryChanged = prevShowHistory.current !== showHistory;

  const itemsPerPage = 10;
  const SEARCH_FIELDS = ['title', 'start'];
  const stringCategory = stringCategoryEvents(categoryKeys);
  const isMeruBirthday = categoryKeys[0] === EVENT_CATEGORIES.M_BIRTHDAYS.key; //'meru-birthdays'
  const isBankingMondays = categoryKeys[0] === EVENT_CATEGORIES.B_MONDAYS.key ? `/${EVENT_CATEGORIES.B_MONDAYS.path}` : ''; //'banking-mondays' ? '/lunes-bancarios'
  const holidaysEvents = categoryKeys[0] === EVENT_CATEGORIES.VE_HOLIDAYS.key || categoryKeys[0] === EVENT_CATEGORIES.G_CALENDAR.key; // 've-holidays' 'google-calendar'
  const eventWithoutLocation = holidaysEvents || categoryKeys[0] === EVENT_CATEGORIES.M_BIRTHDAYS.key || categoryKeys[0] === EVENT_CATEGORIES.E_MOD.key; //'meru-birthdays' 'executive-mod'
    

  useEffect(() => {
    console.log("CategoryKeys", categoryKeys)
    console.log("InitialLoadCategory", initialLoadCategory)
    // Maneja cambio de categoría o primer render
    const keysString = JSON.stringify(categoryKeys);
    const loaded = JSON.parse(initialLoadCategory);

    const matchLoadedCategory = loaded?.some(cat => categoryKeys?.includes(cat));
    console.log("matchLoadedCategory", matchLoadedCategory)

    if (matchLoadedCategory && !ShowHistoryChanged) { 
      // Si categoría no cambió no se llama backend
      return;
    }
    
    // Si cambió o es primer render
    if (isFirstRender.current || prevCategoryKeys.current !== keysString) {
      console.log("Carga por Categoría o Montaje (111)", categoryKeys);
      
      setSearchValue('');
      setSearchDateValue('');
      setCurrentPage(1);
      setShowHistory(false);
      
      loadEvents(categoryKeys, false);
      
      prevCategoryKeys.current = keysString;
      prevShowHistory.current = false;
      isFirstRender.current = false;

      return;
    }

    // Traer History
    if (prevShowHistory.current !== showHistory) {
      console.log("Carga History (222)", showHistory);
      loadEvents(categoryKeys, showHistory);
      prevShowHistory.current = showHistory;
    }

  }, [JSON.stringify(categoryKeys), showHistory, loadEvents]);


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
                            <>
                              <th className="px-4 py-3 text-left font-semibold">Hora</th>
                              <th className="px-4 py-3 text-left font-semibold">Descripción/Comentarios</th>
                            </>
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