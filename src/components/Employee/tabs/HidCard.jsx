import { useFormContext } from 'react-hook-form';
import { useEmployees } from '../../../context/EmployeeContext';

import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from '../../Shared/ErrorMessage.jsx';

function HidCard({ createMode, viewMode, isEmployeeActive, disabledClasses, employee }) {
    
    const { register } = useFormContext();
    const { loadingFieldChange, toggleEmployeeField } = useEmployees();
    const useHidCardWatch = false; //watch('useHidCard');

  return (
    <>
        <div className="flex items-center gap-4 mb-4 pl-4">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <span className="text-sm">¿Usa HID Card?</span>
              {loadingFieldChange.loading && loadingFieldChange.field === 'use_hid_card' ? (
                <span className="text-xs text-gray-500 italic">Cargando...</span>
              ) : (
                <input 
                  disabled={!isEmployeeActive}
                  type="checkbox" {...register('useHidCard')} className={`w-4 h-4 rounded ${!isEmployeeActive && disabledClasses}`} 
                  onClick={() => !createMode && toggleEmployeeField(employee, "use_hid_card")} 
                />
              )}
          </label>
        </div>
        
        <div className="border border-[#ffffff21] p-5 mt-6">
        
        {/* Sección dejada para futura funcionalidad de HID Card */}
          {useHidCardWatch && (
            <>
              <div className="col-span-full mx-auto w-full max-w-lg rounded-xl p-6 md:p-4">
                <div className='bg-[#ffffff21] rounded-xl p-6 md:p-2"'>
                  <div className='flex flex-col md:flex-row md:items-center mb-4 gap-2'>
                    {/* <LabelFieldForm field="Nombre Usuario" simbol="*" /> */}
                    <div className='w-full md:w-auto md:flex-1'>
                        
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row md:items-center gap-2'>
                    {/* <LabelFieldForm field="Contraseña" simbol="*" /> */}
                    <div className='md:ml-10 w-full md:flex-1'>
                      
                    </div>
                  </div>
                  <div className="flex items-start mt-3 gap-2">

                  </div>
                </div>
              </div>
         
              <div className='w-full mt-2.5'>
                <h2 className='text-center p-2.5 text-xl font-bold'>HID Card permisos {employee?.firstName} {employee?.lastName}</h2>
                <div>
                  <table className="min-w-full border-collapse text-sm sm:text-base">
                    <thead>
                      <tr className="tr-thead-table">
                        <th className="px-4 py-3 text-left font-semibold">Módulo</th>
                        <th className="px-4 py-3 text-left font-semibold">Crear</th>
                        <th className="px-4 py-3 text-left font-semibold">Editar</th>
                        <th className="px-4 py-3 text-left font-semibold">Eliminar/Desactivar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                        <td className="px-4 py-3 text-white-800 font-medium"></td>
                        <td className="px-4 py-3 text-white-700"></td>
                        <td className="px-4 py-3 text-white-700"></td>
                        <td className="px-4 py-3 text-white-700"></td>
                      </tr>
                    </tbody>
                  </table>
                </div> 
              </div>
            </>
          )}
        </div>
      </>
  );
}

export default HidCard;