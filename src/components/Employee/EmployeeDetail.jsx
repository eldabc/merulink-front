import React from 'react';

export default function EmployeeDetail({ employee, onBack }) {
  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Botón Atrás */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
      >
        ← Volver
      </button>

      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-lg mb-6">
        <h2 className="text-3xl font-bold">{employee.nombre} {employee.apellido}</h2>
        <p className="text-blue-100 text-lg">{employee.cargo}</p>
      </div>

      {/* Información Personal */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500 font-semibold">No. Empleado</label>
            <p className="text-gray-800 font-medium text-lg">{employee.noEmpleado}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold">Cédula</label>
            <p className="text-gray-800 font-medium text-lg">{employee.cedula}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold">Nombre</label>
            <p className="text-gray-800 font-medium text-lg">{employee.nombre}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold">Apellido</label>
            <p className="text-gray-800 font-medium text-lg">{employee.apellido}</p>
          </div>
        </div>
      </div>

      {/* Información Laboral */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Información Laboral</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500 font-semibold">Departamento</label>
            <p className="text-gray-800 font-medium text-lg">{employee.departamento}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold">Sub-Departamento</label>
            <p className="text-gray-800 font-medium text-lg">{employee.subDepartamento}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold">Cargo</label>
            <p className="text-gray-800 font-medium text-lg">{employee.cargo}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold">Estatus</label>
            <div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                employee.estatus === 'Activo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.estatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 flex-wrap">
        <button className="flex-1 min-w-32 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
          ✏️ Editar
        </button>
        <button className="flex-1 min-w-32 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition">
          📄 Descargar CV
        </button>
        <button
          onClick={onBack}
          className="flex-1 min-w-32 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
        >
          ✕ Cerrar
        </button>
      </div>
    </div>
  );
}