export const getStatusColor = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
  return status === true || status === 'Disponible'
    ? `${baseClasses} bg-green-100 text-green-800 border border-transparent hover:border-green-800 transition-all duration-300 rounded-2xl px-4 py-2`
    : `${baseClasses} bg-red-100 text-red-800 border border-transparent hover:border-red-800 transition-all duration-300 rounded-2xl px-4 py-2`;
};

export const getStatusName = (status) => {
  return status === true
    ? `Activo`
    : `Inactivo`;
};