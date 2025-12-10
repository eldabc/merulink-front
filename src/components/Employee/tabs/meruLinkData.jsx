import { useEmployees } from '../../../context/EmployeeContext';
import { PasswordInputEye } from '../../togglePasswordVisibility.jsx';
 
export default function MeruLinkData({ register, errors, employee }) {
  const { toggleEmployeeField } = useEmployees();
  const isForm = typeof register === 'function';

  if (isForm) {
    return (
        <div className="
          grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border border-[#ffffff21]
          md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
          md:[&>*:nth-child(2n)]:pl-4">

          <h2>Meru Link permisos para {employee.firstName} {employee.lastName}</h2>
          <div>
            <div className='flex flex-row'>
              <label className="block text-sm font-medium text-gray-300 mb-1 min-w-35 max-w-35">Nombre Usuario: *</label>
              <div><input {...register('userName')} className={`w-2xs px-3 py-1 rounded-lg filter-input ml-5 ${errors.userName ? 'border-red-500' : ''}`} />
              {errors.userName && <p className="text-red-400 text-xs mt-1 ml-5 ">{errors.userName.message}</p>}</div>
            </div>
            <div className='flex flex-row'>
              <label className="block text-sm font-medium text-gray-300 mb-1 min-w-35 max-w-35">Contraseña: *</label>
              <div><PasswordInputEye register={register} errors={errors} /></div>
            </div>
            <div className='flex flex-row mt-1.5'>
              <input type="checkbox" {...register('changePassNextLogin')} className="w-4 align-text-bottom rounded-lg" />
              <label className="block text-sm font-medium text-gray-300 ml-2"> Cambia la contraseña al próximo inicio.</label>
            </div>
          </div>
        </div>
    );
  }
};