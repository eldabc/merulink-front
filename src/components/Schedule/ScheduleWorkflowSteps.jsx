import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
// import ErrorMessage from '../Shared/ErrorMessage';
import HasPermission from '../Shared/HasPermission';

const ScheduleWorkflowSteps = ({ viewMode, reviewedBy, approvedBy }) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();

  // Escuchamos los cambios de los tres estados en tiempo real
  const isReviewed = watch('isReviewed', false);
  const isApproved = watch('isApproved', false);
  const isClosed = watch('isClosed', false);

  const isInitialized = useRef(false);

  useEffect(() => {
    isInitialized.current = true;
  }, []);

  // EFECTO CASCADA: Si se desmarca un paso previo, limpiamos los siguientes automáticamente
  useEffect(() => {
    if (!isInitialized.current) return;
    if (!isReviewed) {
      if (isApproved) setValue('isApproved', false);
      if (isClosed) setValue('isClosed', false);
    }
  }, [isReviewed, isApproved, isClosed, setValue]);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (!isApproved && isClosed) {
      setValue('isClosed', false);
    }
  }, [isApproved, isClosed, setValue]);

  return (
    <HasPermission permissions={["reviewed-schedules"]}>    
      <div className="flex flex-col gap-3 w-full p-5 mx-auto bg-[#2f3235] rounded-xl border border-[#43474a] shadow-md">
        <h4 className="text-sm font-semibold text-[#00A4BC] mb-1 uppercase tracking-wider mx-8">
          Flujo de Aprobación del Horario
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-8">
          
          {/* PASO 1: REVISADO */}
          <label className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
            ${isReviewed ? 'border-[#ffb900] bg-[#00a4bc10]' : 'border-[#43474a] bg-[#252729]'} 
            ${viewMode ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input
              type="checkbox"
              disabled={viewMode}
              {...register('isReviewed')}
              className="w-4 h-4 rounded text-[#ffb900] focus:ring-[#ffb900] bg-[#3a3d40] border-[#555a5e]"
            />
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isReviewed ? 'text-[#ffb900]' : 'text-gray-300'}`}>1. Revisado</span>
              <div className='flex flex-row'>
                <span className="text-xs text-gray-400">Verificación inicial por:</span>
                <span className="text-xs text-[#ffb900] pl-2">
                  {reviewedBy?.firstName
                    ? `${reviewedBy.firstName} ${reviewedBy.lastName ?? ''}`
                    : '—'}
                </span>
              </div>
            </div>
          </label>

          {/* PASO 2: APROBADO */}
          <HasPermission permissions={["approve-schedules"]}>
            <label className={`flex items-center gap-3 p-3 rounded-lg border transition-all
              ${!isReviewed ? 'opacity-40 cursor-not-allowed bg-[#1b1c1e] border-transparent' : 'cursor-pointer'}
              ${isApproved ? 'border-green-500 bg-green-500/10' : isReviewed ? 'border-[#43474a] bg-[#252729]' : ''}
              ${viewMode ? 'pointer-events-none' : ''}`}
            >
              <input
                type="checkbox"
                disabled={!isReviewed || viewMode} // Deshabilitado si no está revisado
                {...register('isApproved')}
                className="w-4 h-4 rounded text-green-500 focus:ring-green-500 bg-[#3a3d40] border-[#555a5e] disabled:opacity-30"
              />
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${isApproved ? 'text-green-400' : 'text-gray-300'}`}>2. Aprobado</span>
                <div className='flex flex-row'>
                  <span className="text-xs text-gray-400">Validado por: </span>
                  <span className="text-xs text-green-400 pl-2">
                    {approvedBy?.firstName
                      ? `${approvedBy.firstName} ${approvedBy.lastName ?? ''}`
                      : '—'}
                  </span>
                </div>
              </div>
            </label>
          </HasPermission>

          {/* PASO 3: CERRADO */}
          {/* <HasPermission permissions={["closed-schedules"]}>
            <label className={`hidden flex items-center gap-3 p-3 rounded-lg border transition-all
              ${!isApproved ? 'opacity-40 cursor-not-allowed bg-[#1b1c1e] border-transparent' : 'cursor-pointer'}
              ${isClosed ? 'border-red-500 bg-red-500/10' : isApproved ? 'border-[#43474a] bg-[#252729]' : ''}
              ${viewMode ? 'pointer-events-none' : ''}`}
            >
              <input
                type="checkbox"
                disabled={!isApproved || viewMode} // Deshabilitado si no está aprobado
                {...register('isClosed')}
                className="w-4 h-4 rounded text-red-500 focus:ring-red-500 bg-[#3a3d40] border-[#555a5e] disabled:opacity-30"
              />
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${isClosed ? 'text-red-400' : 'text-gray-300'}`}>3. Cerrado</span>
                <div className='flex flex-row'>
                  <span className="text-xs text-gray-400">Cambios Congelados por:</span>
                  <span className="text-xs text-red-400 pl-2"> Sistemas </span>
                </div>
              </div>
            </label>
          </HasPermission> */}

        </div>

        {/* Renderizado de errores de validación de Yup */}
        {(errors.isReviewed || errors.isApproved || errors.isClosed) && (
          <div className="mt-1 text-xs text-red-400 font-semibold bg-red-500/10 p-2 rounded-md border border-red-500/20">
            {errors.isReviewed?.message || errors.isApproved?.message || errors.isClosed?.message}
          </div>
        )}
      </div>
    </HasPermission>
  );
};

export default ScheduleWorkflowSteps;