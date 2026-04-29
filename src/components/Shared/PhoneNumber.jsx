import PhoneInput from "./PhoneInput";
import OptionSelect from "./OptionSelect";

function PhoneNumber ({ type, disabled, register, dinamicClasses, arrayCodes, setValue }) {
  return (
    <div className="flex flex-row">
      <select 
        disabled={disabled}
        {...register(`${type}Code`)} 
        className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${dinamicClasses}`}>
          {arrayCodes.map(code => (
            <OptionSelect key={`${type}-${code.id}`} value={code.code} text={code.code} />
          ))}
      </select>
      <PhoneInput type={type} readOnly={disabled} register={register} dinamicClasses={dinamicClasses} setValue={setValue} />
    </div>
  );
}

export default PhoneNumber;