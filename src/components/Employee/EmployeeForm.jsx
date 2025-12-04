import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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

  const [activeTab, setActiveTab] = useState('personal');

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
    <div className="table-container">
      <h2 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? 'Editar Empleado' : 'Registrar Empleado'}</h2>

      <div className="mb-4">
        <div className="flex gap-2">
          <button type="button" className={`px-4 py-2 rounded-t-lg ${activeTab === 'personal' ? 'bg-white text-sky-300' : 'bg-gray-300 text-gray-300'}`} onClick={() => setActiveTab('personal')}>Personal</button>
          <button type="button" className={`px-4 py-2 rounded-t-lg ${activeTab === 'laboral' ? 'bg-white text-sky-300' : 'bg-gray-700 text-gray-300'}`} onClick={() => setActiveTab('laboral')}>Laboral</button>
          <button type="button" className={`px-4 py-2 rounded-t-lg ${activeTab === 'contacto' ? 'bg-white text-sky-300' : 'bg-gray-700 text-gray-300'}`} onClick={() => setActiveTab('contacto')}>Contacto</button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-b-lg p-4">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">No. Empleado *</label>
                <input {...register('numEmployee')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.numEmployee ? 'border-red-500' : ''}`} />
                {errors.numEmployee && <p className="text-red-400 text-xs mt-1">{errors.numEmployee.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Cédula *</label>
                <input {...register('ci')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.ci ? 'border-red-500' : ''}`} />
                {errors.ci && <p className="text-red-400 text-xs mt-1">{errors.ci.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
                <input {...register('name')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.name ? 'border-red-500' : ''}`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Apellido *</label>
                <input {...register('lastName')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.lastName ? 'border-red-500' : ''}`} />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
          )}

          {activeTab === 'laboral' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Departamento *</label>
                <select {...register('department')} className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 ${errors.department ? 'border-red-500' : ''}`}>
                  <option value="">Seleccionar...</option>
                  <option value="TI">TI</option>
                  <option value="RRHH">RRHH</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Marketing">Marketing</option>
                </select>
                {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sub-Departamento</label>
                <input {...register('subDepartment')} className="w-full px-3 py-2 rounded-lg filter-input" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Cargo *</label>
                <input {...register('position')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.position ? 'border-red-500' : ''}`} />
                {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Ingreso *</label>
                <input type="date" {...register('joinDate')} className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 ${errors.joinDate ? 'border-red-500' : ''}`} />
                {errors.joinDate && <p className="text-red-400 text-xs mt-1">{errors.joinDate.message}</p>}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" {...register('status')} className="w-4 h-4 rounded" />
                  <span className="text-sm">Activo</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" {...register('useMeruLink')} className="w-4 h-4 rounded" />
                  <span className="text-sm">Usar MeruLink</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" {...register('useHidCard')} className="w-4 h-4 rounded" />
                  <span className="text-sm">Usar HID Card</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" {...register('useLocker')} className="w-4 h-4 rounded" />
                  <span className="text-sm">Usar Locker</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" {...register('useTransport')} className="w-4 h-4 rounded" />
                  <span className="text-sm">Usar Transporte</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'contacto' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                <input {...register('email')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono Móvil *</label>
                <input {...register('mobilePhone')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors.mobilePhone ? 'border-red-500' : ''}`} />
                {errors.mobilePhone && <p className="text-red-400 text-xs mt-1">{errors.mobilePhone.message}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">{mode === 'edit' ? 'Guardar cambios' : 'Crear empleado'}</button>
        </div>
      </form>
    </div>
  );
}
