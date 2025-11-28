import React, { useMemo, useState } from "react";

// Simple EmployeeTable component with sample data.
// You can later replace the sample data with a fetch to your API.
export default function EmployeeTable() {
  const [query, setQuery] = useState("");

  const sampleData = useMemo(() => ([
    { id: 1, nombre: "María Pérez", departamento: "Sistemas", cargo: "Analista", casillero: "A12" },
    { id: 2, nombre: "Juan Gómez", departamento: "Operaciones", cargo: "Supervisor", casillero: "B07" },
    { id: 3, nombre: "Lucía Torres", departamento: "Ventas", cargo: "Vendedora", casillero: "C03" }
  ]), []);

  const filtered = sampleData.filter(e => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      e.nombre.toLowerCase().includes(q) ||
      e.departamento.toLowerCase().includes(q) ||
      e.cargo.toLowerCase().includes(q) ||
      (e.casillero || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="employee-table">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Empleados</h3>
        <div>
          <input
            type="search"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: 6 }}
          />
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <th style={{ padding: '8px 6px' }}>Nombre</th>
            <th style={{ padding: '8px 6px' }}>Departamento</th>
            <th style={{ padding: '8px 6px' }}>Cargo</th>
            <th style={{ padding: '8px 6px' }}>Casillero</th>
            <th style={{ padding: '8px 6px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(emp => (
            <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <td style={{ padding: '8px 6px' }}>{emp.nombre}</td>
              <td style={{ padding: '8px 6px' }}>{emp.departamento}</td>
              <td style={{ padding: '8px 6px' }}>{emp.cargo}</td>
              <td style={{ padding: '8px 6px' }}>{emp.casillero}</td>
              <td style={{ padding: '8px 6px' }}>
                <button style={{ marginRight: 6 }}>Editar</button>
                <button>Ver</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 12, textAlign: 'center', color: '#999' }}>No hay resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// export default function EmployeeTable() {
//   const employees = [
//     { id: 1, name: "Ana López", role: "Diseñadora" },
//     { id: 2, name: "Juan Pérez", role: "Desarrollador" },
//     { id: 3, name: "María Gómez", role: "Marketing" },
//   ];

//   return (
//     <div className="p-4">
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 border">ID</th>
//               <th className="px-4 py-2 border">Nombre</th>
//               <th className="px-4 py-2 border">Rol</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.map((e) => (
//               <tr key={e.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-2 border">{e.id}</td>
//                 <td className="px-4 py-2 border">{e.name}</td>
//                 <td className="px-4 py-2 border">{e.role}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
