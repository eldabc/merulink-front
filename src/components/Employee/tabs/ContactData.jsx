export default function ContactData({ employee }) {
  return (
     <table className="w-full border rounded overflow-hidden">
        <thead>
            <tr className="tr-thead-table">
                <th className="p-2 text-left">Nombres</th>
                <th className="p-2 text-left">Apellidos</th>
                <th className="p-2 text-left">Parentesco</th>
                <th className="p-2 text-left">Teléfono</th>
                <th className="p-2 text-left">Dirección</th>
            </tr>
        </thead>

        <tbody>
        <tr className="tr-table">
            <td className="p-2"><input className="border p-1 w-full rounded" /></td>
            <td className="p-2"><input className="border p-1 w-full rounded" /></td>
            <td className="p-2"><input className="border p-1 w-full rounded" /></td>
            <td className="p-2"><input className="border p-1 w-full rounded" /></td>
            <td className="p-2"><input className="border p-1 w-full rounded" /></td>
        </tr>
    </tbody>
    </table>
  );
}
