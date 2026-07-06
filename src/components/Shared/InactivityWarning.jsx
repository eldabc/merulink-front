import { useEffect, useState } from 'react';

/**
 * Modal que se muestra cuando quedan pocos minutos para que expire la sesión por inactividad.
 */
export default function InactivityWarning({ remainingSeconds, onExtend, onClose }) {
  const [visible, setVisible] = useState(false);

  // Animación de entrada
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeLeft = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className={`relative bg-[#2f3235] border border-[#ffb900]/40 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Icono */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-[#ffb900]/10 border-2 border-[#ffb900]/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ffb900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white text-center mb-2">
          ¿Sigues ahí?
        </h3>
        <p className="text-gray-400 text-sm text-center mb-2">
          Tu sesión se cerrará automáticamente por inactividad.
        </p>

        {/* Countdown */}
        <div className="text-center mb-6">
          <span className="text-4xl font-mono font-bold text-[#ffb900]">{timeLeft}</span>
          <p className="text-xs text-gray-500 mt-1">minutos restantes</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 bg-[#3a3d40] border border-[#555a5e] hover:bg-[#46494d] hover:text-white transition-all"
          >
            Cerrar sesión
          </button>
          <button
            onClick={onExtend}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-[#00A4BC] hover:bg-[#008b9f] active:scale-[0.98] transition-all shadow-md"
          >
            Seguir trabajando
          </button>
        </div>
      </div>
    </div>
  );
}
