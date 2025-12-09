import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { PasswordInputEye } from '../../togglePasswordVisibility.jsx';
import { useEmployees } from '../../../context/EmployeeContext';

export default function WorkData({ register, errors, employee }) {
  const { toggleEmployeeField } = useEmployees();
  const isForm = typeof register === 'function';
  const isEmployeeActive = employee.status;
  const disabledClasses = isEmployeeActive ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed';

  if (isForm) {
     return (
      <div className="
        grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border border-[#ffffff21]
        md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
        md:[&>*:nth-child(2n)]:pl-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Ingreso: *</label>
          <input type="date" {...register('joinDate')} className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 ${errors.joinDate ? 'border-red-500' : ''}`} />
          {errors.joinDate && <p className="text-red-400 text-xs mt-1">{errors.joinDate.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Departamento: *</label>
          <select {...register('department')} className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.department ? 'border-red-500' : ''}`}>
            <option className='bg-[#3c4042]' value="">Seleccionar...</option>
            <option className='bg-[#3c4042]' value="TI">TI</option>
            <option className='bg-[#3c4042]' value="RRHH">RRHH</option>
            <option className='bg-[#3c4042]' value="Ventas">Ventas</option>
            <option className='bg-[#3c4042]' value="Finanzas">Finanzas</option>
            <option className='bg-[#3c4042]' value="Marketing">Marketing</option>
          </select>
          {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sub-Departamento:</label>
          <input {...register('subDepartment')} className="w-full px-3 py-2 rounded-lg filter-input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cargo: *</label>
          <input {...register('position')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.position ? 'border-red-500' : ''}`} />
          {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}
        </div>

        {/* <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <span className="text-sm">¿Usa MeruLink?</span>
            <input type="checkbox" {...register('useMeruLink')} className="w-4 h-4 rounded" />
          </label>
        </div> */}
        <div className='flex flex-row'>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <span className="text-sm">¿Usa HID Card?</span>
              <input type="checkbox" {...register('useHidCard')} className={`w-4 h-4 rounded ${disabledClasses}`} disabled={!isEmployeeActive} />
            </label>
          </div>

          <div className="flex items-center gap-4 pl-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <span className="text-sm">¿Usa Locker?</span>
            <input type="checkbox" {...register('useLocker')} className={`w-4 h-4 rounded ${disabledClasses}`} disabled={!isEmployeeActive} /> 
            </label>
          </div>
          <div className="flex items-center gap-4 pl-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <span className="text-sm">¿Usa Transporte?</span>
              <input type="checkbox" {...register('useTransport')} className={`w-4 h-4 rounded ${disabledClasses}`} disabled={!isEmployeeActive} />
            </label>
          </div>
        </div>
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
 
  return (
    <div className="
      grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border border-[#ffffff21]
      md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
      md:[&>*:nth-child(2n)]:pl-4
    ">
      <div>
        <label className="font-semibold">Fecha Ingreso: </label>
        {employee.joinDate}
      </div>

      <div>
        <label className="font-semibold">Departamento: </label>
        {employee.department}
      </div>

      <div>
        <label className="font-semibold">Sub-Departamento: </label>
        {employee.subDepartment}
      </div>

      <div>
        <label className="font-semibold">Cargo: </label>
        {employee.position}
      </div>

      <div className="flex items-center gap-4">
        <table className='table-tags-check'>
          <tbody>
          <tr>
            <td><label className="font-semibold">¿Usa Meru Link?</label></td>
            <td>
                <button type="button" className={`tags-work-btn ${disabledClasses}`} onClick={() => toggleEmployeeField(employee.id, "useMeruLink")} disabled={!isEmployeeActive}>
                {employee.useMeruLink ? (
                  <CheckCircleIcon className='w-5 h-5 text-green-400' />
                ) : (
                  <XCircleIcon className='w-5 h-5 text-red-400' />
                )}
              </button>
            </td>
          </tr>
          <tr>
            <td><label className="font-semibold">¿Usa Locker?</label></td>
            <td>
                <button type="button" className={`tags-work-btn ${disabledClasses}`} onClick={() => toggleEmployeeField(employee.id, "useLocker")} disabled={!isEmployeeActive}>
                {employee.useLocker ? (
                  <CheckCircleIcon className='w-5 h-5 text-green-400' />
                ) : (
                  <XCircleIcon className='w-5 h-5 text-red-400' />
                )}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4">
        <table className='table-tags-check'>
          <tbody>
          <tr>
            <td><label className="font-semibold">¿Usa Tarjeta HID?</label></td>
            <td>
                <button type="button" className={`tags-work-btn ${disabledClasses}`} onClick={() => toggleEmployeeField(employee.id, "useHidCard")} disabled={!isEmployeeActive}>
                {employee.useHidCard ? (
                  <CheckCircleIcon className='w-5 h-5 text-green-400' />
                ) : (
                  <XCircleIcon className='w-5 h-5 text-red-400' />
                )}
              </button>
            </td>
          </tr>
          <tr>
            <td><label className="font-semibold">¿Usa Transporte?</label></td>
            <td>
                <button type="button" className={`tags-work-btn ${disabledClasses}`} onClick={() => toggleEmployeeField(employee.id, "useTransport")} disabled={!isEmployeeActive}>
                {employee.useTransport ? (
                  <CheckCircleIcon className='w-5 h-5 text-green-400' />
                ) : (
                  <XCircleIcon className='w-5 h-5 text-red-400' />
                )}
              </button>
            </td>
          </tr>
          </tbody>
        </table>     
      </div>
    </div>
  );
}
