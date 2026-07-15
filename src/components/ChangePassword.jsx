import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import GuestBar from './Shared/GuestBar';
import NameApp from './Shared/NameApp';

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { changePasswordContext } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Si no hay token temporal, redirigir al login
  useEffect(() => {
    const tempToken = localStorage.getItem('tempToken');
    if (!tempToken) {
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setApiError(null);
    try {

      await changePasswordContext(data);
      navigate('/');

    } catch (error) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Errores de validación
        const firstError = Object.values(error.response.data.errors)[0];
        setApiError(firstError[0]);
      } else {
        setApiError('Error de conexión con el servidor. Inténtalo de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <GuestBar />
      <div className="min-h-screen min-w-screen bg-[#1e2022] flex items-center justify-center p-4">
        
        <div className="w-full max-w-md p-6 bg-[#2f3235] rounded-xl border border-[#43474a] shadow-2xl">
          
          {/* Encabezado */}
          <div className="flex flex-col items-center mb-6">
            <NameApp dynamicClasses="text-2xl uppercase"/>
            <p className="text-xs text-gray-400 mt-1">Cambio de Contraseña Obligatorio</p>
          </div>

          {/* Mensaje informativo */}
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-xs">
            Por seguridad, debes cambiar tu contraseña antes de continuar.
          </div>

          {/* Alerta de Error de la API */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold">
              {apiError}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* Contraseña Actual */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                Contraseña Actual
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña actual"
                {...register('current_password', { required: 'La contraseña actual es obligatoria' })}
                className="w-full p-2.5 rounded-lg bg-[#252729] border border-[#43474a] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A4BC] transition-all"
              />
              {errors.current_password && (
                <span className="text-[11px] text-red-400 font-medium">{errors.current_password.message}</span>
              )}
            </div>

            {/* Nueva Contraseña */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                Nueva Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                {...register('new_password', { 
                  required: 'La nueva contraseña es obligatoria',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
                className="w-full p-2.5 rounded-lg bg-[#252729] border border-[#43474a] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A4BC] transition-all"
              />
              {errors.new_password && (
                <span className="text-[11px] text-red-400 font-medium">{errors.new_password.message}</span>
              )}
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="Confirma tu nueva contraseña"
                {...register('new_password_confirmation', { 
                  required: 'Debes confirmar la nueva contraseña',
                  validate: (value) => value === watch('new_password') || 'Las contraseñas no coinciden'
                })}
                className="w-full p-2.5 rounded-lg bg-[#252729] border border-[#43474a] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A4BC] transition-all"
              />
              {errors.new_password_confirmation && (
                <span className="text-[11px] text-red-400 font-medium">{errors.new_password_confirmation.message}</span>
              )}
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 p-2.5 rounded-lg text-white font-bold text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>

          </form>

          <p className="text-[10px] text-gray-500 text-center mt-6">
            Si tienes problemas, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
