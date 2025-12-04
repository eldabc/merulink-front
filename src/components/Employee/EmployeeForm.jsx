import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowLeft, User } from "lucide-react";
import { getStatusColor, getStatusName } from '../../utils/statusColor';  
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import * as yup from 'yup';
import '../../Tables.css';

// Validation schema (yup)
const schema = yup.object().shape({
  numEmployee: yup.string().required('No. Empleado es requerido'),
  ci: yup.string().required('Cédula es requerida'),
  name: yup.string().required('Nombre es requerido'),
  lastName: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  mobilePhone: yup.string().required('Teléfono móvil es requerido'),
  department: yup.string().required('Departamento es requerido'),
  position: yup.string().required('Cargo es requerido'),
  joinDate: yup.string().required('Fecha de ingreso es requerida'),
});

export default function EmployeeForm({ mode = 'create', employee = null, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
      { id: "personal", label: "Datos personales" },
      { id: "work", label: "Datos laborales" },
      { id: "contact", label: "Datos de contactos" },
    ];

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      numEmployee: '',
      ci: '',
      name: '',
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
    }
  });


  useEffect(() => {
    if (employee) {
      // normalize keys from employee-utils
      reset({
        numEmployee: employee.numEmployee ?? employee.numEmployee ?? '',
        ci: employee.ci ?? '',
        name: employee.name ?? '',
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
      <div className="table-container rounded-lg mt-4 shadow-md p-6 min-w-230 min-h-150 max-w-230 max-h-150">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21]">
          <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center ml-2.5">
            <User className="w-20 h-20 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? 'Editar Empleado' : 'Registrar Empleado'}</h2>
            <h3 className="text-3xl font-semibold text-white-800">
             { `${employee.numEmployee} ${employee.name} ${employee.lastName}`}
            </h3>
            <p className="text-white-600 mt-1"> Cargo: {employee.position} </p>
            <p className="text-white-600 mt-1"> Departamento: {employee.department} </p>
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
            {activeTab === 'contact' && ( <ContactData register={register} errors={errors} employee={employee} /> )}
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
