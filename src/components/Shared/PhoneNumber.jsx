import PhoneInput from "./PhoneInput";
import OptionSelect from "./OptionSelect";

// Gestina números de teléfono fijos y móviles
function PhoneNumber ({ type, disabled, register, dynamicClasses, arrayCodes, setValue }) {
  return (
    <div className="flex flex-row">
      <select 
        disabled={disabled}
        {...register(`${type}Code`)} 
        className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${dynamicClasses}`}
      >
          {arrayCodes.map(code => (
            <OptionSelect key={`${type}-${code.id}`} value={code.code} text={code.code} />
          ))}
      </select>
      <PhoneInput type={type} readOnly={disabled} register={register} dynamicClasses={dynamicClasses} setValue={setValue} />
    </div>
  );
}

export default PhoneNumber;