import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, User } from "lucide-react";
import { departments } from '../../utils/ExampleData/departments-utils';
import { getStatusColor, getStatusName } from '../../utils/status-utils';  
import { departmentValidationSchema } from '../../utils/departmentValidationSchema';
import { useDepartments } from '../../context/DepartmentContext';
import '../../Tables.css';

export default function DepartmentForm({ department = null, onBack, onUpdate, mode = 'create' }) {
  console.log('Mode', mode);
  const { toggleDepartmentField } = useDepartments();
  const [activeTab, setActiveTab] = useState('personal');

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(departmentValidationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });

  useEffect(() => {
    if (department && mode === 'edit') {
 
      reset({
        code: department.code ?? '',
        departmentName: department.departmentName ?? '',
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

    // // Define which fields belong to each tab (order matters)
    // const tabFieldMap = {
    //   personal: [
    //     'code', 'departmentName', 'secondName', 'lastName', 'secondLastName',
    //     'birthDate', 'placeOfBirth', 'nationality', 'age', 'sex', 'ci', 'maritalStatus',
    //     'bloodType', 'email', 'mobilePhoneCode', 'mobilePhone', 'homePhoneCode', 'homePhone', 'address'
    //   ],
    //   work: [ 'joinDate', 'department', 'subDepartment', 'position'],
    //   meruLink: ['userName', 'userPass' ],
    //   contact: [ 'contacts' ]
    // };

    // // Helper to check if errors object has any key for given list
    // const hasAnyError = (errs, keys) => {
    //   if (!errs) return false;
    //   for (const k of keys) {
    //     if (k === 'contacts') {
    //       if (errs.contacts) return true;
    //       continue;
    //     }
    //     if (Object.prototype.hasOwnProperty.call(errs, k)) return true;
    //   }
    //   return false;
    // };

    // // Choose first tab (in order tabs[]) that has errors
    // for (const t of tabs) {
    //   const keyList = tabFieldMap[t.id] || [];
    //   if (hasAnyError(formErrors, keyList)) {
    //     setActiveTab(t.id);
    //     return;
    //   }
    // }

    setActiveTab('personal');
  };

  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4 text-white-500" />
        </button>
      </div>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-30 h-30 overflow-hidden flex items-center justify-center ml-2.5"></div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? ( 'Editar Departamento' ):( 'Datos del Departamento')}</h3>
              {typeof register === 'function' ? (
                <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Departamento: *</label>
                  </div>
                  <div>
                    <input
                      {...register('departmentName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.departmentName ? 'border-red-500' : ''}`}
                    />
                    {errors?.departmentName && <p className="text-red-400 text-xs mt-1">{errors.departmentName.message}</p>}  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Código: *</label>
                  </div>
                  <div>
                    <input
                      {...register('code')}
                      className={`w-20 px-2 py-1 text-sm rounded-lg filter-input bg-gray-700 cursor-not-allowed`}
                    />
                  </div>
                </div>
              ) : (
                <div>
                <h3 className="text-3xl font-semibold text-white-800">
                 Vista Detalle
                </h3>
                <p className="text-white-600 mt-1"> Código: {department.code} </p>
                <p className="text-white-600 mt-1"> Departamento: {department.department} </p></div>
              )}
          </div>
        </div>
        <div className="mt-6">     
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onBack} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">{mode === 'edit' ? 'Guardar cambios' : 'Crear departamento'}</button>
        </div>
     </form>
    </div>
  );
}