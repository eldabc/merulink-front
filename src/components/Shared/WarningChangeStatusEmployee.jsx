function WarningChangeStatusEmployee ({ toggleStatusChangeList }) {
  return (
    <>
    <div className="mt-3 p-5">
      {toggleStatusChangeList === 'activate' ? (
        <>
        <h2 className="text-lg font-bold text-red-500">Esta acción NO restaurará los cambios previos</h2>
        <p className="text-justify mt-4 mb-6">
          Al reactivar al empleado, el sistema <b>NO restablecerá automáticamente</b> los siguientes elementos que fueron cambiados:
        </p>

        <ul className="list-disc ml-5 text-justify">
          <li className="hover:text-gray-300">Asignación de locker y candado (deberá asignarlos manualmente).</li> 
          <li className="hover:text-gray-300">Uso del servicio de transporte.</li>
          <li className="hover:text-gray-300">Uso de tarjeta HID.</li>
          <li className="hover:text-gray-300">Cuenta de usuario Merulink y sus permisos de acceso.</li>
        </ul>
        </>
      ) : (
        <>
        <h2 className="text-lg font-bold text-red-500">Esta acción ocasionará </h2>
        <ul className="list-disc ml-5 text-justify">
          <li className="hover:text-gray-300">Resetear Asignación de Locker y Candado.</li> 
          <li className="hover:text-gray-300">Deshabilitar uso de transporte.</li>
          <li className="hover:text-gray-300">Deshabilitar use de tarjeta HID.</li>
          <li className="hover:text-gray-300">Desactivar usuario Merulink y sus permisos.</li>
        </ul>
        <p className="text-justify mt-6">Luego de esta acción usted podrá reactivar empleado pero los cambios listados arriba <b>NO se desharán</b>. </p>
        </>
      )}
    </div>
    </>
  );
}

export default WarningChangeStatusEmployee;