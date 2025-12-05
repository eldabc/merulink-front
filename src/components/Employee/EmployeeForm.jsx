import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowLeft, User } from "lucide-react";
import { getStatusColor, getStatusName } from '../../utils/statusColor';  
import { employeeValidationSchema } from '../../utils/employeeValidationSchema';
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import '../../Tables.css';

export default function EmployeeForm({ mode = 'create', employee = null, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
      { id: "personal", label: "Datos personales" },
      { id: "work", label: "Datos laborales" },
      { id: "contact", label: "Datos de contactos" },
    ];

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(employeeValidationSchema),
    defaultValues: {
      numEmployee: '',
      ci: '',
      firstName: '',
      secondName: '',
      lastName: '',
      placeOfBirth: '',
      nationality: 'Venezolana',
      age: '',
      maritalStatus: 'Soltero',
      bloodType: 'O+',
      email: '',
      mobilePhone: '',
      homePhone: '',
      address: '',
      joinDate: '',
      department: '',
      subDepartment: '',
      position: '',
      status: true,
      useMeruLink: false,
      useHidCard: false,
      useLocker: false,
      useTransport: false,
      contacts: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });


  useEffect(() => {
    if (employee) {
      // normalize keys from employee-utils
      reset({
        numEmployee: employee.numEmployee ?? employee.numEmployee ?? '',
        ci: employee.ci ?? '',
        firstName: employee.firstName ?? '',
        secondName: employee.secondName ?? '',
        lastName: employee.lastName ?? '',
        placeOfBirth: employee.placeOfBirth ?? '',
        nationality: employee.nationality ?? 'Venezolana',
        age: employee.age ?? '',
        maritalStatus: employee.maritalStatus ?? 'Soltero',
        bloodType: employee.bloodType ?? 'O+',
        email: employee.email ?? '',
        mobilePhone: employee.mobilePhone ?? '',
        homePhone: employee.homePhone ?? '',
        address: employee.address ?? '',
        joinDate: employee.joinDate ?? '',
        department: employee.department ?? '',
        subDepartment: employee.subDepartment ?? '',
        position: employee.position ?? '',
        status: !!employee.status,
        useMeruLink: !!employee.useMeruLink,
        useHidCard: !!employee.useHidCard,
        useLocker: !!employee.useLocker,
        useTransport: !!employee.useTransport,
        contacts: employee.contacts ?? [],
      });
    } else {
      reset();
    }
  }, [employee, reset]);

  // If mode is 'view', we won't render the form (parent can render EmployeeDetail)
  // But to keep API simple, we still provide the form; caller can choose mode.

  const onSubmit = async (data) => {
    if (onSave) await onSave(data);
  };

  return (
    <div className="p-2 rounded-lg">
     <form onSubmit={handleSubmit(onSubmit)}>
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4 text-white-500" />
        </button>
      </div>
      <div className="table-container md:w-[1300px] md:min-h-[700px] rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center ml-2.5">
            <User className="w-20 h-20 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? 'Editar Empleado' : 'Registrar Empleado'}</h3>
              {typeof register === 'function' ? (
                <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Primer Nombre:</label>
                  </div>
                  <div>
                    <input
                      {...register('firstName', { required: true, maxLength: 20 })}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors?.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}  
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Segundo Nombre:</label>
                  </div>
                  <div>
                    <input
                      {...register('secondName', { required: true })}
                      defaultValue={employee?.secondName ?? ''}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.secondName ? 'border-red-500' : ''}`}
                    />
                    {errors?.secondName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Primer Apellido:</label>
                  </div>
                  <div>
                    <input
                      {...register('firstLastName')}
                      defaultValue={employee?.firstLastName ?? employee?.lastName ?? ''}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.firstLastName ? 'border-red-500' : ''}`}
                    />
                    {errors?.firstLastName && <p className="text-red-400 text-xs mt-1">{errors.firstLastName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Segundo Apellido:</label>
                  </div>
                  <div>
                    <input
                      {...register('secondLastName')}
                      defaultValue={employee?.secondLastName ?? ''}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.secondLastName ? 'border-red-500' : ''}`}
                    />
                    {errors?.secondLastName && <p className="text-red-400 text-xs mt-1">{errors.secondLastName.message}</p>}
                  </div>
                </div>
              ) : (
                <div>
                <h3 className="text-3xl font-semibold text-white-800">
                  {`${employee?.numEmployee ?? ''} ${employee?.firstName ?? employee?.firstName ?? ''} ${employee?.secondName ?? ''} ${employee?.firstLastName ?? employee?.lastName ?? ''} ${employee?.secondLastName ?? ''}`}
                </h3>
                <p className="text-white-600 mt-1"> Cargo: {employee.position} </p>
                <p className="text-white-600 mt-1"> Departamento: {employee.department} </p></div>
              )}
            
          </div>
          {mode === 'edit' && (
            <div><label className="font-semibold">Estatus: </label>
                <span 
                className={`status-tag ${getStatusColor(employee.status)}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleField(employee.id, "status");
                }}
                >
                {getStatusName(employee.status)}
                </span>
            </div>
          )}
        </div>
      
        <div className="flex gap-4 mt-6 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              type='button'
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border-b-2 transition-all text-xl font-bold text-white-700 mt-6 mb-2 p-2
                ${activeTab === tab.id
                  ? "border-blue-500 text-[#9fd8ff]"
                  : "border-transparent text-gray-400 hover:text-gray-200"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">     
            {activeTab === 'personal' && ( <PersonalData register={register} errors={errors} employee={employee} /> )}
            {activeTab === 'work' && ( <WorkData register={register} errors={errors} employee={employee} onToggleField={false} /> )}
            {activeTab === 'contact' && ( <ContactData register={register} errors={errors} employee={employee} fields={fields} append={append} remove={remove} /> )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">{mode === 'edit' ? 'Guardar cambios' : 'Crear empleado'}</button>
        </div>
     </form>
    </div>
  );
}
