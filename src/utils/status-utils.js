import { statusConfig } from './statusesConfig.js';

export const getStatusColor = (status) => {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 rounded-2xl px-4 py-2 border border-transparent';

  // Obtener la clase
  const specificClass = statusConfig[status];

  return `${baseClasses} ${specificClass.classes}`;
};

export const getStatusName = (status) => {
  return status === true
    ? `Activo`
    : `Inactivo`;
};