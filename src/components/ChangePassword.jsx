import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../context/AuthContext.jsx';

import { changePasswordValidationSchema } from '../utils/Validations/changePasswordValidationSchema';

import GuestBar from './Shared/GuestBar';
import NameApp from './Shared/NameApp';
import LabelUppercase from './Shared/LabelUppercase';
import ErrorMessage from './Shared/ErrorMessage';
import { PasswordInputEye } from './togglePasswordVisibility';

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordValidationSchema),
  });
  const { changePasswordContext } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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

      const response = await changePasswordContext(data);
      setSuccessMessage(response.message);

      // Pausa para mostrar mensaje de éxito
      setTimeout(() => { navigate('/'); }, 1500);

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

          {/* Alerta de Éxito */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-xs font-semibold">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Nueva Contraseña */}
            <div className="flex flex-col gap-1">
              <LabelUppercase text="Nueva Contraseña" />
              <PasswordInputEye
                register={register}
                errors={errors}
                name="new_password"
                placeholder="Ingresa tu nueva contraseña"
                hasUserCreated={false}
              />
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="flex flex-col gap-1">
              <LabelUppercase text="Confirmar Contraseña" />
              <PasswordInputEye
                register={register}
                errors={errors}
                name="new_password_confirmation"
                placeholder="Confirma tu nueva contraseña"
                hasUserCreated={false}
              />
            </div>

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
