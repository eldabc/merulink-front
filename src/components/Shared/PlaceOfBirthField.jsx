import { useFormContext } from 'react-hook-form';

import { venezuelaStates } from '../../utils/StaticData/venezuelaStates-utils';

import ErrorMessage from './ErrorMessage';

/**
 * Campo "Lugar de Nacimiento" reutilizable:
 *  - Si la nacionalidad es Venezolana ("V") muestra un <select> de estados de Venezuela.
 *  - Si es Extranjera ("E") o aún no hay nacionalidad, muestra el input de texto libre. 
 *
 * La limpieza al CAMBIAR la nacionalidad se hace en el onChange del select
 * de Nacionalidad.
 */
function PlaceOfBirthField({
  viewMode = false,
  disabledClasses = '',
  fieldName = 'placeOfBirth',
  nationalityName = 'nationality',
}) {
  const { register, watch, formState: { errors } } = useFormContext();
  const nationality = watch(nationalityName);
  const isVenezuelan = nationality === 'V';

  return (
    <div className="w-full">
      {isVenezuelan ? (
        <select
          disabled={viewMode}
          {...register(fieldName)}
          className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
        >
          <option className="bg-[#3c4042]" value="">Seleccionar estado...</option>
          {venezuelaStates.map((state) => (
            <option key={state.id} className="bg-[#3c4042]" value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          readOnly={viewMode}
          {...register(fieldName)}
          className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
        />
      )}

      {errors?.[fieldName] && <ErrorMessage msg={errors[fieldName].message} />}
    </div>
  );
}

export default PlaceOfBirthField;
