export const STATUSES = {
    AVAILABLE: 'Disponible',
    OCCUPIED: 'Ocupado',
    MATCHED: 'Emparejado',
    ACTIVE: true,
    INACTIVE: false,
};

export const statusConfig = {
    [STATUSES.AVAILABLE]: { label: 'Disponible', title: 'Locker Disponible', classes: 'bg-green-100 text-green-800 hover:border-green-800' },
    [STATUSES.OCCUPIED]: { label: 'Ocupado', title: 'Locker Ocupado', classes: 'bg-red-100 text-red-800 hover:border-red-800' },
    [STATUSES.MATCHED]: { label: 'Emparejado', title: 'Locker Emparejado', classes: 'bg-yellow-100 text-yellow-700 hover:border-yellow-800' },
    [STATUSES.ACTIVE]: { label: 'Activo', title: 'Empleado Activo', classes: 'bg-green-100 text-green-800 hover:border-green-800' },
    [STATUSES.INACTIVE]: { label: 'Inactivo', title: 'Empleado Inactivo', classes: 'bg-gray-100 text-gray-800 hover:border-gray-800' },
};