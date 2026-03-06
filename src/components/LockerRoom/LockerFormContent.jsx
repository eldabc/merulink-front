import LabelFieldForm from "../Shared/LabelFieldForm";
import ErrorMessage from '../Shared/ErrorMessage.jsx';

function LockerFormContent({ register, errors, selectedCategory, viewMode, editMode  }) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-4 text-white">{editMode ? ( 'Editar Locker' ):( 'Datos Locker')}</h3>
      <div className='border border-[#ffffff21]
                      md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                      md:[&>*:nth-child(2n)]:pl-4 p-7'
      >
        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4'>
          
          <LabelFieldForm field="Código" simbol="*" />
          <div className="flex flex-row items-center">
            <span className="opacity-50 inline-flex items-center justify-center bg-gray-400 px-2 h-[40px] rounded-sm text-lg leading-none">{selectedCategory}</span>
            <div className="w-full max-w-2xl">
              <input 
                readOnly={viewMode}
                {...register('code')} 
                type='text' 
                className={`w-full px-3 py-2 rounded-lg filter-input border`} 
              />
              {errors?.code && <ErrorMessage msg={errors.code.message} /> }  
            </div>
          </div>

          <LabelFieldForm field="Estatus" simbol="*" />
          <div>
            <select 
              {...register('status')}
              disabled={true}
              className={`text-xl w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 cursor-not-allowed`}
            >
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="Disponible">Disponible</option>
              <option className='bg-[#3c4042]' value="Emparejado">Emparejado</option>
              <option className='bg-[#3c4042]' value="Ocupado">Ocupado</option>
            </select>
            {errors?.status && <ErrorMessage msg={errors.status.message} /> }  
          </div>
        </div>

      
        
        <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 border border-[#ffffff21]
                        md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
                        md:[&>*:nth-child(2n)]:pl-4 p-7'
        >
        </div>
      </div>
    </>
  );
}

export default LockerFormContent;