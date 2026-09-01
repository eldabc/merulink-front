import { formatPhone } from "../../utils/global-utils";

const PhoneInput = ({ type = 'mobilePhone', dynamicNumberName, readOnly, register, dinamicClasses, setValue }) => {

  const fieldName = dynamicNumberName ?? type;

  const handleChange = (e) => {
    const rawValue = e.target.value;
    
    // Aplicar el formato
    const formatted = formatPhone(rawValue, type);
    
    // Solo cambia si no excede el largo máximo
    const maxLength = type === 'mobilePhone' ? 8 : 7; // Incluyendo guiones
    if (formatted.length <= maxLength) {
      setValue(fieldName, formatted, { shouldValidate: true });
    }
  };

  return (
    <input
      readOnly={readOnly}
      {...register(fieldName)}
      type="text"
      onChange={handleChange}
      placeholder={type === 'mobilePhone' ? '000-0000' : '0000000'}
      className={`w-full px-3 py-2 rounded-lg filter-input ${dinamicClasses}`} // md:w-55
    />
  );
};

export default PhoneInput;