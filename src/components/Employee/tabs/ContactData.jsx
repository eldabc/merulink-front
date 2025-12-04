import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function ContactData({ register, errors, employee, fields = [], append, remove }) {
  const isForm = typeof register === 'function';

  const handleAddContact = () => {
    if (typeof append === 'function') {
      append({
        id: Date.now(),
        name: '',
        lastName: '',
        relationship: '',
        phone: '',
        address: ''
      });
    }
  };

  if (isForm) {
    return (
      <div className="p-4 rounded border border-[#ffffff21]">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">Agregar datos de contacto de emergencia (Máximo 5)</p>
          <button
            type="button"
            onClick={handleAddContact}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar Contacto
          </button>
        </div>

        {fields.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No hay contactos agregados. Haz click en "Agregar Contacto" para añadir uno.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded overflow-hidden">
              <thead>
                <tr className="tr-thead-table">
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Apellido</th>
                  <th className="p-2 text-left">Parentesco</th>
                  <th className="p-2 text-left">Teléfono</th>
                  <th className="p-2 text-left">Dirección</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="tr-table">
                    <td className="p-2">
                      <input
                        {...register(`contacts.${index}.name`)}
                        placeholder="Nombre"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${
                          errors?.contacts?.[index]?.name ? 'border-red-500' : ''
                        }`}
                      />
                      {errors?.contacts?.[index]?.name && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].name.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        {...register(`contacts.${index}.lastName`)}
                        placeholder="Apellido"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${
                          errors?.contacts?.[index]?.lastName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors?.contacts?.[index]?.lastName && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].lastName.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        {...register(`contacts.${index}.relationship`)}
                        placeholder="Parentesco"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${
                          errors?.contacts?.[index]?.relationship ? 'border-red-500' : ''
                        }`}
                      />
                      {errors?.contacts?.[index]?.relationship && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].relationship.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        {...register(`contacts.${index}.phone`)}
                        placeholder="0414-1234567"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${
                          errors?.contacts?.[index]?.phone ? 'border-red-500' : ''
                        }`}
                      />
                      {errors?.contacts?.[index]?.phone && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].phone.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        {...register(`contacts.${index}.address`)}
                        placeholder="Dirección"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${
                          errors?.contacts?.[index]?.address ? 'border-red-500' : ''
                        }`}
                      />
                      {errors?.contacts?.[index]?.address && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].address.message}</p>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="inline-flex items-center justify-center p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

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
        {employee?.contacts?.map((contact) => (
          <tr key={contact.id} className="tr-table">
            <td className="p-2"><span className="p-1 w-full">{contact.name}</span></td>
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
