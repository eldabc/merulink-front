import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function WorkData({ employee }) {
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
              <button className='tags-work-btn'>
                {employee.useMeruLink ? (
                  <CheckCircleIcon className='w-5 h-5 text-green-400' />
                ) : (
                  <XCircleIcon className='w-5 h-5 text-red-400' />
                )}
              </button>
            </td>
          </tr>
          <tr>
            <td> <label className="font-semibold">¿Usa Locker?</label></td>
            <td>
              <button className='tags-work-btn'>
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
              <button className='tags-work-btn'>
                {employee.hidCard ? (
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
              <button className='tags-work-btn'>
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
