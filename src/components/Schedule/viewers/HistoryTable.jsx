import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SpanText from '../../Shared/SpanText';

const HistoryTable = ({ data = [] }) => {

  const [showAll, setShowAll] = useState(false);
  const visibleData = showAll ? data : data.slice(0, 20);

  if (!data || data.length === 0) {
    return <SpanText text="Sin registros en historial." centerElement={true} />;
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-[#ffffff21]">
        <table className="w-full text-xs">
          
          <thead>
            <tr className="bg-[#2f3132] text-cyan-400 uppercase tracking-wider">
              <th className="px-4 py-2.5 text-left font-semibold">Fecha</th>
              <th className="px-4 py-2.5 text-left font-semibold">Usuario</th>
              <th className="px-4 py-2.5 text-left font-semibold">Nombre</th>
              <th className="px-4 py-2.5 text-left font-semibold">Descripción</th>
            </tr>
          </thead>

          
          <tbody>
            {visibleData.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="border-t border-[#ffffff21] bg-[#3a3c3e] hover:bg-[#ffffff21] transition-colors duration-150"
              >
                <td className="px-4 py-2.5 text-gray-200 whitespace-nowrap">
                  {dayjs(item.date).format('DD/MM/YYYY hh:mm A')}
                </td>
                <td className="px-4 py-2.5 text-gray-200">
                  {item.user?.userName ?? '—'}
                </td>
                <td className="px-4 py-2.5 text-gray-200">
                  {item.user?.employeeId ? (
                    <Link
                      target="_blank"
                      to={`/empleados/ver/${item.user.employeeId}`}
                      className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-150"
                    >
                      {item.user?.firstName && item.user?.lastName
                        ? `${item.user.firstName} ${item.user.lastName}`
                        : '—'}
                    </Link>
                  ) : (
                    item.user?.firstName && item.user?.lastName
                      ? `${item.user.firstName} ${item.user.lastName}`
                      : '—'
                  )}
                </td>
                <td className="px-4 py-2.5 text-gray-200">
                  {item.description ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Link Mostrar más / Mostrar menos */}
      {data.length > 10 && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => setShowAll(prev => !prev)}
            className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-colors duration-150 cursor-pointer bg-transparent border-none p-1"
          >
            {showAll
              ? `▲ Mostrar menos (${data.length} registros)`
              : `▼ Mostrar más (${data.length - 10} restantes)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
