import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, User } from "lucide-react";
import { subDepartments } from '../../utils/StaticData/subDepartments-utils';
import { departments } from '../../utils/StaticData/departments-utils';
// import { getStatusColor, getStatusName } from '../../utils/status-utils';  
import { subDepartmentValidationSchema } from '../../utils/Validations/subDepartmentValidationSchema';
import { useSubDepartments } from '../../context/SubDepartmentContext';
import { PencilIcon } from "@heroicons/react/24/solid";
import '../../Tables.css';

export default function SubDepartmentForm({ mode = 'create', subDepartment = null, onBack, onSave, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false); 
  const { toggleDepartmentField } = useSubDepartments();

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(subDepartmentValidationSchema),
  });

  // Generar código subdepartamento
  const generateNewCode = (departmentId) => {
    // convertir a número
    const depIdNum = parseInt(departmentId, 10);
    if (isNaN(depIdNum) || depIdNum <= 0) return '';

    const countSubDepartments = subDepartments.filter(sub => sub.departmentId === depIdNum).length;

    const newSubCodeSuffix = countSubDepartments + 1;
    const newCode = `${depIdNum}${newSubCodeSuffix}`;

    return String(newCode);
  };

  // Al seleccionar departamento
  const handleDepartmentChange = (e) => {
    const selectedDepartmentId = e.target.value;
    
    // establecer valor en react-hook-form
    setValue('department', selectedDepartmentId, { shouldValidate: true });

    if (selectedDepartmentId) {       
      const newCode = generateNewCode(selectedDepartmentId);
      setValue('code', newCode, { shouldValidate: true });
    } else {
      setValue('code', '', { shouldValidate: true });
    }
  };

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'contacts',
  // });

  useEffect(() => {
    if (subDepartment && mode === 'edit' || mode === 'view') {
 
      reset({
        code: subDepartment?.code ?? '',
        subDepartmentName: subDepartment?.subDepartmentName ?? '',
        departmentName: subDepartment?.departmentName ?? '',
      });
    } else if (mode === 'create') {

      // generar número de departamento automáticamente
      // const maxNum = Math.max( 0,
      //   ...subDepartments.map(d => {
      //     const num = parseInt(d.code) || 0;
      //     return num;
      //   })
      // );
      // const newNumDepartment = String(maxNum + 1);
      reset({
        code: '',
        subDepartmentName: '',
        departmentName: '',
      });
    }
  }, [subDepartment, mode, reset]);

  const onSubmit = async (data) => {
    if (onSave) await onSave(data);
  };

  const onError = (formErrors) => {
    console.warn('SubDepartmentForm validation errors:', formErrors);
    if (!formErrors) return;
  };
  
  const handleEditSave = async (formData) => {
    // Llamar al backend para actualizar aquí (PUT)
    if (onUpdate) onUpdate(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return <SubDepartmentForm mode="edit" subDepartment={subDepartment} onBack={() => setIsEditing(false)} onSave={handleEditSave} />;
  }

  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        <button onClick={() => setIsEditing(true)} className="buttons-bar-btn flex text-3xl font-semibold" title="Editar">
          <PencilIcon className="w-4 h-4 text-white-500" />
        </button>
        <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4 text-white-500" />
        </button>
      </div>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-30 h-10 overflow-hidden flex items-center justify-center ml-2.5"></div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? ( 'Editar Sub-Departamento' ):( 'Datos Sub-Departamento')}</h3>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1"> Departamento: *</label>
              </div>
              <div>
                <select 
                  disabled= {mode === 'view'}
                  {...register('department', { onChange: handleDepartmentChange })} 
                  className={`text-xl w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.department ? 'border-red-500' : ''}
                   ${mode === 'view' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-900'}`}>
                  <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                    {departments.map(dep => (
                      <option key={`department-${dep.id}`} className='bg-[#3c4042]' value={dep.id}>{dep.departmentName}</option>
                    ))}
                </select>
                {errors?.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}  
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1">Nombre Sub-Departamento: *</label>
              </div>
              <div>
                <input
                  readOnly={mode === 'view'}
                  {...register('subDepartmentName')}
                  className={`w-full px-1 py-1 text-xl rounded-lg filter-input ${errors?.subDepartmentName ? 'border-red-500' : ''}
                  ${mode === 'view' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-900'}`}
                />
                {errors?.subDepartmentName && <p className="text-red-400 text-xs mt-1">{errors.subDepartmentName.message}</p>}  
              </div>
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1">Código: *</label>
              </div>
              <div>
                <input
                  readOnly={true}
                  {...register('code')}
                  className={`w-20 px-1 py-1 text-xl rounded-lg filter-input bg-gray-700 text-gray-300 cursor-not-allowed ${errors?.code ? 'border-red-500' : ''}`}
                />
                {errors?.code && <p className="text-red-400 text-xs mt-1">{errors.code.message}</p>}  
              </div>
            </div>
          </div>
        </div>
        {subDepartment?.useSubDepartments && (
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4 text-white">Sub-Departamentos</h3>
            <div className="rounded-lg shadow">
              <table className="min-w-full border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="tr-thead-table">
                    <th className="px-4 py-3 text-left font-semibold">Código</th>
                    <th className="px-4 py-3 text-left font-semibold">Sub-Departamento</th>
                  </tr>
                </thead>
                <tbody>
                  {subDepartment.useSubDepartments.map((dep) => (
                    <tr className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                      <td className="px-4 py-3 text-white-800 font-medium">{dep.code}</td>
                      <td className="px-4 py-3 text-white-700">{dep.subDepartmentName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button>
        {mode !== 'view' && (
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            {mode === 'edit' ? 'Guardar cambios' : 'Crear Sub-Departamento'}
          </button>
        )}
      </div>
     </form>
    </div>
  );
}