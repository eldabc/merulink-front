import { useFormContext } from "react-hook-form";

import ErrorMessage from './ErrorMessage.jsx';

function ButtonRadioGeneric({ name = "eventType", disabled = false, dynamicClasses, optionOne, optionTwo }) {
  const { register, watch, formState: { errors } } = useFormContext();
  
  return (
    <>
    <div className="flex gap-4 w-full justify-center bg-field rounded-xl">
      <label className="flex items-center gap-2 cursor-pointer p-1">
        <input
          className={`h-4 w-4 ${dynamicClasses}`}
          type="radio"
          value={optionOne.value}
          {...register(name)}
          disabled={disabled}
        />
        {optionOne.label}
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          className={`h-4 w-4 ${dynamicClasses}`}
          type="radio"
          value={optionTwo.value}
          {...register(name)}
          disabled={disabled}
        />
        {optionTwo.label}
      </label>
      
    </div>
    {errors?.[name] && <ErrorMessage msg={errors?.[name].message} /> }  </>
  );
}

export default ButtonRadioGeneric;