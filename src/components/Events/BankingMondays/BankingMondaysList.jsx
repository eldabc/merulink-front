import { normalizeDateToString } from "../../../utils/date-utils";
import { XMarkIcon } from '@heroicons/react/24/solid';
import TitleHeader from "../../Shared/TitleHeader";

function BankingMondaysList({items}) {
  return (
    <div className="md:min-w-4xl overflow-x-auto table-container p-4 bg-white-50 rounded-lg">

      {items && items.length === 0 ? (
        <div className="p-4">No existe calendario Bancario para este año.</div>
      ) : (
        
        <div className="rounded-lg shadow">
          <div className="mb-4">
            <TitleHeader title={`Calendario de Lunes Bancarios ${new Date().getFullYear()}`} />
            <p className="text-sm text-gray-400">Este listadro contiene próximas fechas para los lunes bancarios.</p>
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
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedEvent(item.id)}
                  className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-white-800 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-white-800 font-medium ">{normalizeDateToString(item.start)}</td>
                  <td className="px-4 py-3 text-white-700">{item.extendedProps.categoryDisplayName}</td>
                  <td className="px-4 py-3">
                    <button 
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   toggleStatusEvent(event.id);
                      // }}
                      title='Eliminar Evento'
                      type="button" className={`tags-work-btn }`}>
                    <XMarkIcon className='w-5 h-5 text-red-400' />
                    </button>
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