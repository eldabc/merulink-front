import { useEffect, useState, useMemo } from 'react';

import { radioOptions } from '../../utils/StaticData/schedule-utils';
import { allMonths } from '../../utils/StaticData/months-utils';

import LabelFieldForm from '../Shared/LabelFieldForm';
import SelectDepartment from '../Shared/SelectDepartment';
import SelectGeneric from '../Shared/SelectGeneric';
import ButtonRadioGeneric from '../Shared/ButtonRadioGeneric';

function ScheduleFilterModal({ viewMode, departments = [], onAccept, onClose, globalLoading, disabledClasses }) {

  // Mes actual
  const currentMonthIndex = new Date().getMonth();

  // Mes actual + siguiente
  const availableMonths = [
    allMonths[currentMonthIndex],
    allMonths[(currentMonthIndex + 1) % 12]
  ];

  return (
    <div className="rounded-lg w-full p-2 div-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

        {/* Departamento */}
        <div>
          <LabelFieldForm field="Departamento" simbol="*" dinamicClasses="mb-3"/>
          <SelectDepartment disabled={viewMode} departments={departments} loading={globalLoading} />
        </div>


        {/* Mes */}
        <div>
          <LabelFieldForm field="Mes" simbol="*" dinamicClasses="mb-3"/>
          <SelectGeneric 
            name="monthId"
            disabled={viewMode} 
            dynamicClasses={`${disabledClasses}`} 
            dataSelect={availableMonths}
          />
        </div>


        {/* Quincena */}
        <div>
          <LabelFieldForm field="Quincena" simbol="*" dinamicClasses="mb-3"/>
            <div className='h-[42px] mt-1 flex items-center '> 
              <ButtonRadioGeneric
                name="fortnight" 
                disabled={viewMode} 
                dynamicClasses={`p-5 ${disabledClasses}`} 
                optionOne={radioOptions[0].optionOne} 
                optionTwo={radioOptions[1].optionTwo } 
              />
            </div>
        </div>


      {/* BOTONES */}
      {/* <div>
        <button type="button" className="py-2 mt-10"> Seleccionar </button>
      </div> */}
    </div>
  </div>
  );
}

export default ScheduleFilterModal;
