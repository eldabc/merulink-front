import PhoneInput from "./PhoneInput";
import OptionSelect from "./OptionSelect";
import { Controller } from "react-hook-form";

function PhoneNumberEventContact ({ type, numberName, codeNumberName, disabled, register, control, dinamicClasses, arrayCodes, setValue }) {
  
  const codeField = codeNumberName ?? `${type}Code`;
  const numberField = numberName ?? type;

  return (
    <div className="flex flex-row gap-2">
      <Controller
        name={codeField}
        control={control}
        render={({ field }) => (
          <select 
            disabled={disabled}
            {...field}
            className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${dinamicClasses}`}>
            {arrayCodes.map(code => (
              <OptionSelect key={`${codeField}-${code.id}`} value={code.code} text={code.code} />
            ))}
          </select>
        )}
      />
      <PhoneInput dynamicNumberName={numberField} type={type} readOnly={disabled} register={register} dinamicClasses={dinamicClasses} setValue={setValue} />
    </div>
  );
}

export default PhoneNumberEventContact;