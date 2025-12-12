import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, User } from "lucide-react";
import { departments } from '../../utils/StaticData/departments-utils';
import { getStatusColor, getStatusName } from '../../utils/status-utils';  
import { departmentValidationSchema } from '../../utils/departmentValidationSchema';
import { useDepartments } from '../../context/DepartmentContext';
import { PencilIcon } from "@heroicons/react/24/solid";
import '../../Tables.css';

export default function DepartmentForm({ mode = 'create', department = null, onBack, onSave, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const { toggleDepartmentField } = useDepartments();
  

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(departmentValidationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });

  useEffect(() => {
    if (department && mode === 'edit' || mode === 'view') {
 
      reset({
        code: department?.code ?? '',
        departmentName: department?.departmentName ?? '',
      });
    } else if (mode === 'create') {

      // generar número de departamento automáticamente
      const maxNum = Math.max( 0,
        ...departments.map(e => {
          const num = parseInt(e.code) || 0;
          return num;
        })
      );
      const newNumDepartment = String(maxNum + 1);
      reset({
        code: '',
        departmentName: '',
      });
    }
  }, [department, mode, reset]);

  const onSubmit = async (data) => {
    if (onSave) await onSave(data);
  };

  const onError = (formErrors) => {
    console.warn('DepartmentForm validation errors:', formErrors);
    if (!formErrors) return;

  };
  
  const handleEditSave = async (formData) => {
    // Llamar al backend para actualizar aquí (PUT)
    if (onUpdate) onUpdate(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return <DepartmentForm mode="edit" department={department} onBack={() => setIsEditing(false)} onSave={handleEditSave} />;
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
            <h3 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? ( 'Editar Departamento' ):( 'Datos del Departamento')}</h3>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">
              <div>
                <label className="block text-xl font-medium text-gray-300 mt-1">Nombre Departamento: *</label>
              </div>
              <div>
                <input
                  readOnly={mode === 'view'}
                  {...register('departmentName')}
                  className={`w-full px-1 py-1 text-xl rounded-lg filter-input ${errors?.departmentName ? 'border-red-500' : ''}
                  ${mode === 'view' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-900'}`}
                />
                {errors?.departmentName && <p className="text-red-400 text-xs mt-1">{errors.departmentName.message}</p>}  
              </div>
              <div>
                <label className="block text-xl font-medium text-right text-gray-300 mt-1">Código: *</label>
              </div>
              <div>
                <input
                  readOnly={mode === 'view'}
                  {...register('code')}
                  className={`w-20 px-1 py-1 text-xl rounded-lg filter-input ${errors?.code ? 'border-red-500' : ''}
                    ${mode === 'view' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-900'}`}
                />
                {errors?.code && <p className="text-red-400 text-xs mt-1">{errors.code.message}</p>}  
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6"></div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button>
          {mode !== 'view' && (
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
              {mode === 'edit' ? 'Guardar cambios' : 'Crear Departamento'}
            </button>
          )}
        </div>
     </form>
    </div>
  );
}