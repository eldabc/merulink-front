export const newNumEmployee = (employeeData) => {
  // generar número de empleado automáticamente
  const maxNum = Math.max( 0,
    ...employeeData.map(e => {
      const num = parseInt(e.numEmployee) || 0;
      return num;
    })
  );
  return String(maxNum + 1);
}

export const fieldLabels = {
  "use_meru_link": 'Uso de Merú Link',
  "use_locker": 'Uso de Locker',
  "use_hid_card": 'Uso de Tarjeta HID',
  "use_transport": 'Uso de transporte',
  "status": 'Estatus de Empleado',
};

// Diccionario de acciones de estatus del empleado (modal de baja / reactivación)
export const STATUS_ACTIONS = {
  activate: {
    key: 'activate',
    label: 'Activar',
    actionLabel: 'activado',
    title: 'Activar Empleado',
    btnText: 'Activar ahora',
  },
  deactivate: {
    key: 'deactivate',
    label: 'Desactivar',
    actionLabel: 'desactivado',
    title: 'Dar de Baja Empleado',
    btnText: 'Confirmar Baja',
  },
};