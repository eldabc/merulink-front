export const getStatusColor = (status) => {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 rounded-2xl px-4 py-2 border border-transparent';

  // Estilos por estado
  const statusStyles = {
    'Disponible': 'bg-green-100 text-green-800 hover:border-green-800',
    'Ocupado':    'bg-red-100 text-red-800 hover:border-red-800',
    'Emparejado': 'bg-yellow-100 text-yellow-700 hover:border-yellow-800',
  };

  // Manejo del boolean
  const currentStatus = status === true ? 'Disponible' : status;

  // Obtener la clase
  const specificClass = statusStyles[currentStatus] || 'bg-gray-100 text-gray-800 hover:border-gray-800';

  return `${baseClasses} ${specificClass}`;
};

export const getStatusName = (status) => {
  return status === true
    ? `Activo`
    : `Inactivo`;
};