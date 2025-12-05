import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowLeft, User } from "lucide-react";
import { employees } from '../../utils/employee-utils';
import { getStatusColor, getStatusName } from '../../utils/statusColor';  
import { employeeValidationSchema } from '../../utils/employeeValidationSchema';
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import { calculateAge } from '../../utils/calculateAge-utils';
import '../../Tables.css';

export default function EmployeeForm({ mode = 'create', employee = null, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
      { id: "personal", label: "Datos personales" },
      { id: "work", label: "Datos laborales" },
      { id: "contact", label: "Datos de contactos" },
    ];

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(employeeValidationSchema),
    defaultValues: {
      numEmployee: '',
      ci: '',
      firstName: '',
      secondName: '',
      lastName: '',
      secondLastName: '',
      birthDate: null,
      placeOfBirth: '',
      nationality: 'Venezolana',
      age: '',
      maritalStatus: 'Soltero',
      bloodType: 'O+',
      email: '',
      mobilePhone: '',
      homePhone: '',
      address: '',
      joinDate: null,
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

  // calcular edad automáticamente cuando cambie birthDate
  const watchedBirthDate = watch('birthDate');
  useEffect(() => {
    calculateAge(watchedBirthDate, setValue);
  }, [watchedBirthDate, setValue]);

  useEffect(() => {
    if (employee && mode === 'edit') {
      // Modo edición: cargar datos del empleado
      reset({
        numEmployee: employee.numEmployee ?? '',
        ci: employee.ci ?? '',
        firstName: employee.firstName ?? '',
        secondName: employee.secondName ?? '',
        lastName: employee.lastName ?? '',
        secondLastName: employee.secondLastName ?? '',
        birthDate: employee.birthDate ?? null,
        placeOfBirth: employee.placeOfBirth ?? '',
        nationality: employee.nationality ?? 'Venezolana',
        age: employee.age ?? '',
        maritalStatus: employee.maritalStatus ?? 'Soltero',
        bloodType: employee.bloodType ?? 'O+',
        email: employee.email ?? '',
        mobilePhone: employee.mobilePhone ?? '',
        homePhone: employee.homePhone ?? '',
        address: employee.address ?? '',
        joinDate: employee.joinDate ?? null,
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
    } else if (mode === 'create') {
      // Modo creación: generar número de empleado automáticamente
      const maxNum = Math.max( 0,
        ...employees.map(e => {
          const num = parseInt(e.numEmployee) || 0;
          return num;
        })
      );
      const newNumEmployee = String(maxNum + 1);

      reset({
        numEmployee: newNumEmployee,
        ci: '',
        firstName: '',
        secondName: '',
        lastName: '',
        secondLastName: '',
        birthDate: null,
        placeOfBirth: '',
        nationality: 'Venezolana',
        age: '',
        maritalStatus: 'Soltero',
        bloodType: 'O+',
        email: '',
        mobilePhone: '',
        homePhone: '',
        address: '',
        joinDate: new Date().toISOString().split('T')[0],
        department: '',
        subDepartment: '',
        position: '',
        status: true,
        useMeruLink: false,
        useHidCard: false,
        useLocker: false,
        useTransport: false,
        contacts: [],
      });
    }
  }, [employee, mode, reset]);

  const onSubmit = async (data) => {
    console.log('EmployeeForm onSubmit data:', data);
    if (onSave) await onSave(data);
  };

  const onError = (formErrors) => {
    console.warn('EmployeeForm validation errors:', formErrors);
    if (!formErrors) return;

    // Define which fields belong to each tab (order matters)
    const tabFieldMap = {
      personal: [
        'numEmployee', 'firstName', 'secondName', 'lastName', 'secondLastName',
        'birthDate', 'placeOfBirth', 'nationality', 'age', 'ci', 'maritalStatus',
        'bloodType', 'email', 'mobilePhone', 'homePhone', 'address'
      ],
      work: [ 'joinDate', 'department', 'subDepartment', 'position' ],
      contact: [ 'contacts' ]
    };

    // Helper to check if errors object has any key for given list
    const hasAnyError = (errs, keys) => {
      if (!errs) return false;
      for (const k of keys) {
        if (k === 'contacts') {
          if (errs.contacts) return true;
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(errs, k)) return true;
      }
      return false;
    };

    // Choose first tab (in order tabs[]) that has errors
    for (const t of tabs) {
      const keyList = tabFieldMap[t.id] || [];
      if (hasAnyError(formErrors, keyList)) {
        setActiveTab(t.id);
        return;
      }
    }

    setActiveTab('personal');
  };

  return (
    <div className="p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4 text-white-500" />
        </button>
      </div>
      <div className="table-container md:w-[1200px] md:min-h-[700px] rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center ml-2.5">
            <User className="w-20 h-20 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? ( 'Editar Empleado'):( 'Registrar Empleado')}</h3>
              {typeof register === 'function' ? (
                <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Primer Nombre: *</label>
                  </div>
                  <div>
                    <input
                      {...register('firstName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors?.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}  
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Segundo Nombre:</label>
                  </div>
                  <div>
                    <input
                      {...register('secondName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.secondName ? 'border-red-500' : ''}`}
                    />
                    {errors?.secondName && <p className="text-red-400 text-xs mt-1">{errors.secondName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Primer Apellido: *</label>
                  </div>
                  <div>
                    <input
                      {...register('lastName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors?.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Segundo Apellido:</label>
                  </div>
                  <div>
                    <input
                      {...register('secondLastName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.secondLastName ? 'border-red-500' : ''}`}
                    />
                    {errors?.secondLastName && <p className="text-red-400 text-xs mt-1">{errors.secondLastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">No. Empleado: *</label>
                  </div>
                  <div>
                    <input
                      {...register('numEmployee')}
                      className={`w-20 px-2 py-1 text-sm rounded-lg filter-input bg-gray-700 cursor-not-allowed`}
                    />
                  </div>
                </div>
              ) : (
                <div>
                <h3 className="text-3xl font-semibold text-white-800">
                  {`${employee?.numEmployee ?? ''} ${employee?.firstName ?? ''} ${employee?.secondName ?? ''} ${employee?.lastName ?? ''} ${employee?.secondLastName ?? ''}`}
                </h3>
                <p className="text-white-600 mt-1"> Cargo: {employee.position} </p>
                <p className="text-white-600 mt-1"> Departamento: {employee.department} </p></div>
              )}
            
          </div>
          {mode === 'edit' && (
            <div><label className="font-semibold">Estatus: </label>
                <span 
                className={`status-tag ${getStatusColor(employee.status)}`}
                >
                {getStatusName(employee.status)}
                </span>
            </div>
          )}
        </div>
      
        <div className="flex gap-4 mt-6 border-b border-gray-700">
          {tabs.map((tab) => {
            // determine if this tab currently has errors from formState.errors
            const tabError = (() => {
              if (!errors) return false;
              if (tab.id === 'contact') return !!errors.contacts;
              const personalKeys = ['numEmployee','firstName','secondName','lastName','secondLastName','birthDate','placeOfBirth','nationality','age','ci','maritalStatus','bloodType','email','mobilePhone','homePhone','address'];
              const workKeys = ['joinDate','department','subDepartment','position'];
              if (tab.id === 'personal') return personalKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              if (tab.id === 'work') return workKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              return false;
            })();

            return (
              <div key={tab.id} className="flex flex-col items-start"> 
                <button
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 border-b-2 transition-all text-xl font-bold text-white-700 mt-6 mb-2 p-2
                    ${activeTab === tab.id
                      ? "border-blue-500 text-[#9fd8ff]"
                      : "border-transparent text-gray-400 hover:text-gray-200"}
                  `}
                >
                  {tab.label}
                  {tabError && ( <p className="px-2 py-1 rounded-full text-xs font-semibold bg-red-255 text-red-400 hover:text-red-800">Tienes campos erróneos en esta pestaña</p> )}
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-6">     
            {activeTab === 'personal' && ( <PersonalData register={register} errors={errors} employee={employee} /> )}
            {activeTab === 'work' && ( <WorkData register={register} errors={errors} employee={employee} /> )}
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