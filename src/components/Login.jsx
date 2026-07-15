import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import GuestBar from './Shared/GuestBar';
import NameApp from './Shared/NameApp';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { authLogin, setAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const response = await authLogin(data);
      if (response.requiresPasswordChange) {
        navigate('/cambiar-contrasena');
      } else if (response) {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
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
            <p className="text-xs text-gray-400 mt-1">Gestión de Empleados</p>
          </div>

          {/* Alerta de Error de la API */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold">
              {apiError}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                Nombre Usuario
              </label>
              <input
                type="text"
                placeholder="Nombre usuario Ejem: nombre.apellido"
                {...register('username', { required: 'El nombre de usuario es obligatorio' })}
                className="w-full p-2.5 rounded-lg bg-[#252729] border border-[#43474a] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A4BC] transition-all"
              />
              {errors.username && (
                <span className="text-[11px] text-red-400 font-medium">{errors.username.message}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'La contraseña es obligatoria' })}
                className="w-full p-2.5 rounded-lg bg-[#252729] border border-[#43474a] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A4BC] transition-all"
              />
              {errors.password && (
                <span className="text-[11px] text-red-400 font-medium">{errors.password.message}</span>
              )}
            </div>

            {/* Botón de Ingreso */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full mt-2 p-2.5 rounded-lg text-sm font-bold text-white uppercase tracking-wider transition-all shadow-md
                ${submitting 
                  ? 'bg-[#00A4BC]/50 cursor-not-allowed text-gray-300' 
                  : 'bg-[#00A4BC] hover:bg-[#008b9f] active:scale-[0.98]'
                }`}
            >
              {submitting ? 'Verificando...' : 'Iniciar Sesión'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;