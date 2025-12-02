export const getStatusColor = (status) => {
  return status === 'Activo'
    ? 'px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 hover:border-green-600 hover:border-2'
    : 'px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 hover:border-red-600 hover:border';
};
