import { useEffect } from 'react';
import { useEvents } from '../../../context/EventContext';

function EventTemplates({applyTemplate, selectedCategory}) {
  const { templates, getTemplatesOnly, loadingTemplates } = useEvents();

  useEffect(() => {
      getTemplatesOnly(selectedCategory);
  }, [selectedCategory]);

  if (loadingTemplates) return <div className="p-4 text-center">Buscando plantillas...</div>;

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {templates?.length > 0 ? (
        templates.map(temp => (
          <div onClick={() => applyTemplate(temp)} key={temp.id} className="bg-[#2f3d44] hover:bg-[#404f57] p-4 rounded-lg flex justify-between items-center border border-gray-600">
            <div>
              <h4 className="text-white font-bold">{temp.title}</h4>
              <p className="text-sm text-gray-400">{temp.extendedProps?.category}</p>
            </div>
            <button 
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-md transition-all"
              
            >
              Usar Plantilla
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No hay plantillas guardadas.</p>
      )}
    </div>
  );
}

export default EventTemplates;