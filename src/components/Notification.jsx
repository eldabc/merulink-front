import { useEffect, useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Notification({ title, message, onClose }) {
  const [animationClass, setAnimationClass] = useState("custom-notification-enter");

  // Cuando se va a cerrar → activar animación de salida
  const handleClose = () => {
    setAnimationClass("custom-notification-exit");
    setTimeout(onClose, 300); // Duración de la animación
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${animationClass}`}>
      <div className="flex items-start gap-2 bg-white rounded-lg shadow-lg border border-gray-200 relative min-w-[300px] overflow-hidden">

        {/* Barra lateral verde */}
        <div className="w-4 bg-green-500">&nbsp;</div>

        {/* Contenido */}
        <div className="flex items-start gap-3 p-4">
          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />

          <div>
            <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>

        {/* Botón cerrar */}
        <div
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={handleClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
