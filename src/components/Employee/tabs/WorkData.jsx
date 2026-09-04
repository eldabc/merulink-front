import { useFormContext } from 'react-hook-form';

import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from '../../Shared/ErrorMessage';
import SpanText from '../../Shared/SpanText';

export default function WorkData({ viewMode, disabledClasses, employee, availableDepartments, loadingData, selectedDepartmentId, subDepartments, positions }) {
  
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const showNotApply = subDepartments?.length === 0 || (viewMode && !employee?.subDepartment?.id);

  const deptField = register('department');

  // Sincroniza los checkboxes en tab MeruLink: quita el departamento anterior y marca el nuevo.
  const handleDepartmentChange = (e) => {
    const prevId = Number(watch('department')) || null;
    deptField.onChange(e); // primero: react-hook-form actualiza 'department'
    const newId = Number(e.target.value);
    if (viewMode || !newId || newId === prevId) return;

    const currentList = (watch('departmentCollectedIds') || []).map(Number);
    let next = currentList;
    if (prevId) next = next.filter((d) => d !== prevId); // desmarcar el anterior
    if (!next.includes(newId)) next = [...next, newId];  // marcar el nuevo
    setValue('departmentCollectedIds', next, { shouldDirty: true });
  };

     return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border div-border">
        <div>
          <LabelFieldForm field="Fecha de Ingreso" simbol="*"/>
            <input 
              readOnly={viewMode} 
              type="date" {...register('joinDate')} 
              className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} 
            />
          {errors.joinDate && <ErrorMessage msg={errors.joinDate.message} />}
        </div>
        
        <div>
          <LabelFieldForm field="Departamento" simbol="*"/>
            <select 
              disabled={viewMode} {...deptField} onChange={handleDepartmentChange}
              className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
            >
              <option className="bg-[#3c4042]" value=""> {loadingData ? "Cargando..." : "Seleccionar..."} </option>
              {availableDepartments.map((item) => ( 
                <option key={item.id} value={item.id} className='bg-[#3c4042]'> {item.departmentName} </option>
              ))}
            </select>
          {errors.department && <ErrorMessage msg={errors.department.message} />}
        </div>

        <div>

          <LabelFieldForm field="Sub-Departamento" /> 
          <div>
            {showNotApply ? (
              <SpanText text="No Aplica" dinamicClasses="inline-block mt-2 px-2" />
            ) : (
              <>
                <select 
                  disabled={viewMode || !selectedDepartmentId} 
                  {...register('subDepartment')}
                  className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 
                    ${!selectedDepartmentId ? 'cursor-not-allowed' : ''} ${disabledClasses}`}
                >
                  <option className="bg-[#3c4042]" value="0">
                    {loadingData ? "Cargando..." : "Seleccionar..."}
                  </option>
                  {subDepartments?.map((item) => ( 
                    <option key={item.id} value={item.id} className='bg-[#3c4042]'>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors?.subDepartment && <ErrorMessage msg={errors.subDepartment.message} />}
              </>
            )}
          </div>
        </div>

        <div>
          <LabelFieldForm field="Cargo" simbol="*"/>
          {positions?.length > 0 ? (
            <select 
              disabled={viewMode } {...register('position')} 
              className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
            >
              <option className="bg-[#3c4042]" value=""> {loadingData ? "Cargando..." : "Seleccionar..."} </option>
              {positions.map((item) => ( 
                <option key={item.id} value={item.id} className='bg-[#3c4042]'> {item.name} </option>
              ))}
            </select>  
          ) : (
            <SpanText text="Sin cargos registrados" />
          )}
          {errors.position && <ErrorMessage msg={errors.position.message} />}
        </div>
      </div>
    );
}
