import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from '../Shared/ErrorMessage'; // Tu componente de error existente

const ScheduleWorkflowSteps = ({ viewMode }) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();

  // Escuchamos los cambios de los tres estados en tiempo real
  const isReviewed = watch('is_reviewed', false);
  const isApproved = watch('is_approved', false);
  const isClosed = watch('is_closed', false);

  const isInitialized = useRef(false);

  useEffect(() => {
    isInitialized.current = true;
  }, []);

  // EFECTO CASCADA: Si se desmarca un paso previo, limpiamos los siguientes automáticamente
  useEffect(() => {
    if (!isInitialized.current) return;
    if (!isReviewed) {
      if (isApproved) setValue('is_approved', false);
      if (isClosed) setValue('is_closed', false);
    }
  }, [isReviewed, isApproved, isClosed, setValue]);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (!isApproved && isClosed) {
      setValue('is_closed', false);
    }
  }, [isApproved, isClosed, setValue]);

  return (
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
            {...register('is_reviewed')}
            className="w-4 h-4 rounded text-[#ffb900] focus:ring-[#ffb900] bg-[#3a3d40] border-[#555a5e]"
          />
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isReviewed ? 'text-[#ffb900]' : 'text-gray-300'}`}>1. Revisado</span>
            <span className="text-xs text-gray-400">Verificación inicial</span>
          </div>
        </label>

        {/* PASO 2: APROBADO */}
        <label className={`flex items-center gap-3 p-3 rounded-lg border transition-all
          ${!isReviewed ? 'opacity-40 cursor-not-allowed bg-[#1b1c1e] border-transparent' : 'cursor-pointer'}
          ${isApproved ? 'border-green-500 bg-green-500/10' : isReviewed ? 'border-[#43474a] bg-[#252729]' : ''}
          ${viewMode ? 'pointer-events-none' : ''}`}
        >
          <input
            type="checkbox"
            disabled={!isReviewed || viewMode} // Deshabilitado si no está revisado
            {...register('is_approved')}
            className="w-4 h-4 rounded text-green-500 focus:ring-green-500 bg-[#3a3d40] border-[#555a5e] disabled:opacity-30"
          />
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isApproved ? 'text-green-400' : 'text-gray-300'}`}>2. Aprobado</span>
            <span className="text-xs text-gray-400">Validado por gerencia</span>
          </div>
        </label>

        {/* PASO 3: CERRADO */}
        <label className={`flex items-center gap-3 p-3 rounded-lg border transition-all
          ${!isApproved ? 'opacity-40 cursor-not-allowed bg-[#1b1c1e] border-transparent' : 'cursor-pointer'}
          ${isClosed ? 'border-red-500 bg-red-500/10' : isApproved ? 'border-[#43474a] bg-[#252729]' : ''}
          ${viewMode ? 'pointer-events-none' : ''}`}
        >
          <input
            type="checkbox"
            disabled={!isApproved || viewMode} // Deshabilitado si no está aprobado
            {...register('is_closed')}
            className="w-4 h-4 rounded text-red-500 focus:ring-red-500 bg-[#3a3d40] border-[#555a5e] disabled:opacity-30"
          />
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isClosed ? 'text-red-400' : 'text-gray-300'}`}>3. Cerrado</span>
            <span className="text-xs text-gray-400">Congelar Cambios</span>
          </div>
        </label>

      </div>

      {/* Renderizado de errores de validación de Yup */}
      {(errors.is_reviewed || errors.is_approved || errors.is_closed) && (
        <div className="mt-1 text-xs text-red-400 font-semibold bg-red-500/10 p-2 rounded-md border border-red-500/20">
          {errors.is_reviewed?.message || errors.is_approved?.message || errors.is_closed?.message}
        </div>
      )}
    </div>
  );
};

export default ScheduleWorkflowSteps;