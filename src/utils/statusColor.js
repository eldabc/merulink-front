export const getStatusColor = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
  return status === 'Activo'
    ? `${baseClasses} bg-green-100 text-green-800 hover:border-green-600 hover:border`
    : `${baseClasses} bg-red-100 text-red-800 hover:border-red-600 hover:border`;
};
