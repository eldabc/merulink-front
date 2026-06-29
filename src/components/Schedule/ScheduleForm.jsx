import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { scheduleValidationSchema  } from '../../utils/Validations/scheduleValidationSchema';
import { useSchedules } from '../../context/ScheduleContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { getStarEndFortnight, getFortnightDays, getFortnightInfo } from '../../utils/Schedule/schedule-utils';
import { allMonths } from '../../utils/StaticData/months-utils';

import ScheduleFilter from './ScheduleFilter';
import TitleHeader from '../Shared/TitleHeader';
import FooterFormButtons from '../Shared/FooterFormButtons';
import ScheduleGrid from './ScheduleGrid';
import '../../Tables.css';

export default function ScheduleForm({ }) {

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { departmentId, monthNumber, fortnight, monthSelectedJson } = location.state || {};

  const { scheduleData, setScheduleData, createSchedule, updateSchedule, loading, loadFormData, setLoading, toggleAutofillAlways } = useSchedules();
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
  const [preFortnightParams, setPreFortnightParams] = useState({});
  const [autofillAlways, setAutofillAlways] = useState(false);
  const [loadingHandleAutofill, setLoadingHandleAutofill] = useState(false);
  const scheduleGridRef = useRef(null);

  const now = dayjs();
  const currentYear = now.year();
  
  // Añadir año correspondiente a los meses
  const mapToMonthWithYear = (d) => {
    const idx = d.month(); // 0-11
    return { ...allMonths[idx], currentYear: d.year() };
  };

  // Mes actual + siguiente
  let availableMonths = [
    mapToMonthWithYear(now),
    mapToMonthWithYear(now.add(1, 'month'))
  ];

  const existsMonth = availableMonths?.some(m => m.value === monthSelectedJson?.value);

  if (!existsMonth && monthSelectedJson?.value) {
    availableMonths = [monthSelectedJson, ...availableMonths]; // añadir mes soliticado desde listado
  } 

  useEffect(() => {
    const getScheduleData = async () => {

      if(departmentId && monthNumber && fortnight) {

        setValue('departmentId', departmentId);
        setValue('monthId', monthNumber);
        setValue('fortnight', String(fortnight));
      }
    };
    getScheduleData();
  }, []);

  
  useEffect(() => {
    const loadData = async () => {
      if (selectedDepartmentId && selectedMonthId && selectedFortnight) {

        setLoading(true);
        try {
          // Determinar el año correcto para el mes seleccionado (tomado de availableMonths)
          const monthYear = availableMonths?.find(m => Number(m.value) === Number(selectedMonthId))?.currentYear ?? currentYear;

          // Calcula los días que comprende la quincena elegida
          const days = getFortnightDays(monthYear, Number(selectedMonthId), selectedFortnight);
          setFortnightDays(days);

          const startDate = days[0]?.date;
          const endDate = days[days.length - 1]?.date;
          setStartEndFortnight({ start: startDate, end: endDate });

          const schedule = await loadFormData(selectedDepartmentId, startDate, endDate);
          
          // Si la quincena está cerrada
          if (schedule.isClosed || schedule.status === 'approved') {
            
            setMode('view');
            console.log("Formulario en Modo: VIEW (Quincena Cerrada)", schedule);

          } else {
            
            if (schedule?.id) { // Si ya hay horario guardado
              
              setMode('edit');
              console.log("Formulario en Modo: EDIT (Quincena Abierta con registros)", schedule.employees);

            } else { // No hay nada en la BD para esta quincena
              
              setMode('create');
              console.log("Formulario en Modo: CREATE (Nueva Planificación)",schedule);
            }
          }
          setFormData(schedule);
          setAutofillAlways(!!(schedule?.autofillAlways));

          const currentStart = dayjs(startDate);
          const previousEnd = currentStart.subtract(1, 'day'); // Fin de la quincena pasada
          let previousStart;

          if (previousEnd.date() === 15) {
            previousStart = previousEnd.date(1); // Si terminó el 15, significa que empezó el 1 del mismo mes
          } else {
            previousStart = previousEnd.date(16); // Si terminó a fin de mes (ej. 30 o 31), empezó el 16 del mismo mes
          }

          setPreFortnightParams({
            departmentId: selectedDepartmentId,
            start: previousStart.format('YYYY-MM-DD'),
            end: previousEnd.format('YYYY-MM-DD'),
          });

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
    
    if (!formData || Object.keys(formData).length === 0) return;
    const backendStatus = formData?.status;

    if (formData?.department?.id) {
      setValue('departmentId', formData.department.id);
    }

    if (formData?.monthId) {
      setValue('monthId', formData.monthId);
    }

    if (formData?.fortnight) {
      setValue('fortnight', formData.fortnight);
    }

    // Efecto cascada
    setValue('isReviewed',  ['reviewed', 'approved', 'closed'].includes(backendStatus) ?? '');
    setValue('isApproved', ['approved', 'closed'].includes(backendStatus) ?? '');
    setValue('isClosed', ['closed'].includes(backendStatus) ?? '');

    setValue('observations', formData?.observations ?? '');
  }, [formData, setValue]);

  const onSubmit = async (data) => {
    // console.log("Data:", data);
    
    // Bloqueo de seguridad
    if (mode === 'view') {
      console.warn("No puedes guardar una quincena en modo vista.");
      return;
    }

    const gridPayload = scheduleGridRef.current ? scheduleGridRef.current.collectGridPayload() : { shifts: [], schedules: [] };

    let finalStatus = 'created'; // Estado por defecto

    if (data.isClosed) {
      finalStatus = 'closed';
    } else if (data.isApproved) {
      finalStatus = 'approved';
    } else if (data.isReviewed) {
      finalStatus = 'reviewed';
    }

    const payload = {
      ...data,
      id: formData?.id,
      start: startEndFortnight.start,
      end: startEndFortnight.end,
      monthNumber: selectedMonthId,
      selectedFortnight,
      shifts: gridPayload.shifts,
      schedules: gridPayload.schedules,
      status: finalStatus
    };

    let success = false;

    if (mode === 'edit') { 
      success = await updateSchedule(payload);
    } else if (mode === 'create') {
      success = await createSchedule(payload);
    }

    if (success) {
      navigate(`/empleados/horarios`);
    }
  };

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };

  const disabledClasses = getDisabledClasses(mode === 'view');

  const handleAutofillAlwaysChange = async (checked) => {
    const departmentId = formData?.departmentId;

    if (!departmentId) {
      return;
    }

    setLoadingHandleAutofill(true);

    const success = await toggleAutofillAlways(checked, departmentId);
    if (success) {
      setAutofillAlways(checked);
    }
    setLoadingHandleAutofill(false);

  };

  return (
    <FormProvider {...methods}>
    <div className="md:min-w-7xl p-2 rounded-lg">
    
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='w-full mt-6'>
              <TitleHeader title={mode === 'edit' ? ( 'Editar Horario' ):( 'Datos del Horario')} dinamicClasses="!mb-3" />
              
               <ScheduleFilter departments={departments} months={availableMonths} globalLoading={globalLoading} />
              
              <div className="div-border mt-2">
                {Object.keys(formData ?? {}).length > 0 && (
                  <ScheduleGrid 
                    ref={scheduleGridRef}
                    scheduleData={formData}
                    preFortnightParams={preFortnightParams}
                    fortnightDays={fortnightDays} 
                    loading={loading} 
                    disabledClasses={disabledClasses} 
                    mode={mode} 
                    autofillAlways={autofillAlways}
                    onLoadingHandleAutofill={loadingHandleAutofill}
                    onAutofillAlwaysChange={handleAutofillAlwaysChange}
                    onAutofillSuccess={(newData) => {
                      setFormData(newData);
                      setAutofillAlways(!!(newData?.autofillAlways ?? autofillAlways));
                      if (newData?.isClosed || newData?.status === 'approved') {
                        setMode('view');
                      } else if (newData?.id) {
                        setMode('edit');
                      } else {
                        setMode('create');
                      }
                    }}
                  />
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