import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, User } from "lucide-react";
import { employees } from '../../utils/employee-utils';
import { getStatusColor, getStatusName } from '../../utils/status-utils';  
import { employeeValidationSchema } from '../../utils/employeeValidationSchema';
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import { calculateAge } from '../../utils/calculateAge-utils';
import { splitPhone } from '../../utils/phoneCodes-utils';
import '../../Tables.css';

export default function EmployeeForm({ mode = 'create', employee = null, onSave, onCancel, onToggleField }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
      { id: "personal", label: "Datos personales" },
      { id: "work", label: "Datos laborales" },
      { id: "contact", label: "Datos de contactos" },
    ];

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(employeeValidationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });

  // calcular edad cuando cambie birthDate
  const watchedBirthDate = watch('birthDate');
  useEffect(() => {
    calculateAge(watchedBirthDate, setValue);
  }, [watchedBirthDate, setValue]);

  useEffect(() => {
    if (employee && mode === 'edit') {
      const fullMobilePhone = employee.mobilePhone || '';
      const { code: mobileCode, number: mobileNumber } = splitPhone(fullMobilePhone);

      const fullHomePhone = employee.homePhone || '';
      const { code: homeCode, number: homeNumber } = splitPhone(fullHomePhone);
      reset({
        numEmployee: employee.numEmployee ?? '',
        ci: employee.ci ?? '',
        firstName: employee.firstName ?? '',
        secondName: employee.secondName ?? '',
        lastName: employee.lastName ?? '',
        secondLastName: employee.secondLastName ?? '',
        birthDate: employee.birthDate ?? null,
        placeOfBirth: employee.placeOfBirth ?? '',
        nationality: employee.nationality ?? 'V',
        age: employee.age ?? '',
        sex: employee.sex ?? 'M',
        maritalStatus: employee.maritalStatus ?? 'Soltero',
        bloodType: employee.bloodType ?? 'O+',
        email: employee.email ?? '',
        mobilePhoneCode: mobileCode || '0414',
        mobilePhone: mobileNumber ?? '',
        homePhoneCode: homeCode ?? '0286',
        homePhone: homeNumber ?? null,
        address: employee.address ?? '',
        joinDate: employee.joinDate ?? null,
        department: employee.department ?? '',
        subDepartment: employee.subDepartment ?? '',
        position: employee.position ?? '',
        userName: employee.userName ?? '',
        userPass: employee.userPass ?? '',
        changePassNextLogin: !!employee.changePassNextLogin,
        status: !!employee.status,
        useMeruLink: !!employee.useMeruLink,
        useHidCard: !!employee.useHidCard,
        useLocker: !!employee.useLocker,
        useTransport: !!employee.useTransport,
        contacts: employee.contacts ?? [],
      });
    } else if (mode === 'create') {
      // generar número de empleado automáticamente
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
        nationality: 'V',
        age: '',
        sex: 'M',
        maritalStatus: 'Soltero',
        bloodType: 'O+',
        email: '',
        mobilePhoneCode: '0414',
        mobilePhone: '',
        homePhoneCode: '0286',
        homePhone: null,
        address: '',
        joinDate: new Date().toISOString().split('T')[0],
        department: '',
        subDepartment: '',
        position: '',
        userName: '',
        userPass: '',
        changePassNextLogin: false,
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
    const submissionData = { ...data };

    //Armado números de teléfono
    if (submissionData.mobilePhone) { submissionData.mobilePhone = `${submissionData.mobilePhoneCode}-${submissionData.mobilePhone}`; }

    if (submissionData.homePhone) { 
        submissionData.homePhone = `${submissionData.homePhoneCode}-${submissionData.homePhone}`;
    } else {
        submissionData.homePhone = null; 
    }

    console.log('EmployeeForm data final:', submissionData);

    if (onSave) await onSave(submissionData);
  };

  const onError = (formErrors) => {
    console.warn('EmployeeForm validation errors:', formErrors);
    if (!formErrors) return;

    // Define which fields belong to each tab (order matters)
    const tabFieldMap = {
      personal: [
        'numEmployee', 'firstName', 'secondName', 'lastName', 'secondLastName',
        'birthDate', 'placeOfBirth', 'nationality', 'age', 'sex', 'ci', 'maritalStatus',
        'bloodType', 'email', 'mobilePhoneCode', 'mobilePhone', 'homePhoneCode', 'homePhone', 'address'
      ],
      work: [ 'joinDate', 'department', 'subDepartment', 'position', 'userName', 'userPass' ],
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
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4 text-white-500" />
        </button>
      </div>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
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
                <span className={`status-tag ${getStatusColor(employee.status)}`}  
                  onClick={(e) => {
                  e.stopPropagation();
                  onToggleField(employee.id, "status");
                }}>
                  {getStatusName(employee.status)}
                </span>
            </div>
          )}
        </div>
      
        <div className="flex flex-col md:flex-row gap-4 mt-6 border-b border-gray-700">
          {tabs.map((tab) => {
            // determine if this tab currently has errors from formState.errors
            const tabError = (() => {
              if (!errors) return false;
              if (tab.id === 'contact') return !!errors.contacts;
              const personalKeys = ['numEmployee','firstName','secondName','lastName','secondLastName','birthDate','placeOfBirth','nationality','age', 'sex','ci','maritalStatus','bloodType','email','mobilePhone','homePhone','address'];
              const workKeys = ['joinDate','department','subDepartment','position', 'userName', 'userPass'];
              if (tab.id === 'personal') return personalKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              if (tab.id === 'work') return workKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              return false;
            })();

            return (
              <div key={tab.id} className="flex flex-col items-center sm:items-center"> 
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