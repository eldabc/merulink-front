import { useFormContext } from "react-hook-form";

function ToggleGeneric({ name, textOn, textOff, readOnly, dynamicClasses }) { 

  const { register, watch, setValue, formState: { errors } } = useFormContext();

  const currentStatus = watch(name);
  const isActive = currentStatus === 'Nocturno'; // Indica si el checkbox esta visualmente "on"
  
  const handleToggle = () => {
    if (readOnly) return;

    // Alterna manualmente entre los dos valores del diccionario
    const nextStatus = currentStatus === 'Nocturno' ? 'Diurno' : 'Nocturno';
    setValue(name, nextStatus, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <>
    <div className="flex items-center justify-center gap-3 mt-2 mb-2">
      <span className={`text-xs ${!isActive ? 'text-amber-400 font-bold' : 'text-gray-500'}`}>
        {textOff}
      </span>

      <div 
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer duration-500 ease-in-out transition-colors 
          ${ isActive ? 'bg-green-600' : 'bg-gray-600' } 
          ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white duration-500 ease-in-out transition-transform 
            ${ isActive ? 'translate-x-5' : 'translate-x-1' }`}
        />
      </div>

      <span className={`text-xs ${isActive ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
        {textOn}
      </span>

      {/* Mantiene el valor real para el formulario */}
      <input type="hidden" {...register(name)} />

    </div>
    </>
  );
}

export default ToggleGeneric;