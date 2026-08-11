import dayjs from 'dayjs';

function WarningChangeStatusEmployee ({ toggleStatusChangeList, retireDate }) {
  return (
    <>
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
      
      <span className="block font-bold text-red-400 text-sm mb-2">
        Resumen de Impacto
      </span>

      {toggleStatusChangeList === 'activate' ? (
        <> 
          <p className="text-gray-400 text-xs mt-3">
            Esta acción NO restaurará los cambios previos.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
            <li>Asignación de locker y candado (deberá asignarlos manualmente).</li>
            <li>Uso del servicio de transporte.</li>
            <li>Uso de tarjeta HID.</li>
            <li>Cuenta de usuario Merulink y sus permisos de acceso.</li>
            <li>Turnos de su último horario registrado. </li>
          </ul>
          
        </>
      ) : (
        <>
          <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
            <li>Se reseteará la asignación de locker y candado.</li>
            <li>Se deshabilitará el uso de transporte.</li>
            <li>Se deshabilitará el uso de tarjeta HID.</li>
            <li>Se desactivará el usuario MeruLink y sus permisos.</li>
            <li>
              Se eliminarán del horario los turnos asignados a este empleado a partir del{' '}
              <b>{dayjs(retireDate).format('DD/MM/YYYY')}</b>.
            </li>
          </ul>
          <p className="text-gray-400 text-xs mt-3">
            Luego de esta acción podrá reactivar al empleado, pero los cambios listados arriba
            NO se desharán automáticamente.
          </p>
        </>
      )}
    </div>
    </>
  );
}

export default WarningChangeStatusEmployee;