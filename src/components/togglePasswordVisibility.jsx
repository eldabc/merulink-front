import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; 

export function PasswordInputEye({ register, errors, viewMode }) {

  const [showPassword, setShowPassword] = useState(false);

  // Función para alternar el estado
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div>
        <div className="relative flex flex-row">
            <input
                readOnly={viewMode}
                type={showPassword ? 'text' : 'password'}
                {...register('userPass')}
                className={`w-2xs px-3 py-1 rounded-lg filter-input ml-5 mt-1.5 pr-10 border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ${viewMode ? 'cursor-not-allowed opacity-50' : ''} `}
            />
            <button
                //disabled={viewMode}
                type="button"
                onClick={togglePasswordVisibility}
                className="right-0 -mr-2.5 mt-1 text-gray-400 absolute hover:text-gray-200 transition duration-150"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
                {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" /> // Ojo tachado
                ) : (
                    <EyeIcon className="h-5 w-5" /> // Ojo abierto
                )}
            </button>
        </div>

        {errors.userPass && (
            <p className="items-start text-red-500 text-xs mt-1 ml-5 bottom-[-1.5rem] w-full">
            {errors.userPass.message}
            </p>
        )}
    </div>
  );
}