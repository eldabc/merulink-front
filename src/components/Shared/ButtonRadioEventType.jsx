import { useFormContext } from "react-hook-form";

import ErrorMessage from './ErrorMessage.jsx';

function ButtonRadioEventType({ name = "eventType", disabled = false, dynamicClasses }) {
  const { register, watch, formState: { errors } } = useFormContext();

  const selected = watch(name);
  
  return (
    <>
    <div className="flex gap-4 w-full justify-center bg-field rounded-xl">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          className={`${dynamicClasses}`}
          type="radio"
          value="paid"
          {...register(name)}
          checked={selected === "paid"}
          disabled={disabled}
        />
        Pagado
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          className={`${dynamicClasses}`}
          type="radio"
          value="courtesy"
          {...register(name)}
          checked={selected === "courtesy"}
          disabled={disabled}
        />
        Cortesía
      </label>
      
    </div>
    {errors?.[name] && <ErrorMessage msg={errors?.[name].message} /> }  </>
  );
}

export default ButtonRadioEventType;