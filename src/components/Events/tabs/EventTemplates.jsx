import { useEffect, useState } from 'react';
import { useEvents } from '../../../context/EventContext';
import ButtonDelete from '../../Shared/ButtonDelete';
import ConfirmDialog  from '../../Shared/ConfirmDialog';

function EventTemplates({applyTemplate, selectedCategory}) {
  const { templates, getTemplatesOnly, loadingTemplates } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <p className="text-sm text-gray-400">{temp.extendedProps?.label}</p>
            </div>
            <button 
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-md transition-all ml-auto mr-5"
              
            >
              Usar Plantilla
            </button>
            <ButtonDelete setIsModalOpen={setIsModalOpen} />
            <ConfirmDialog 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => handleDeleteEvent(temp.id)}
              title="Eliminar Plantilla"
              message={`¿Estás seguro de que deseas eliminar "${temp.templateName}"?`}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No hay plantillas guardadas.</p>
      )}
    </div>
  );
}

export default EventTemplates;