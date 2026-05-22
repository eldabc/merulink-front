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
import '../../Tables.css';

export default function ScheduleForm({ mode = 'create' }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const { scheduleData, createSchedule, updateSchedule, getCodeDataByDepartment, loading, loadFormData } = useSchedules();
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
  const watchCheckInTime = watch('checkInTime');  
  const watchCheckOutTime = watch('checkOutTime');  
  const watchRestPeriod = watch('restPeriodTime');  
  const watchRestPeriodUnitTime = watch('restPeriodUnitTime');  
  const selectedTypeSchedule = watch('typeSchedule');  

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
      // Calculamos los días que comprende la quincena elegida
      const days = getFortnightDays(currentYear, selectedMonthId, selectedFortnight);
      console.log("fortnightDays", days);
      // Guardamos las fechas en el estado para renderizar los números de la quincena en la tabla
      setFortnightDays(days);

      // Extraer primer y último día
      const startDate = days[0].date;
      const endDate = days[days.length - 1].date;

      const data = await loadFormData(selectedDepartmentId, startDate, endDate);
      console.log("eew", data.employees)
      setFormData(data);
    }

    };

    loadData();
    
  }, [selectedDepartmentId, selectedMonthId, selectedFortnight]);

  useEffect(() => {
    if (selectedTypeSchedule === 'administrative') {
      setValue('restPeriodTime', 1, { shouldValidate: true });
      setValue('restPeriodUnitTime', 'hours', { shouldValidate: true });
      // setValue('nightSchedule', nigthScheduleOptions.optionOne.key, { shouldValidate: true });
    } else if (selectedTypeSchedule === 'operative') {
      setValue('restPeriodTime', 30, { shouldValidate: true });
      setValue('restPeriodUnitTime', 'minutes', { shouldValidate: true });
    }
  },[selectedTypeSchedule]);

  useEffect(() => {

    if (!watchCheckInTime || !watchCheckOutTime) return;

    // Convertir horas a minutos para comparar con precisión
    const [startHours, startMinutes] = watchCheckInTime.split(':').map(Number);
    const [endHours, endMinutes] = watchCheckOutTime.split(':').map(Number);

    const startTotalMinutes = (startHours * 60) + startMinutes;
    const endTotalMinutes = (endHours * 60) + endMinutes;

    // Si los minutos de salida son menores o iguales es nocturno
    if (endTotalMinutes <= startTotalMinutes && !errors?.checkOutTime) {
      // setValue('nightSchedule', nigthScheduleOptions.optionTwo.key, { shouldValidate: true }); 
    } else {
      // setValue('nightSchedule', nigthScheduleOptions.optionOne.key, { shouldValidate: true });
    }

  }, [watchCheckInTime, watchCheckOutTime, setValue]);


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

  useEffect(() => {

    const fetchCodeData = async () => {

      if (selectedDepartmentId) {
        try {

          const codeDataByDepartment = await getCodeDataByDepartment(selectedDepartmentId);
          // console.log("codeData", codeDataByDepartment, selectedDepartmentId);
          
          if (codeDataByDepartment?.suggestedCode) {
            setValue('code', codeDataByDepartment.suggestedCode);
            setExistingCodes(codeDataByDepartment.existingCodes);
          }

        } catch (error) {
          console.error("Error al obtener el código del departamento:", error);
        }

      } else {
        setValue('code', '');
        setExistingCodes([]);
      }
    };

    // if (!viewMode) fetchCodeData(); 
    
  }, [selectedDepartmentId, viewMode]);


  const onSubmit = async (data) => {
    // console.log("data submit", data);
    let success = false;
    const dataChanges = { ...data, id: schedule?.id };

    if (editMode && schedule) { 
      success = await updateSchedule(dataChanges);
    } else {
      success = await createSchedule(dataChanges);
    }

    if (success) {
      navigate(`/empleados/turnos`);
    }
  };

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };
    console.log("formDataBack?.shifts", formDataBack?.shifts)

  return (
    <FormProvider {...methods}>
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {(viewMode) && <HeadFormButtons url={`/empleados/turnos/editar/${schedule?.id}`} data={[]} /> }
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='mx-auto mt-6'>
              <TitleHeader title={editMode ? ( 'Editar Horario' ):( 'Datos del Horario')} dinamicClasses="!mb-3" />
              
                <ScheduleFilterModal departments={departments} globalLoading={globalLoading} disabledClasses={disabledClasses} /> 
              
              <div className="div-border">

                {loading ? (
                  <SpanText text="Cargando..." />
                ) : (
                  formDataBack?.shifts?.length > 0 && ( <ShiftLegend shifts={formDataBack?.shifts} /> )
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mt-2">
 
                  <div className="w-48 p-2 font-bold text-gray-200 border-r border-gray-200">
                    <span>Empleados</span>
                    {Object.entries(formDataBack?.employees || {}).map(
                      ([departmentName, employees]) => (

                        <div key={departmentName}>
                          {/* Título departamento */}
                          <div className="bg-gray-500 p-2 font-bold"> {departmentName} </div>

                          {/* empleados */}
                          {employees.map(employee => (
                            <div key={employee.id} className="flex border-b p-2">
                              {`${employee.firstName} ${employee.lastName}`}
                            </div>
                          ))}
                        </div>
                    ))}
                  </div>
                  <div>
                    {fortnightDays.map((day) => (
                      <div
                        key={day.date}
                        className={`flex-1 flex flex-col items-center justify-center p-2 border-r text-center transition-colors ${day.borderClass}`}
                      >
                        <span className={`text-xs ${day.colorClass} text-gray-200!`}>
                          {day.dayName} {day.dayNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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