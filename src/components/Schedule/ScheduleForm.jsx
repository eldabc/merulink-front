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

export default function ScheduleForm({ }) {

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
  const [fortnightDays, setFortnightDays] = useState([]);
  const [startEndFortnight, setStartEndFortnight] = useState({ start: [], end: [] });
  const [mode, setMode] = useState('create');
  const [formData, setFormData] = useState({});
  const scheduleGridRef = useRef(null);

  // const schedule = scheduleData?.find(e => 1 === Number(id));

  // let createMode = mode === 'create';
  // let viewMode = mode === 'view';
  // let editMode = mode === 'edit';
  const currentYear = new Date().getFullYear();
  const todayObj = new Date();
  const todayFormatted = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`; 

  useEffect(() => {
    const loadData = async () => {
      if (selectedDepartmentId && selectedMonthId && selectedFortnight) {
        setLoading(true);
        try {
          // Calcula los días que comprende la quincena elegida
          const days = getFortnightDays(currentYear, selectedMonthId, selectedFortnight);
          setFortnightDays(days);

          const startDate = days[0]?.date;
          const endDate = days[days.length - 1]?.date;
          setStartEndFortnight({ start: startDate, end: endDate });

          // Llamada única al backend
          const schedule = await loadFormData(selectedDepartmentId, startDate, endDate);

          // Determinar mode
          if (schedule.isClosed || !(todayFormatted >= schedule.start && todayFormatted <= schedule.end)) {
            // Si la quincena está cerrada
            setMode('view');
            console.log("Formulario en Modo: VIEW (Quincena Cerrada)");
          } else {
            // Evalua si ya hay horario guardado previamente en el backend.
            const allEmployees = Object.values(schedule.employees || {}).flat();
            const tieneHorariosGuardados = allEmployees.some(emp => emp.dates && Object.keys(emp.dates).length > 0);

            if (tieneHorariosGuardados) {
              // Caso 2: Existe el registro y está abierta
              setMode('edit');
              console.log("Formulario en Modo: EDIT (Quincena Abierta con registros)");
            } else {
              // Caso 3: No hay nada en la BD para esta quincena
              setMode('create');
              console.log("Formulario en Modo: CREATE (Nueva Planificación)");
            }
          }
          setFormData(schedule);

        } catch (error) {
          console.error("Error procesando los modos del calendario", error);
        } finally {
          setLoading(false);
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
        departmentId: formData?.department?.id ?? '',
        status: formData?.status ?? 'created',
        observations: formData?.observation ?? '',
      });

  }, [mode, formData, reset]);

  const onSubmit = async (data) => {
    console.log("Procesando Submit en Modo:", mode);
    
    // Bloqueo de seguridad por si acaso el botón quedó activo
    if (mode === 'view') {
      console.warn("No puedes guardar una quincena en modo vista.");
      return;
    }

    const gridPayload = scheduleGridRef.current 
      ? scheduleGridRef.current.collectGridPayload() 
      : { shifts: [], schedules: [] };

    const payload = {
      ...data,
      id: schedule?.id, // ID del schedule_planning si existe
      start: startEndFortnight.start,
      end: startEndFortnight.end,
      selectedMonthId,
      selectedFortnight,
      shifts: gridPayload.shifts,
      schedules: gridPayload.schedules,
    };

    let success = false;

    if (mode === 'edit') { 
      success = await updateSchedule(payload);
    } else if (mode === 'create') {
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
  
  const disabledClasses = getDisabledClasses(mode === 'view');
  console.log("mode", mode, disabledClasses)

  return (
    <FormProvider {...methods}>
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {/* {( mode === 'view') && <HeadFormButtons url={`/empleados/turnos/editar/${schedule?.id}`} data={[]} /> } */}
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='w-full mt-6'>
              <TitleHeader title={mode === 'edit' ? ( 'Editar Horario' ):( 'Datos del Horario')} dinamicClasses="!mb-3" />
              
               <ScheduleFilterModal departments={departments} globalLoading={globalLoading} /> {/* disabledClasses={disabledClasses} */}
              
              <div className="div-border">
                {selectedDepartmentId && selectedMonthId && selectedFortnight && (
                  <ScheduleGrid ref={scheduleGridRef} groupedEmployees={formData?.employees} fortnightDays={fortnightDays} shifts={formData?.shifts} loading={loading} disabledClasses={disabledClasses} />
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