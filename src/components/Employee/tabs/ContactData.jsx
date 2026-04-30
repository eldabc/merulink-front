import { getDisabledClasses } from '../../../utils/global-utils';  
import ButtonAddContact from '../../Shared/ButtonAddContact';
import ButtonTrash from '../../Shared/ButtonTrash';

export default function ContactData({ viewMode, register, errors, fields = [], append, remove }) {

  const disabledClasses = getDisabledClasses(viewMode);
  
  const addContacts = fields.length < 5 ? true : false;

  const handleAddContact = () => {
    if (typeof append === 'function' && addContacts) {
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

    return (
      <div className="p-4 rounded border border-[#ffffff21]">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">Agregar datos de contacto de emergencia (Máximo 5)</p>
          <ButtonAddContact disabled={viewMode} handleAddContact={handleAddContact} addContacts={addContacts} dynamicClasses={disabledClasses} />
          {/* <button
            disabled={viewMode}
            type="button"
            onClick={handleAddContact}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${!addContacts && 'cursor-not-allowed opacity-50'} ${disabledClasses}`} 
          >
            <PlusIcon className="w-4 h-4" />
            Agregar Contacto
          </button> */}
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
                        readOnly={viewMode}
                        {...register(`contacts.${index}.name`)}
                        placeholder="Nombre"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${disabledClasses}`}
                      />
                      {errors?.contacts?.[index]?.name && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].name.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        readOnly={viewMode}
                        {...register(`contacts.${index}.lastName`)}
                        placeholder="Apellido"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${disabledClasses}`}
                      />
                      {errors?.contacts?.[index]?.lastName && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].lastName.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        readOnly={viewMode}
                        {...register(`contacts.${index}.relationship`)}
                        placeholder="Parentesco"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${disabledClasses}`}
                      />
                      {errors?.contacts?.[index]?.relationship && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].relationship.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        readOnly={viewMode}
                        {...register(`contacts.${index}.phone`)}
                        placeholder="0414-1234567"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${disabledClasses}`}
                      />
                      {errors?.contacts?.[index]?.phone && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].phone.message}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <input
                        readOnly={viewMode}
                        {...register(`contacts.${index}.address`)}
                        placeholder="Dirección"
                        className={`w-full px-2 py-1 rounded filter-input text-sm ${disabledClasses}`}
                      />
                      {errors?.contacts?.[index]?.address && (
                        <p className="text-red-400 text-xs mt-1">{errors.contacts[index].address.message}</p>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {/* <button
                        disabled={viewMode}
                        type="button"
                        onClick={() => remove(index)}
                        className={`inline-flex items-center justify-center p-1 rounded ${disabledClasses}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button> */}
                      <ButtonTrash disabled={viewMode} remove={remove} index={index} dinamicClasses={disabledClasses} />
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
