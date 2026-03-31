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
  "use_meru_link": 'Usa Merú Link',
  "use_locker": 'Usa Locker',
  "use_hid_card": 'Usa Tarjeta HID',
  "use_transport": 'Usa transporte',
  "status": 'Estatus de Empleado',
};