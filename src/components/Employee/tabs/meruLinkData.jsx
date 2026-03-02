import { useEmployees } from '../../../context/EmployeeContext';
import { PasswordInputEye } from '../../togglePasswordVisibility.jsx';
import LabelFieldForm from "../../Shared/LabelFieldForm";
import { useEffect } from 'react';
 
export default function MeruLinkData({ createMode, viewMode, isEmployeeActive, cursorNotAllowed, register, errors, employee, tempFlags, watch, setValue }) {
  const { toggleEmployeeField } = useEmployees();
  const useMeruLinkWatch = watch('useMeruLink');
  const flags = createMode ? tempFlags : employee;
  const useMerulink = employee?.useMeruLink ? employee?.useMeruLink : false;

  useEffect (() => {
    if(!useMeruLinkWatch) {
      setValue('userName', '');
      setValue('userPass', '');
    }
  }, [useMeruLinkWatch]);
  
    return (
      <>
        <div className="flex items-center gap-4 mb-4 pl-4">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <span className="text-sm">¿Usa MeruLink?</span>
              <input 
                disabled={!isEmployeeActive || viewMode}
                type="checkbox"
                {...register('useMeruLink')}
                className={`w-4 h-4 rounded ${cursorNotAllowed}`}
              />
          </label>
        </div>
        <div className="border border-[#ffffff21] p-5 mt-6">
          {useMeruLinkWatch && (
            <>
              <div className="col-span-full mx-auto w-full max-w-lg rounded-xl p-6 md:p-4">
                <div className='bg-[#ffffff21] rounded-xl p-6 md:p-2"'>
                  <div className='flex flex-col md:flex-row md:items-center mb-4 gap-2'>
                    <LabelFieldForm field="Nombre Usuario" simbol="*" />
                    <div className='w-full md:w-auto md:flex-1'>
                        <input 
                          readOnly={viewMode }//|| !useMerulink
                          {...register('userName')} className={`w-full md:w-64 px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} 
                        />
                      {errors.userName && <p className="text-red-400 text-xs mt-1 ml-5 ">{errors.userName.message}</p>}
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row md:items-center gap-2'>
                    <LabelFieldForm field="Contraseña" simbol="*" />
                    <div className='md:ml-10 w-full md:flex-1'><PasswordInputEye register={register} errors={errors} viewMode={viewMode} useMeruLink={useMerulink} /></div>
                  </div>
                  <div className="flex items-start mt-3 gap-2">
                    <input
                      disabled={viewMode}
                      type="checkbox"
                      {...register('changePassNextLogin')}
                      className={`w-4 mt-1 ${cursorNotAllowed}`}
                    />
                    
                    <label className="text-sm text-gray-300">
                      Cambia la contraseña al próximo inicio.
                    </label>
                  </div>
                </div>
              </div>
         
              <div className='w-full mt-2.5'>
                <h2 className='text-center p-2.5 text-xl font-bold'>Meru Link permisos {employee?.firstName} {employee?.lastName}</h2>
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
};