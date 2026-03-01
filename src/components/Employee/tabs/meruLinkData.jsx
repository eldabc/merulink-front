import { useEmployees } from '../../../context/EmployeeContext';
import { PasswordInputEye } from '../../togglePasswordVisibility.jsx';
import LabelFieldForm from "../../Shared/LabelFieldForm";
 
export default function MeruLinkData({ viewMode, register, errors, employee }) {
  const { toggleEmployeeField } = useEmployees();
  const isForm = typeof register === 'function';
  const cursorNotAllowed = viewMode && 'cursor-not-allowed opacity-50';

  if (isForm) {
    return (
        <div className="
          grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border border-[#ffffff21]
          md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
          md:[&>*:nth-child(2n)]:pl-4">

          <h2>Meru Link permisos {employee?.firstName} {employee?.lastName}</h2>
          <div>
            <div className='flex flex-row'>
              <LabelFieldForm field="Nombre Usuario" simbol="*" />
              <div>
                  <input 
                    readOnly={viewMode}
                    {...register('userName')} className={`w-2xs px-3 py-1 rounded-lg filter-input ml-5 ${cursorNotAllowed}`} />
                {errors.userName && <p className="text-red-400 text-xs mt-1 ml-5 ">{errors.userName.message}</p>}
              </div>
            </div>
            <div className='flex flex-row'>
              <LabelFieldForm field="Contraseña" simbol="*" />
              <div><PasswordInputEye register={register} errors={errors} viewMode={viewMode} /></div>
            </div>
            <div className='flex flex-row mt-1.5'>
              <input disabled={viewMode} type="checkbox" {...register('changePassNextLogin')} className={`w-4 align-text-bottom rounded-lg ${cursorNotAllowed}`} />
              <label className="block text-sm font-medium text-gray-300 ml-2"> Cambia la contraseña al próximo inicio.</label>
            </div>
          </div>
        </div>
    );
  }

  return ("Por Eliimnar");
  {/*
    
    <div className="
      grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border border-[#ffffff21]
      md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
      md:[&>*:nth-child(2n)]:pl-4">

      <h2>Meru Link permisos {employee.firstName} {employee.lastName}</h2>
      <div>
        <div className='flex flex-row'>
          <label className="block text-sm font-medium text-gray-300 mb-1 min-w-35 max-w-35">Nombre Usuario: *</label>
          <div>{employee.userName}</div>
        </div>
        <div className='flex flex-row'>
          <label className="block text-sm font-medium text-gray-300 mb-1 min-w-35 max-w-35">Contraseña: *</label>
          <label className="block text-sm font-medium text-red-300 mt-1"> La ingresada.</label>
        </div>
        <div className='flex flex-row mt-1.5'>
        </div>
      </div>
    </div>
      
  */}
};