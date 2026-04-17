import { Link } from 'react-router-dom';

import InfoCreator from './InfoCreator'
import ToggleCreateTemplate from './ToggleCreateTemplate';

function InfoToggleSeccion({ createdBy, showTemplateToggle, readOnly, register, errors, setValue, templateInfo }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      {showTemplateToggle && (
        templateInfo?.hasTemplate ? (   
          <>
          <div className='bg-[#2f3d44] rounded-lg p-2 border border-gray-600 hover:border-[#9fd8ff]'>
            <Link to={templateInfo.routePath}>
              Ver Plantilla Generada {templateInfo.templateName}
            </Link>
          </div>
          </>
        ) : (
          <ToggleCreateTemplate readOnly={readOnly} register={register} errors={errors} setValue={setValue} />
        )
      )}

      {createdBy && <InfoCreator createdBy={createdBy} /> }
      
    </div>
  );
}

export default InfoToggleSeccion;