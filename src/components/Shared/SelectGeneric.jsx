import { useFormContext } from "react-hook-form";

import OptionSelect from './OptionSelect';
import ErrorMessage from './ErrorMessage';

function SelectGeneric({ 
  name,
  disabled, 
  dynamicClasses, 
  dataSelect,
  placeholder = "Seleccionar..." 
}) {

  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="w-full">
      <select 
        disabled={disabled}
        {...register(name)}
        className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${dynamicClasses}`}
      >
        <OptionSelect text={placeholder} />
        {dataSelect?.map((item, index) => (
          <OptionSelect key={`${name}-${index}`} value={item?.value} text={item?.label} />
        ))}
      </select>
      
      {errors[name] && <ErrorMessage msg={errors[name].message} />}
    </div>
  );
}

export default SelectGeneric;