function WarningChangeStatusEmployee () {
  return (
    <>
    <div className="mt-3 p-5">
      <h2 className="text-lg font-bold text-red-500">Hacer esto ocasionará</h2>
        <ul className="list-disc ml-5 text-justify">
          <li className="hover:text-gray-300">Resetear Asignación de Locker y Candado.</li> 
          <li className="hover:text-gray-300">Deshabilitar uso de transporte.</li>
          <li className="hover:text-gray-300">Deshabilitar use de tarjeta HID.</li>
          <li className="hover:text-gray-300">Desactivar usuario Merulink y sus permisos.</li>
        </ul>
      <p className="text-justify mt-6">Luego de esta acción usted podrá reactivar empleado pero los cambios listados arriba <b>NO se desharán</b>. </p>
    </div>
    </>
  );
}

export default WarningChangeStatusEmployee;