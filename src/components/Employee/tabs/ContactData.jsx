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
        {employee.contacts.map((contact) => (
            <tr key={contact.id} className="tr-table">
                <td className="p-2"><span className="p-1 w-full">{contact.name}</span> </td>
                <td className="p-2"><span className="p-1 w-full">{contact.lastName}</span> </td>
                <td className="p-2"><span className="p-1 w-full">{contact.relationship}</span> </td>
                <td className="p-2"><span className="p-1 w-full">{contact.phone}</span> </td>
                <td className="p-2"><span className="p-1 w-full">{contact.address}</span> </td>
            </tr>
        ))}      
    </tbody>
    </table>
  );
}
