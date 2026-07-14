import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; 

export function PasswordInputEye({ register, errors, viewMode, hasUserCreated }) {

  const [showPassword, setShowPassword] = useState(false);

  // Función para alternar el estado
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div>
        <div className="relative w-full md:w-64">
          <input
            readOnly={viewMode }
            placeholder={hasUserCreated ? 'La ingresada ••••••••' : 'Ingrese contraseña'}
            type={showPassword ? 'text' : 'password'}
            {...register('userPass')}
            className={`w-full px-3 py-2 pr-10 rounded-lg filter-input 
              ${viewMode ? 'cursor-not-allowed opacity-50' : ''}`}
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {errors.userPass && (
          <p className="items-start text-red-500 text-xs mt-1 ml-5 -bottom-6 w-full">
              {errors.userPass.message}
          </p>
        )}
    </div>
  );
}