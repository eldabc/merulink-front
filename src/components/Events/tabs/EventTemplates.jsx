import { useEffect, useState } from 'react';
import { useEvents } from '../../../context/EventContext';

import { divideDateTime } from '../../../utils/date-utils';

import ButtonDelete from '../../Shared/ButtonDelete';
import ConfirmDialog  from '../../Shared/ConfirmDialog';

function EventTemplates({disabled, dynamicClasses, applyTemplate, selectedCategory, setActiveTab}) {

  const { templates, getTemplatesOnly, loadingTemplates, updateEvent, isTemplate, deleteEventTemplate } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
      getTemplatesOnly(selectedCategory);
  }, [selectedCategory, getTemplatesOnly]);

  const handleDeleteClick = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    // console.log("selectedTemplate", selectedTemplate);
    if (!selectedTemplate) return;

    await deleteEventTemplate(selectedTemplate);
    
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {templates?.length > 0 ? (
        templates.map(temp => (
          <div onClick={() => !disabled && applyTemplate(temp)} key={temp.id} className="bg-[#2f3d44] hover:bg-[#404f57] p-4 rounded-lg flex justify-between items-center border border-gray-600">
            <div>
              <h4 className="text-white font-bold capitalize-string">{temp.name}</h4>
              <p className="text-sm text-gray-400">{temp?.event?.extendedProps?.category?.label}</p>
            </div>
            <button
              disabled={disabled}
              type="button"
              className={`text-white px-3 py-1 rounded shadow-md transition-all ml-auto mr-5 ${dynamicClasses}`}
            >
              Usar Plantilla
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <ButtonDelete setIsModalOpen={() => handleDeleteClick(temp)} disabled={disabled} dinamicClasses={dynamicClasses} />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">{loadingTemplates ? 'Cargando Templates...' : 'No hay plantillas guardadas.'}</p>
      )}
      
      <ConfirmDialog 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Plantilla"
        message={`¿Está seguro de que desea eliminar "${selectedTemplate?.name}"?`}
      />
    </div>
  );
}

export default EventTemplates;