import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; 
import ErrorMessage from './Shared/ErrorMessage';

export function PasswordInputEye({ register, errors, viewMode, hasUserCreated, name = 'userPass', placeholder, dynamicClasses }) {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const defaultPlaceholder = hasUserCreated ? 'La ingresada ••••••••' : 'Ingrese contraseña';

  return (
    <div>
        <div className="relative w-full ">
          <input
            readOnly={viewMode}
            placeholder={placeholder ?? defaultPlaceholder}
            type={showPassword ? 'text' : 'password'}
            {...register(name)}
            className={`w-full px-3 py-2 pr-10 rounded-lg filter-input ${dynamicClasses} 
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

        {errors[name] && ( <ErrorMessage msg={errors[name].message} /> )}
    </div>
  );
}