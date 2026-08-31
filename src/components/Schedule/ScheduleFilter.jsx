import { radioOptions } from '../../utils/StaticData/schedule-utils';

import LabelFieldForm from '../Shared/LabelFieldForm';
import SelectDepartment from '../Shared/SelectDepartment';
import SelectGeneric from '../Shared/SelectGeneric';
import ButtonRadioGeneric from '../Shared/ButtonRadioGeneric';
import { allMonths } from '../../utils/StaticData/months-utils';

function ScheduleFilter({ viewMode, departments = [], months, globalLoading, disabledClasses }) {

  if (months?.length === 0) {
    months = allMonths; // Fallback a todos los meses si no se pasan como prop
  }
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
            dataSelect={months}
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
    </div>
  </div>
  );
}

export default ScheduleFilter;
