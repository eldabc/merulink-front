import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import dayjs from 'dayjs';

const PreviousFortnightViewer = ({ isOpen, onClose, subDepartmentId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Solo busca la quincena pasada si el visor está abierto
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      
      // axios.get(`/api/schedules/fortnight-preview/${subDepartmentId}`)
      //   .then(res => setHistoryData(res.data))
      //   .finally(() => setLoading(false));
    }
  }, [isOpen, subDepartmentId]);

  if (!isOpen) return null;

  return (
    <Rnd
      default={{
        x: 100,
        y: 150,
        width: 500,
        height: 350,
      }}
      minWidth={300}
      minHeight={200}
      bounds="window" // Evita que el usuario arrastre la ventana fuera de la pantalla
      dragHandleClassName="drag-handle" // Solo se puede arrastrar desde la barra superior
      className="fixed z-50 bg-[#3a3c3e] border border-gray-600 rounded-lg shadow-2xl flex flex-col overflow-hidden text-gray-200"
    >
      {/* CABECERA (Barra de Arrastre) */}
      <div className="drag-handle bg-[#2f3132] px-4 py-2 flex items-center justify-between cursor-move select-none border-b border-gray-600">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <span>📋 Visor: Quincena Anterior</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-red-400 text-sm font-bold p-1 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* CUERPO (Contenido de la Tabla Miniatura) */}
      <div className="flex-1 p-3 overflow-auto text-xs">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Cargando histórico...</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 bg-[#2b2d2f]">
                  <th className="p-2 sticky left-0 bg-[#2b2d2f] z-10 w-32">Empleado</th>
                  {/* Renderizar dinámicamente cabeceras de días cortos (ej. L 01, M 02) */}
                  <th className="p-2 text-center">01</th>
                  <th className="p-2 text-center">02</th>
                  <th className="p-2 text-center">03</th>
                  <th className="p-2 text-center">04</th>
                  <th className="p-2 text-center">05</th>
                </tr>
              </thead>
              <tbody>
                {/* Ejemplo de mapeo de filas compactas */}
                <tr className="border-b border-gray-800 hover:bg-[#434547]/50">
                  <td className="p-2 font-semibold sticky left-0 bg-[#3a3c3e] z-10 whitespace-nowrap border-r border-gray-700">
                    Juan Pérez
                  </td>
                  {/* Micro-celdas pintadas con el color del turno */}
                  <td className="p-2 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00A4BC] text-white">M</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00A4BC] text-white">M</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">T</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-600 text-gray-400">L</span>
                  </td>
                  <td className="p-2 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00A4BC] text-white">M</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. ADVERTENCIA INFERIOR */}
      <div className="bg-[#2f3132] px-3 py-1 text-[10px] text-gray-400 border-t border-gray-700 text-right select-none">
        Solo lectura • Estira los bordes para redimensionar
      </div>
    </Rnd>
  );
};

export default PreviousFortnightViewer;