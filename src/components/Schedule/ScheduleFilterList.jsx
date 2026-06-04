import { useEffect, useState, useMemo } from 'react';

import { radioOptions } from '../../utils/StaticData/schedule-utils';

import LabelFieldForm from '../Shared/LabelFieldForm';
import SelectDepartment from '../Shared/SelectDepartment';
import SelectGeneric from '../Shared/SelectGeneric';
import ButtonRadioGeneric from '../Shared/ButtonRadioGeneric';
import { allMonths } from '../../utils/StaticData/months-utils';

function ScheduleFilterList({ viewMode, departments = [], months = [], onAccept, onClose, loading, disabledClasses }) {

  if (months?.length === 0) {
    months = allMonths; // Fallback a todos los meses si no se pasan como prop

  }
  console.log("month",months.length)

  return (
    <div className="rounded-lg w-full p-2 div-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

        {/* Departamento */}
        <div>
          <LabelFieldForm field="Departamento" simbol="*" dinamicClasses="mb-3"/>
          <select 
            disabled={viewMode} name='department'
            className={`w-full text-xl px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          >
            <option className="bg-[#3c4042]" value=""> {loading ? "Cargando..." : "Seleccionar..."} </option>
            {departments.map((item) => ( 
              <option key={item.id} value={item.id} className='bg-[#3c4042]'> {item.departmentName} </option>
            ))}
        </select>
        </div>


        {/* Mes */}
        <div>
          <LabelFieldForm field="Mes" simbol="*" dinamicClasses="mb-3"/>
          <select 
            disabled={viewMode} name='department'
            className={`w-full text-xl px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
          >
            <option className="bg-[#3c4042]" value=""> {loading ? "Cargando..." : "Seleccionar..."} </option>
            {months.map((item) => ( 
              <option key={item.id} value={item.value} className='bg-[#3c4042]'> {item.label} </option>
            ))}
        </select>
        </div>


        {/* Quincena */}
        <div>
          <LabelFieldForm field="Quincena" simbol="*" dinamicClasses="mb-3"/>
            <div className='h-[42px] mt-1 flex items-center'> 
            <div className='flex gap-4 w-full justify-center bg-field rounded-xl'> 
              <label className="flex items-center gap-2 cursor-pointer p-1">
                <input
                  className={`h-4 w-4`}
                  type="radio"
                  value={radioOptions[0].optionOne.value}
                  name="fortnight"
                />
                {radioOptions[0].optionOne.label}
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className={`h-4 w-4`}
                  type="radio"
                  value={radioOptions[1].optionTwo.value}
                  name="fortnight"
                />
                {radioOptions[1].optionTwo.label}
              </label>
            </div>
            </div>
        </div>
    </div>
  </div>
  );
}

export default ScheduleFilterList;
