import { useEffect, useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { scheduleValidationSchema  } from '../../utils/Validations/scheduleValidationSchema';
import { useSchedules } from '../../context/ScheduleContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { getFortnightDays } from '../../utils/Schedule/schedule-utils';
import ScheduleFilterModal from './ScheduleFilterModal';
import TitleHeader from '../Shared/TitleHeader';
import HeadFormButtons from '../Shared/HeadFormButtons';
import FooterFormButtons from '../Shared/FooterFormButtons';
import ErrorMessage from '../Shared/ErrorMessage';
import LabelFieldForm from '../Shared/LabelFieldForm';
import RowTableResults from '../Shared/RowTableResults';
import SpanText from '../Shared/SpanText';
import InputGeneric from '../Shared/InputGeneric';
import OptionSelect from '../Shared/OptionSelect';
import SelectGeneric from '../Shared/SelectGeneric';
import ToggleGeneric from '../Shared/ToggleGeneric';
import ButtonRadioGeneric from '../Shared/ButtonRadioGeneric';
import ShiftLegend from '../Shift/ShiftLegend';
import ScheduleGrid from './ScheduleGrid';
import '../../Tables.css';

export default function ScheduleForm({ mode = 'create' }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const { scheduleData, createSchedule, updateSchedule, getCodeDataByDepartment, loading, loadFormData, setLoading } = useSchedules();
  const { globalLoading, departments, loadDepartments } = useGlobalData();
  const [existingCodes, setExistingCodes] = useState([]);
  
  const methods = useForm({ resolver: yupResolver(scheduleValidationSchema), });
  
  // Desestructuración de methods
  const { 
    register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting }
  } = methods;


  const selectedDepartmentId = watch('departmentId');
  const selectedMonthId = watch('monthId');
  const selectedFortnight = watch('fortnight');  

  const schedule = scheduleData.find(e => e.id === Number(id));
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';

  const disabledClasses = getDisabledClasses(viewMode);
  const alwaysApplyDisabledClasses = getDisabledClasses(true);
  const disabledTypeSchedule = getDisabledClasses(!selectedDepartmentId);

  const [fortnightDays, setFortnightDays] = useState([]);
  const currentYear = new Date().getFullYear();
  const [formDataBack, setFormData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (selectedDepartmentId && selectedMonthId && selectedFortnight) {
        
        setLoading(true);
        // Calcula los días que comprende la quincena elegida
        const days = getFortnightDays(currentYear, selectedMonthId, selectedFortnight);
        setFortnightDays(days);

        // Extraer primer y último día
        const startDate = days[0].date;
        const endDate = days[days.length - 1].date;

        const data = await loadFormData(selectedDepartmentId, startDate, endDate);
        setFormData(data);
      }
    };

    loadData();    
  }, [selectedDepartmentId, selectedMonthId, selectedFortnight]);


  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments();
    }
  }, [mode]);


  useEffect(() => {

      reset({
        code: schedule?.code ?? '',
        description: schedule?.description ?? '',
        // nightSchedule: schedule?.nightSchedule ?? nigthScheduleOptions.optionOne.key,
        departmentId: schedule?.department?.id ?? '',
        typeSchedule: schedule?.typeSchedule ?? '',
        checkInTime: schedule?.checkInTime ?? null,
        checkOutTime: schedule?.checkOutTime ?? null,
        restPeriodTime: schedule?.restPeriodTime ?? null,
        restPeriodUnitTime: schedule?.restPeriodUnitTime ?? '',
        activePeriodTime: schedule?.activePeriodTime ?? null,
        activePeriodUnitTime: schedule?.activePeriodUnitTime ?? '',
        totalPeriodTime: schedule?.totalPeriodTime ?? null,
        totalPeriodUnitTime: schedule?.totalPeriodUnitTime ?? '',
        allowExit: schedule?.allowExit ?? false,
        allowReScanned: schedule?.allowReScanned ?? false,
        available: schedule?.available ?? false,
        observation: schedule?.observation ?? '',
      });

  }, [mode, schedule, reset]);


  const onSubmit = async (data) => {
    console.log("onSubmit", data);
    let success = false;
    const dataChanges = { ...data, id: schedule?.id };

    if (editMode && schedule) { 
      success = await updateSchedule(dataChanges);
    } else {
      success = await createSchedule(dataChanges);
    }

    if (success) {
      // navigate(`/empleados/horarios`);
    }
  };

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };
  // console.log("formDataBack?.shifts", formDataBack?.shifts)

  return (
    <FormProvider {...methods}>
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {(viewMode) && <HeadFormButtons url={`/empleados/turnos/editar/${schedule?.id}`} data={[]} /> }
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='w-full mt-6'>
              <TitleHeader title={editMode ? ( 'Editar Horario' ):( 'Datos del Horario')} dinamicClasses="!mb-3" />
              
              <ScheduleFilterModal departments={departments} globalLoading={globalLoading} disabledClasses={disabledClasses} /> 
              
              <div className="div-border">
                {selectedDepartmentId && selectedMonthId && selectedFortnight && (
                  <ScheduleGrid groupedEmployees={formDataBack?.employees} fortnightDays={fortnightDays} shifts={formDataBack?.shifts} loading={loading} />
                )}
              </div>
            </div>
          </div>
        </div>
        <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />
      </form>
    </div>
  </FormProvider>
  );
}