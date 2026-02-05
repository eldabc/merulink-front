import InfoCreator from './InfoCreator'
import ToggleCreateTemplate from './ToggleCreateTemplate'

function InfoToggleSeccion({isTemplate, setIsTemplate, createdBy, showTemplateToggle }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      {showTemplateToggle && <ToggleCreateTemplate isTemplate={isTemplate} setIsTemplate={setIsTemplate} /> }
      {createdBy && <InfoCreator createdBy={createdBy} /> }
      
    </div>
  );
}

export default InfoToggleSeccion;