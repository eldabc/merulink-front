
import { useEvents } from '../../context/EventContext';
function ToggleCreateTemplate() {
  const { isTemplate, setIsTemplate } = useEvents();
  const toggleIsTemplate = () => {
    setIsTemplate(!isTemplate);
  }
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium  mr-2 text-gray-200">Crear Plantilla</span>
      <div
        onClick={() => toggleIsTemplate() }
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          isTemplate ? 'bg-[#9fd8ff]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
            isTemplate ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  );
}

export default ToggleCreateTemplate;