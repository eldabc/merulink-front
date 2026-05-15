import OptionSelect from './OptionSelect';

function SelectGeneric({ 
  name,
  register, 
  disabled, 
  dynamicClasses, 
  errors, 
  dataSelect,
  placeholder = "Seleccionar..." 
}) {
  return (
    <div className="w-full">
      <select 
        disabled={disabled}
        {...register(name)}
        className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${dynamicClasses}`}
      >
        <OptionSelect text={placeholder} />
        {dataSelect.map((item, index) => (
          <OptionSelect key={`${name}-${index}`} value={item.value} text={item.label} />
        ))}
      </select>
      
      {errors[name] && <ErrorMessage msg={errors[name].message} />}
      {/* <p className="text-red-500 text-sm mt-1">{errors[name].message}</p> */}
    </div>
  );
}

export default SelectGeneric;