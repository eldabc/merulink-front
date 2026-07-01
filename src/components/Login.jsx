import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loading, setLoading, authLogin } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    try {
      // Petición a tu Laragon local
      const response = await authLogin(data);
      if (response) {
        navigate('/empleados/horarios'); // Redirige a la vista de horarios después del login exitoso
        console.log("¡Sesión iniciada con éxito!", response);
      }
      
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Error de conexión con el servidor. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#1e2022] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-[#2f3235] rounded-xl border border-[#43474a] shadow-2xl">
        
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            Meru<span className="text-[#00A4BC]">Link</span>
          </h2>
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
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="nombre@plazameru.com"
              {...register('email', { required: 'El correo es obligatorio' })}
              className="w-full p-2.5 rounded-lg bg-[#252729] border border-[#43474a] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A4BC] transition-all"
            />
            {errors.email && (
              <span className="text-[11px] text-red-400 font-medium">{errors.email.message}</span>
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
            disabled={loading}
            className={`w-full mt-2 p-2.5 rounded-lg text-sm font-bold text-white uppercase tracking-wider transition-all shadow-md
              ${loading 
                ? 'bg-[#00A4BC]/50 cursor-not-allowed text-gray-300' 
                : 'bg-[#00A4BC] hover:bg-[#008b9f] active:scale-[0.98]'
              }`}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;