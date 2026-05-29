import { useEffect, useState, useMemo, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { scheduleValidationSchema  } from '../../utils/Validations/scheduleValidationSchema';
import { useSchedules } from '../../context/ScheduleContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { getStarEndFortnight, getFortnightDays } from '../../utils/Schedule/schedule-utils';
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
  const { scheduleData, setScheduleData, createSchedule, updateSchedule, getCodeDataByDepartment, loading, loadFormData, setLoading, getSchedule } = useSchedules();
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

  const schedule = scheduleData?.find(e => 1 === Number(id));
  const createMode = mode === 'create';
  let viewMode = mode === 'view';
  const editMode = mode === 'edit';

  const disabledClasses = getDisabledClasses(viewMode);
  const alwaysApplyDisabledClasses = getDisabledClasses(true);
  const disabledTypeSchedule = getDisabledClasses(!selectedDepartmentId);

  const [fortnightDays, setFortnightDays] = useState([]);
  const [startEndFortnight, setStartEndFortnight] = useState({ start: [], end: [] });
  const currentYear = new Date().getFullYear();
  const todayObj = new Date();
  const todayFormatted = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
  const [formData, setFormData] = useState({});
  const scheduleGridRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      if (selectedDepartmentId && selectedMonthId && selectedFortnight) {
        
        setLoading(true);
        // Calcula los días que comprende la quincena elegida
        const days = getFortnightDays(currentYear, selectedMonthId, selectedFortnight);
        setFortnightDays(days);

        const startDate = days[0]?.date;
        const endDate = days[days.length - 1]?.date;
        setStartEndFortnight({start: startDate, end: endDate});

        const schedule = await loadFormData(selectedDepartmentId, startDate, endDate);

        if (schedule?.length > 0) {
          console.log("Tiene schedule", schedule);
          const isStillOpen = schedule.status !== 'closed';

          if(isStillOpen && todayFormatted <= schedule.start && todayFormatted <= schedule.end) {
            console.log("IsStillOpen", isStillOpen);
            // Modo edit
          } else {
            // Modo view
            viewMode = true;
          }
        } else {
            // Modo create
          console.log("Carga Data calendario registro", schedule);
          setFormData(schedule);
        }
       
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
        departmentId: schedule?.department?.id ?? '',
        status: schedule?.status ?? 'created',
        observations: schedule?.observation ?? '',
      });

  }, [mode, schedule, reset]);

  const onSubmit = async (data) => {
    const gridPayload = scheduleGridRef.current ? scheduleGridRef.current.collectGridPayload() : { shifts: [], schedules: [] };
    const payload = {
      ...data,
      id: schedule?.id,
      start: startEndFortnight.start,
      end: startEndFortnight.end,
      selectedMonthId,
      selectedFortnight,
      shifts: gridPayload.shifts,
      schedules: gridPayload.schedules,
    };

    console.log('onSubmit payload', payload, startEndFortnight);

    let success = false;
    // const dataChanges = payload;

    if (editMode && schedule) { 
      success = await updateSchedule(payload);
    } else {
      success = await createSchedule(payload);
    }

    if (success) {
      // navigate(`/empleados/horarios`);
    }
  };

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };
  // console.log("formData?.shifts", formData?.shifts)

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
                  <ScheduleGrid ref={scheduleGridRef} groupedEmployees={formData?.employees} fortnightDays={fortnightDays} shifts={formData?.shifts} loading={loading} />
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