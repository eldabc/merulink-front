import { useEffect, useState } from 'react';
import { useEvents } from '../../../context/EventContext';
import ButtonDelete from '../../Shared/ButtonDelete';
import ConfirmDialog  from '../../Shared/ConfirmDialog';
import { divideDateTime } from '../../../utils/date-utils';

function EventTemplates({applyTemplate, selectedCategory, setActiveTab}) {
  const { templates, getTemplatesOnly, loadingTemplates, updateEvent, isTemplate } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
      getTemplatesOnly(selectedCategory);
  }, [selectedCategory]);

  const handleDeleteClick = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTemplate) return;
    
    const messagge = "Plantilla eliminada";
    const { extendedProps, ...restOfData } = selectedTemplate;
    const divideDateTimeStart = divideDateTime(restOfData?.start);
    const divideDateTimeEnd = divideDateTime(restOfData?.end);
    
    // Fusionamos todo en un nuevo objeto plano
    const flattenedData = {
      ...restOfData,
      eventName: restOfData.title,
      startDate: divideDateTimeStart.date, 
      startTime: divideDateTimeStart.time, 
      endDate: divideDateTimeEnd.date, 
      endTime: divideDateTimeEnd.time, 
      ...extendedProps,
      createdBy: extendedProps.createdBy,
      isTemplate: false,
      templateName: ''
    };

    console.log("flattenedData", flattenedData);
    await updateEvent(flattenedData, messagge);
    getTemplatesOnly(selectedCategory);
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {templates?.length > 0 ? (
        templates.map(temp => (
          <div onClick={() => applyTemplate(temp)} key={temp.id} className="bg-[#2f3d44] hover:bg-[#404f57] p-4 rounded-lg flex justify-between items-center border border-gray-600">
            <div>
              <h4 className="text-white font-bold">{temp.extendedProps?.templateName}</h4>
              <p className="text-sm text-gray-400">{temp.extendedProps?.label}</p>
            </div>
            <button 
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-md transition-all ml-auto mr-5"
            >
              Usar Plantilla
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <ButtonDelete setIsModalOpen={() => handleDeleteClick(temp)} />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No hay plantillas guardadas.</p>
      )}
      
      <ConfirmDialog 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Plantilla"
        message={`¿Estás seguro de que deseas eliminar "${selectedTemplate?.extendedProps?.templateName}"?`}
      />
    </div>
  );
}

export default EventTemplates;