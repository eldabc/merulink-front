import { useFormContext } from "react-hook-form";
import OptionSelect from './OptionSelect';

function SelectDepartment({ disabled, dynamicClasses, departments = [], loading }) {
    const { register, formState: { errors } } = useFormContext();
 
  return (
    <div>
      <select 
        disabled= {disabled}
        {...register('departmentId')} 
        className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${dynamicClasses}`}>

          <OptionSelect text={ loading ? "Cargando..." : "Seleccionar..."} />

          {departments.map((dep, index) => (
            <OptionSelect key={`departmentId-${dep.id}-${index}`} value={dep.id} text={dep.departmentName} />
          ))}
      </select>
      {errors?.departmentId && <ErrorMessage msg={errors.departmentId.message} />}  
    </div>
  );
}

export default SelectDepartment;    