import dayjs from 'dayjs';
import { Rnd } from 'react-rnd';
import { useState, useEffect, useMemo  } from 'react';
import { useSchedules } from '../../../context/ScheduleContext';

import { truncateText } from '../../../utils/text-utils';

import SpanText from '../../Shared/SpanText';
import DragBar from '../../Shared/DragBar';
import BottomWarning from '../../Shared/BottomWarning';
import HistoryTable from './HistoryTable';

const HistoryViewer = ({ isOpen, onClose, startDate, endDate, scheduleId  }) => {
  
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [data, setData] = useState([]);
  const { loadScheduleHistory } = useSchedules();
  
  // Guarda el tamaño y las coordenadas exactas del visor
  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 300,
    x: 600,
    y: 40
  });
  
  const viewMode = true;

  useEffect(() => {
    const loadHistory = async () => {
      if (!isOpen) return;
      
      // Centrar automáticamente la primera vez que se abre en la pantalla del usuario
      const windowWidth = window.innerWidth;
      const calculatedWidth = windowWidth < 640 ? windowWidth - -100 : 700; // Ajusta ancho inicial
      const calculatedHeight = 450; 

      setDimensions({
        width: calculatedWidth,
        height: calculatedHeight,
        x: (windowWidth / 2) - (calculatedWidth / 2),
        y: 60
      });

      if (!isNaN(scheduleId)) {
        setLoadingHistory(true);
        const historyData = await loadScheduleHistory(scheduleId);
        setData(historyData);
        setLoadingHistory(false);
      }
    };
  
    loadHistory();   
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Rnd
      size={{ width: dimensions.width, height: dimensions.height }}
      position={{ x: dimensions.x, y: dimensions.y }}
      onDragStop={(e, d) => {
        setDimensions(prev => ({ ...prev, x: d.x, y: d.y }));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setDimensions({
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          ...position
        });
      }}
      minWidth={400}
      minHeight={250}
      // bounds="window" 
      
      // Esto le dice a react-rnd que ignore el arrastre si tocan algo con la clase 'no-drag'
      cancel=".no-drag"  
      className="fixed z-50 bg-[#3a3c3e] border border-gray-600 rounded-lg shadow-2xl overflow-hidden text-gray-200 flex flex-col"
      style={{ position: 'fixed', display: 'flex', flexDirection: 'column' }}
    >
      <DragBar onClose={onClose} text="Historial Horarios" />

      {/* Contenido de la Tabla */}
      <div className="flex-1 min-h-0 p-3 overflow-auto text-xs">
        {loadingHistory ? (
          <SpanText text="Cargando Historial..." centerElement={true} />
        ) : (
          
          <div className="w-full flex flex-col gap-4">
            <div className='w-full text-center'>
              <h2 className='text-base font-bold text-gray-100'> 
                {`Historial horario ${dayjs(startDate).format('DD/MM/YYYY')} al ${dayjs(endDate).format('DD/MM/YYYY')} `} 
              </h2>
            </div>

            <HistoryTable data={data} />
          </div> 
        )}
      </div>   

      <BottomWarning />

    </Rnd>
  );
};

export default HistoryViewer;