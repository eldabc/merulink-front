import { useEffect, useState } from 'react';

import { useEmployees } from '../../../context/EmployeeContext';
import LabelFieldForm from "../../Shared/LabelFieldForm";

export default function WorkData({ createMode, viewMode, isEmployeeActive, cursorNotAllowed, register, errors, employee, tempFlags, setTempFlags, availableDepartments, loadingData }) {
  const { toggleEmployeeField } = useEmployees();

     return (
      <div className="
        grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded border border-[#ffffff21]
        md:[&>*:nth-child(2n)]:border-l md:[&>*:nth-child(2n)]:border-[#ffffff21]
        md:[&>*:nth-child(2n)]:pl-4">
        <div>
          <LabelFieldForm field="Fecha de Ingreso" simbol="*"/>
            <input 
              readOnly={viewMode} 
              type="date" {...register('joinDate')} 
              className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 ${cursorNotAllowed}`} 
            />
          {errors.joinDate && <p className="text-red-400 text-xs mt-1">{errors.joinDate.message}</p>}
        </div>
        
        <div>
          <LabelFieldForm field="Departamento" simbol="*"/>
            <select 
              disabled={viewMode} {...register('department')} 
              className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed}`}
            >
              <option className="bg-[#3c4042]" value=""> {loadingData ? "Cargando..." : "Seleccionar..."} </option>
              {availableDepartments.map((item) => ( 
                <option key={item.id} value={item.id} className='bg-[#3c4042]'> {item.departmentName} </option>
              ))}
            </select>
          {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
        </div>

        <div>
          <LabelFieldForm field="Sub-Departamento" />
          <input 
            readOnly={viewMode} 
            {...register('subDepartment')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`}
          />
        </div>

        <div>
          <LabelFieldForm field="Cargo" simbol="*"/>
            <input 
              readOnly={viewMode} 
              {...register('position')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} 
            />
          {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}
        </div>

        <div className='flex flex-row'>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <span className="text-sm">¿Usa HID Card?</span>
              <input 
               disabled={!isEmployeeActive }// || viewMode
                type="checkbox" {...register('useHidCard')} className={`w-4 h-4 rounded ${!isEmployeeActive && cursorNotAllowed}`} 
                onClick={() => !createMode && toggleEmployeeField(employee?.id, "useHidCard")} />
            </label>
          </div>

          <div className="flex items-center gap-4 pl-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <span className="text-sm">¿Usa Locker?</span>
            <input 
              disabled={!isEmployeeActive }//|| viewMode
              type="checkbox" 
              {...register('useLocker')} 
              className={`w-4 h-4 rounded ${!isEmployeeActive && cursorNotAllowed}`} 
              onClick={() => !createMode && toggleEmployeeField(employee?.id, "useLocker")} 
               /> 
            </label>
          </div>
          <div className="flex items-center gap-4 pl-4">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <span className="text-sm">¿Usa Transporte?</span>
              <input 
                disabled={!isEmployeeActive }//|| viewMode
                type="checkbox" {...register('useTransport')} className={`w-4 h-4 rounded ${!isEmployeeActive && cursorNotAllowed}`} 
                onClick={() => !createMode && toggleEmployeeField(employee?.id, "useTransport")} />
            </label>
          </div>
        </div>
        
      </div>
    );
}
