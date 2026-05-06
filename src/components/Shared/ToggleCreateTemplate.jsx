import { useEffect } from 'react';
import { useEvents } from '../../context/EventContext';

import ErrorMessage from './ErrorMessage';

function ToggleCreateTemplate({readOnly, register, errors, setValue}) {
  const { isTemplate, setIsTemplate, templateName, setTemplateName } = useEvents();
  
  // Sincronizar el estado del contexto con el formulario cuando cambia isTemplate
  useEffect(() => {
    if (setValue) {
      setValue('isTemplate', isTemplate, { shouldValidate: true });
    }
  }, [isTemplate, setValue]);

  const toggleIsTemplate = () => {
    setIsTemplate(!isTemplate);
    if (isTemplate)  setTemplateName('');  // Limpiar nombre plantilla al desmarcar
  }

  const handleTemplateNameChange = (e) => {
    setTemplateName(e.target.value);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full max-w-2xl py-2">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-200 whitespace-nowrap">
          Crear Plantilla
        </span>
        
        <button
          type="button"
          onClick={() => !readOnly && toggleIsTemplate()}
          className={`skip-style-btn relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
            isTemplate ? 'bg-[#9fd8ff]' : 'bg-gray-300'
          } ${readOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
              isTemplate ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isTemplate && register && (
        <div className='flex flex-col md:w-2xl'>
          <input 
            readOnly={readOnly}
            type="text" 
            placeholder="Nombre de la plantilla..."
            {...register('templateName')}
            value={templateName}
            onChange={handleTemplateNameChange}
            className={`w-full px-3 py-2 rounded-lg filter-input border`}
          />
          {errors?.templateName && <ErrorMessage msg={errors?.templateName.message} /> }
        </div>
      )}
    </div>
  );
}

export default ToggleCreateTemplate;