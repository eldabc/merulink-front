
import { useEvents } from '../../context/EventContext';
function ToggleCreateTemplate({readOnly}) {
  console.log("readOnly", readOnly)
  const { isTemplate, setIsTemplate } = useEvents();
  const toggleIsTemplate = () => {
    setIsTemplate(!isTemplate);
  }
  return (
    <div className="flex items-center gap-4 w-full max-w-2xl py-2">
      <span className="text-sm font-medium text-gray-200 whitespace-nowrap">
        Crear Plantilla
      </span>
      
      <div
        onClick={() => !readOnly && toggleIsTemplate()}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          isTemplate ? 'bg-[#9fd8ff]' : 'bg-gray-300'
        } ${readOnly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
            isTemplate ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
      {isTemplate && (
        <input 
          type="text" 
          placeholder="Nombre de la plantilla..."
          className="w-full px-3 py-2 rounded-lg filter-input border"
        />
      )}
    </div>
  );
}

export default ToggleCreateTemplate;