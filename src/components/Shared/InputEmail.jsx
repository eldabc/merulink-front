import { lowerOption } from '../../utils/text-utils';

function InputEmail ({ readOnly, name = 'email', register, disabledClasses, errorIndex }) {
  return (
    <div className="flex flex-col">
      <input
        type="email"
        readOnly={readOnly}
        {...register(name, lowerOption)}
        className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
        autoComplete="email"
        placeholder="Ingrese Correo"
      />
      {errorIndex?.message && <p className="text-sm text-red-500 mt-1">{errorIndex.message}</p>}
    </div>
  );
}

export default InputEmail;