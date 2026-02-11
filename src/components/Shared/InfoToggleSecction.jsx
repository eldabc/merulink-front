import InfoCreator from './InfoCreator'
import ToggleCreateTemplate from './ToggleCreateTemplate'

function InfoToggleSeccion({ createdBy, showTemplateToggle, readOnly, register, errors, setValue }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      {showTemplateToggle && <ToggleCreateTemplate readOnly={readOnly} register={register} errors={errors} setValue={setValue} /> }
      {createdBy && <InfoCreator createdBy={createdBy} /> }
      
    </div>
  );
}

export default InfoToggleSeccion;