import { useNavigate } from 'react-router-dom';

import { normalizeDateToString } from "../../../utils/date-utils";

import TitleHeader from "../../Shared/TitleHeader";
import RowTableLoading from '../../Shared/RowTableLoading.jsx';

function BankingMondaysList({ events, allBankingEvents, loading }) {

  const navigate = useNavigate();

  const selectedEvent = () => {
    navigate("/eventos/lunes-bancarios/ver"); 
  };

  return (
    <div className="main-data-cont table-container">

      {events && events.length === 0 ? (
        <div className="p-4">No existe calendario Bancario para este año.</div>
      ) : (
        
        <div className="rounded-lg shadow">
          <div className="mb-4">
            <TitleHeader title={`Calendario de Lunes Bancarios ${new Date().getFullYear()}`} />
            <p className="text-sm text-gray-400">Este listado contiene las próximas fechas para los lunes bancarios.</p>
          </div>
          <table className="min-w-full border-collapse text-sm sm:text-base">
              <thead>
              <tr className="tr-thead-table">
                <th className="px-4 py-3 text-left font-semibold">Título</th>
                <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold">Tipo Evento</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <RowTableLoading colSpan={6} />
              ) : (
                events.map((item) => {
                  const eventIsToday = item?.start.split('T')[0] === new Date().toISOString().split('T')[0];
                  return (
                    <tr
                      key={item.id}
                      title={eventIsToday ? "¡Este evento es Hoy!" : ''}
                      onClick={() => selectedEvent()}
                      className={`border-b tr-table hover:bg-blue-50 transition-colors duration-150 ${eventIsToday && '!border !border-red-500 hover:!border-3 '}`}
                    >
                      <td className="px-4 py-3 text-white-800 font-medium">{item.title}</td>
                      <td className="px-4 py-3 text-white-800 font-medium ">{normalizeDateToString(item.start)}</td>
                      <td className="px-4 py-3 text-white-700">{item.extendedProps.category.label}</td>
                    </tr>
                  );
                })
             )}
            </tbody>
          </table>
        </div>
        
      )}
    </div> 
  );
}

export default BankingMondaysList;