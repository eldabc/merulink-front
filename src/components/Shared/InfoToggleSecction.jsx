import InfoCreator from './InfoCreator'
import ToggleCreateTemplate from './ToggleCreateTemplate'

function InfoToggleSeccion({isTemplate, setIsTemplate, creator, showTemplateToggle}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      <InfoCreator creator={creator} />
      {showTemplateToggle && <ToggleCreateTemplate isTemplate={isTemplate} setIsTemplate={setIsTemplate} /> }
      
    </div>
  );
}

export default InfoToggleSeccion;