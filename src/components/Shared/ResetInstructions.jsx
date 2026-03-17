import LabelFieldForm from './LabelFieldForm';
import ErrorMessage from './ErrorMessage';

function ResetInstructions({ register, errors }) {
  return (
    <div className='flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4 mt-6 div-border'>
      {/* <div className="grid grid-cols-1  gap-6"> */}
        {/* <div className="flex flex-col gap-2 md:col-span-2"> */}
          <div className='grid grid-cols-1 gap-2 items-center'>
            <LabelFieldForm field="Paso 1: (OBLIGATORIO)" simbol="*" />
            <span className='text-gray-400 text-sm italic'>Instrucciones de Reinicio</span>
          </div>
          <textarea 
            {...register('resetInstructions')}
            placeholder="Describe cómo resetear el candado..."
            rows="4"
            className="input-locker w-full py-2 placeholder:opacity-50 "
          />
          {errors?.resetInstructions && <ErrorMessage msg={errors.resetInstructions?.message} /> }  
        {/* </div> */}
      {/* </div> */}
    </div>
  );
}

export default ResetInstructions;