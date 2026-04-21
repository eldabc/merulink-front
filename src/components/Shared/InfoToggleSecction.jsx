import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext.jsx';

import InfoCreator from './InfoCreator'
import ToggleCreateTemplate from './ToggleCreateTemplate';

function InfoToggleSeccion({ createdBy, showTemplateToggle, readOnly, register, errors, setValue, templateInfo }) {
  
  const { isTemplate } = useEvents();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-3">
      
      {showTemplateToggle && (
        templateInfo?.hasTemplate ? (   
          <>
          <div className='bg-[#2f3d44] rounded-lg p-2 border border-[#4fa9e5] hover:border-[#9fd8ff]'>
            <Link to={templateInfo.routePath}>
              Ver Plantilla Generada {templateInfo.templateName}
            </Link>
          </div>
          </>
        ) : (

          isTemplate ? (
            <div className='rounded-lg pt-2 pb-2 pl-10 pr-10 border border-[#ffffff21] bg-[#2f3d44] hover:border-[#9fd8ff]'>
              Este evento es una plantilla
            </div>
          ) : (
            <ToggleCreateTemplate readOnly={readOnly} register={register} errors={errors} setValue={setValue} />
          )
        
        )
      )}

      {createdBy && <InfoCreator createdBy={createdBy} /> }
      
    </div>
  );
}

export default InfoToggleSeccion;