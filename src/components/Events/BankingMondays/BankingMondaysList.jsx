import { useEvents } from "../../../context/EventContext";
import { normalizeDateToString } from "../../../utils/date-utils";
import TitleHeader from "../../Shared/TitleHeader";
import { useNavigate } from 'react-router-dom';
import ButtonDelete from "../../Shared/ButtonDelete";

function BankingMondaysList({events}) {

  const navigate = useNavigate();
  const { deleteEvents } = useEvents();

  const setSelectedEvent = () => {
    navigate("/eventos/lunes-bancarios/ver", { 
      state: { data: events } 
    }); 
  };

  const handleDeleteEvent = (id) => {
    console.log("ELiminiar evento",id); 
    
  }

  return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">

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
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedEvent()}
                  className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-white-800 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-white-800 font-medium ">{normalizeDateToString(item.start)}</td>
                  <td className="px-4 py-3 text-white-700">{item.extendedProps.categoryDisplayName}</td>
                  <td className="px-4 py-3">
                    <ButtonDelete handleDeleteEvent={handleDeleteEvent} id={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}
    </div> 
  );
}

export default BankingMondaysList;