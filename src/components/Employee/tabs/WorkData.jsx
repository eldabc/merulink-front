import { useEffect, useState } from 'react';

import { useEmployees } from '../../../context/EmployeeContext';
import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from '../../Shared/ErrorMessage';
import SpanText from '../../Shared/SpanText';

export default function WorkData({ createMode, viewMode, isEmployeeActive, disabledClasses, register, errors, employee, availableDepartments, loadingData, selectedDepartmentId, subDepartments, positions }) {
  
  const { loadingFieldChange, toggleEmployeeField } = useEmployees();

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
              disabled={viewMode} {...register('department')} 
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
          {subDepartments?.length > 0  ? ( 
            <select 
                disabled={viewMode || !selectedDepartmentId || subDepartments.length === 0} {...register('subDepartment')} 
                className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 
                  ${(!selectedDepartmentId || subDepartments.length === 0) && 'cursor-not-allowed'} ${disabledClasses}`}
            >
              <option className="bg-[#3c4042]" value="0"> {loadingData ? "Cargando..." : "Seleccionar..."} </option>
              {subDepartments?.map((item) => ( 
                <option key={item.id} value={item.id} className='bg-[#3c4042]'> {item.name} </option>
              ))}
            </select> 
          ) : (
            <SpanText text="No Aplica" />
          )}
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

        <div className='flex flex-row'>

          <div className="flex items-center gap-4 pl-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <span className="text-sm">¿Usa Transporte?</span>
                {loadingFieldChange.loading && loadingFieldChange.field === 'use_transport' ? (
                  <span className="text-xs text-gray-500 italic">Cargando...</span>
                ) : (
                  <input 
                  disabled={!isEmployeeActive }//|| viewMode
                  type="checkbox" {...register('useTransport')} className={`w-4 h-4 rounded ${!isEmployeeActive && disabledClasses}`} 
                  onClick={() => !createMode && toggleEmployeeField(employee, "use_transport")} />
                )}
            </label>
          </div>
        </div>
      </div>
    );
}
