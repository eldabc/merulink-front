import { useEffect, useState } from "react";
import { XCircleIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Notification({ title, message, onClose, type = '' }) {
  const [animationClass, setAnimationClass] = useState("custom-notification-enter");

  // Cuando se va a cerrar → activar animación de salida
  const handleClose = () => {
    setAnimationClass("custom-notification-exit");
    // setTimeout(onClose, 500); // Duración de la animación
  };

 return (
  <div className={`fixed bottom-6 right-6 z-50 ${animationClass}`}>
    <div className="flex items-stretch bg-white rounded-lg shadow-xl border border-gray-100 relative min-w-[320px] overflow-hidden transition-all duration-300">
      
      {/* Barra lateral */}
      <div className={`w-1.5 shrink- ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />

      {/* Contenido */}
      <div className="flex items-start gap-4 p-5 pr-12">
        <div className="shrink- mt-0.5">
          {type === 'error' ? (
            <XCircleIcon className="w-6 h-6 text-red-500" />
          ) : (
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-bold text-gray-800 leading-tight">
            {title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {/* Botón cerrar con efecto hover */}
      <button
        className="skip-style-btn absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        onClick={handleClose}
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);
}
