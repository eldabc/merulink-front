import PhoneInput from "./PhoneInput";
import OptionSelect from "./OptionSelect";

function PhoneNumber ({ type, number, codeNumber, disabled, register, dinamicClasses, arrayCodes, setValue }) {
  const numberField = number ?? type;
  const codeField = codeNumber ?? `${type}Code`;

  return (
    <div className="flex flex-row gap-2">
      <select 
        disabled={disabled}
        {...register(codeField)} 
        className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${dinamicClasses}`}>
          {arrayCodes.map(code => (
            <OptionSelect key={`${codeField}-${code.id}`} value={code.code} text={code.code} />
          ))}
      </select>
      <PhoneInput name={numberField} type={type} readOnly={disabled} register={register} dinamicClasses={dinamicClasses} setValue={setValue} />
    </div>
  );
}

export default PhoneNumber;