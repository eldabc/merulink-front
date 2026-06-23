import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { shiftValidationSchema  } from '../../utils/Validations/shiftValidationSchema';
import { useShifts } from '../../context/ShiftContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { newCodePosition } from '../../utils/Positions/positions-utils';
import { calculateWorkPeriods } from '../../utils/Shift/shift-utils';
import { typeShiftOptions, minHourOptions, radioOptions, nigthShiftOptions } from '../../utils/StaticData/shift-utils';
import { getFortnightDetails } from '../../utils/Schedule/schedule-utils';

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
import CodesCircles from '../Shared/CodesCircles';
import AlertBadge from '../Shared/AlertBadge';
import LiveAlerts from '../Shared/LiveAlerts';
import '../../Tables.css';

export default function ShiftForm({ mode = 'create' }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { alert } = location.state || {};
  const { shiftData, createShift, updateShift, getCodeDataByDepartment, loading } = useShifts();
  const { globalLoading, departments, loadDepartments } = useGlobalData();
  const [existingCodes, setExistingCodes] = useState([]);

  const methods = useForm({ resolver: yupResolver(shiftValidationSchema), });
  
  // Desestructuración de methods
  const { 
    register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting }
  } = methods;


  const selectedDepartmentId = watch('departmentId');
  const watchCheckInTime = watch('checkInTime');  
  const watchCheckOutTime = watch('checkOutTime');  
  const watchRestPeriod = watch('restPeriodTime');  
  const watchRestPeriodUnitTime = watch('restPeriodUnitTime');  
  const selectedTypeShift = watch('typeShift');  
  const watchAvailable = watch('available');  
  const watchAvailableFrom = watch('availableFrom');  
  const [liveAlerts, setLiveAlerts] = useState([]); 
  const [nextFortnightData, setNextFortnightData] = useState([]);
  
  const shift = shiftData.find(e => e.id === Number(id));
  // console.log("shift", shift)
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';

  const disabledClasses = getDisabledClasses(viewMode);
  const alwaysApplyDisabledClasses = getDisabledClasses(true);
  const disabledTypeShift = getDisabledClasses(!selectedDepartmentId);

  useEffect(() => {
    if (selectedTypeShift === 'administrative') {
      setValue('restPeriodTime', 1, { shouldValidate: true });
      setValue('restPeriodUnitTime', 'hours', { shouldValidate: true });
      setValue('nightShift', nigthShiftOptions.optionOne.key, { shouldValidate: true });
    } else if (selectedTypeShift === 'operative') {
      setValue('restPeriodTime', 30, { shouldValidate: true });
      setValue('restPeriodUnitTime', 'minutes', { shouldValidate: true });
    }
  },[selectedTypeShift]);

  useEffect(() => {
    
    if (editMode && watchAvailable === 'yes') {

      const today = dayjs().format('YYYY-MM-DD');
      const nextFortnight = getFortnightDetails(today, 'next');
      const nextDate = watchAvailableFrom ? dayjs(watchAvailableFrom).format('DD/MM/YYYY') : '';
      setNextFortnightData(nextFortnight);

      setLiveAlerts([{
        id: 1,
        type: 'apply-shift-changes',
        message: `🚨 Esta editando un turno "HABILITADO" los cambios que realice hoy estarán vigentes a partir de la fecha seleccionada ${nextDate}.`
      }]);

    } else {
      setLiveAlerts([]);
    }
  }, [watchAvailable, editMode, watchAvailableFrom]);

  useEffect(() => {

    if (!watchCheckInTime || !watchCheckOutTime) return;

    // Convertir horas a minutos para comparar con precisión
    const [startHours, startMinutes] = watchCheckInTime.split(':').map(Number);
    const [endHours, endMinutes] = watchCheckOutTime.split(':').map(Number);

    const startTotalMinutes = (startHours * 60) + startMinutes;
    const endTotalMinutes = (endHours * 60) + endMinutes;

    // Si los minutos de salida son menores o iguales es nocturno
    if (endTotalMinutes <= startTotalMinutes && !errors?.checkOutTime) {
      setValue('nightShift', nigthShiftOptions.optionTwo.key, { shouldValidate: true }); 
    } else {
      setValue('nightShift', nigthShiftOptions.optionOne.key, { shouldValidate: true });
    }

  }, [watchCheckInTime, watchCheckOutTime, setValue]);


  useEffect(() => {
    
    if (watchCheckInTime && watchCheckOutTime && watchRestPeriod && watchRestPeriodUnitTime) {

      const result = calculateWorkPeriods(
        watchCheckInTime,
        watchCheckOutTime,
        watchRestPeriod, watchRestPeriodUnitTime
      );

      // console.log(result);
      setValue('totalPeriodTime', result.totalPeriod, { shouldValidate: true });
      setValue('totalPeriodUnitTime', result.totalMinutes > 59 ? 'hours' : 'minutes', { shouldValidate: true });
      setValue('activePeriodTime', result.activePeriod, { shouldValidate: true });
      setValue('activePeriodUnitTime', result.activeMinutes > 59 ? 'hours' : 'minutes', { shouldValidate: true });

    }
  },[watchCheckInTime, watchCheckOutTime, watchRestPeriod, watchRestPeriodUnitTime]);

  

  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments();
    }
  }, [mode]);


  useEffect(() => {
      const today = dayjs().format('YYYY-MM-DD');
      const createdAt = shift?.createdAt ?? null; 
      const dayInFortnight = today <= 15 ? today : today - 15;
      let availableFromDate = shift?.availableFrom ?? today;

      if (editMode && !dayjs(createdAt).isSame(today, 'day')) {

        // Evaluar regla de los primeros 3 días
        if (dayInFortnight <= 3) {
          // Hoy esta dentro de los días 1, 2 o 3 de la quincena actual.
          availableFromDate = today.format('YYYY-MM-DD');
        } else {
          // Ya pasó el día 3. Busca el inicio de la PRÓXIMA quincena.
          const proximaQuincena = getFortnightDetails(today, 'next');
          availableFromDate = proximaQuincena.start;
        }
      }

      reset({
        code: shift?.code ?? '',
        description: shift?.description ?? '',
        nightShift: shift?.nightShift ?? nigthShiftOptions.optionOne.key,
        departmentId: shift?.department?.id ?? '',
        typeShift: shift?.typeShift ?? '',
        checkInTime: shift?.checkInTime ?? null,
        checkOutTime: shift?.checkOutTime ?? null,
        restPeriodTime: shift?.restPeriodTime ?? null,
        restPeriodUnitTime: shift?.restPeriodUnitTime ?? '',
        activePeriodTime: shift?.activePeriodTime ?? null,
        activePeriodUnitTime: shift?.activePeriodUnitTime ?? '',
        totalPeriodTime: shift?.totalPeriodTime ?? null,
        totalPeriodUnitTime: shift?.totalPeriodUnitTime ?? '',
        allowExit: shift?.allowExit ?? false,
        allowReScanned: shift?.allowReScanned ?? false,
        available: shift?.available ?? false,
        availableFrom: availableFromDate,
        observation: shift?.observation ?? '',
      });

  }, [mode, shift, reset]);

  useEffect(() => {

    const fetchCodeData = async () => {

      if (selectedDepartmentId) {
        try {

          const codeDataByDepartment = await getCodeDataByDepartment(selectedDepartmentId);
          // console.log("codeData", codeDataByDepartment, selectedDepartmentId);
          
          if (codeDataByDepartment?.suggestedCode) {
            if (createMode) setValue('code', codeDataByDepartment.suggestedCode);
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

    if (!viewMode) fetchCodeData(); 
    
  }, [selectedDepartmentId, viewMode]);


  const onSubmit = async (data) => {
    // console.log("data submit", data);
    let success = false;
    const availableFrom = editMode ? nextFortnightData?.start : dayjs().format('YYYY-MM-DD');
    const dataChanges = { ...data, id: shift?.id };
    console.log("dataChanges", dataChanges)
    if (editMode && shift) { 
      success = await updateShift(dataChanges);
    } else {
      success = await createShift(dataChanges);
    }

    if (success) {
      navigate(`/empleados/turnos`);
    }
  };

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };

  return (
    <FormProvider {...methods}>
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {(viewMode) && <HeadFormButtons url={`/empleados/turnos/editar/${shift?.id}`} data={[]} /> }
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='mx-auto mt-6'>
              <div className="relative inline-block">                
                <TitleHeader title={editMode ? ( 'Editar Turno' ):( 'Datos del Turno')} dinamicClasses="!mb-3" />
                {shift?.alert && <AlertBadge alert={shift?.alert}  dynamicClasses="-top-3" />}
              </div>
              
                {(editMode && watchAvailable === 'yes') && (<LiveAlerts alerts={liveAlerts} title="Alerta modificación de turno" dynamicClasses="mt2" />)}
              
                {loading ? (
                  <SpanText text="Cargando..." />
                ) : (
                  <CodesCircles codes={existingCodes} />
                )}
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full div-border">
                
                <LabelFieldForm field="Descripción" simbol="*"/>
                <div>
                  <InputGeneric
                    readOnly={viewMode}
                    name='description'
                    register={register}
                    errorIndex={errors}
                    dinamicClasses={`w-20 px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.description && <ErrorMessage msg={errors.description.message} />}  
                </div>

                <LabelFieldForm field="Departamento" simbol="*"/>
                <div>
                  <select 
                    disabled= {viewMode}
                    {...register('departmentId')} 
                    className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}>

                      <OptionSelect text={ globalLoading ? "Cargando..." : "Seleccionar..."} />

                      {departments.map((dep, index) => (
                        <OptionSelect key={`departmentId-${dep.id}-${index}`} value={dep.id} text={dep.departmentName} />
                      ))}
                  </select>
                  {errors?.departmentId && <ErrorMessage msg={errors.departmentId.message} />}  
                </div>

                  <LabelFieldForm field="Tipo" simbol="*"/>
                <div>                 
                  <SelectGeneric 
                    name="typeShift"
                    disabled={viewMode || !selectedDepartmentId} 
                    dynamicClasses={`${disabledClasses} ${disabledTypeShift}`} 
                    dataSelect={typeShiftOptions}
                  />
                </div>

                <LabelFieldForm field="Código" simbol="*"/>
                <div>
                  {loading ? (
                    <SpanText text="Cargando..." />
                  ) : (
                    <>
                    <input
                      readOnly={viewMode}
                      {...register('code')}
                      className={`w-20 px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                    />
                    {errors?.code && <ErrorMessage msg={errors.code.message} />}  
                    </>
                  )}
                </div>

                  <LabelFieldForm field="Nocturno" simbol="*"/>
                <div>
                  <ToggleGeneric 
                    name="nightShift" optionsToggle={nigthShiftOptions} readOnly={viewMode} register={register}
                    errors={errors} setValue={setValue} watch={watch} dynamicClasses={disabledClasses} 
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mb-3 div-border">

                  <LabelFieldForm field="Hora Entrada" simbol="*"/>
                <div>
                  <input 
                    readOnly={viewMode} type='time'
                    {...register('checkInTime')}
                    className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.checkInTime && <ErrorMessage msg={errors.checkInTime.message} />}  
                </div>

                <LabelFieldForm field="Hora Salida" simbol="*"/>
                <div>
                  <input 
                    readOnly={viewMode} type='time'
                    {...register('checkOutTime')}
                    className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.checkOutTime && <ErrorMessage msg={errors.checkOutTime.message} />}  
                </div>

                <LabelFieldForm field="Descanso" simbol="*"/>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly={viewMode} type='number' min={1} max={30}
                      {...register('restPeriodTime')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                    />
                    <SelectGeneric 
                      name="restPeriodUnitTime"
                      disabled={viewMode} 
                      dynamicClasses={`${disabledClasses} w-40!`} 
                      dataSelect={minHourOptions}
                    />
                    {errors?.restPeriodUnitTime && <ErrorMessage msg={errors.restPeriodUnitTime.message} />}  
                  </div>

                 <LabelFieldForm field="Periodo Activo" simbol="*"/>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly={true} //min={1} max={30}
                      {...register('activePeriodTime')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${alwaysApplyDisabledClasses}`}
                    />
                    <SelectGeneric 
                      name="activePeriodUnitTime"
                      disabled={true} 
                      dynamicClasses={`${alwaysApplyDisabledClasses} w-40!`} 
                      dataSelect={minHourOptions}
                    />
                    {errors?.activePeriodUnitTime && <ErrorMessage msg={errors.activePeriodUnitTime.message} />}  
                  </div>

                <LabelFieldForm field="Periodo Total" simbol="*"/>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly={true}// min={1} max={30}
                      {...register('totalPeriodTime')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${alwaysApplyDisabledClasses}`}
                    />
                    <SelectGeneric 
                      name="totalPeriodUnitTime"
                      disabled={true} 
                      dynamicClasses={`${alwaysApplyDisabledClasses} w-40!`} 
                      dataSelect={minHourOptions}
                    />
                    {errors?.totalPeriodUnitTime && <ErrorMessage msg={errors.totalPeriodUnitTime.message} />}  
                  </div>

                <LabelFieldForm field="¿Permitir salida?" simbol="*"/>
                  <div className='mt-3'> 
                    <ButtonRadioGeneric
                      name="allowExit" 
                      disabled={viewMode} 
                      dynamicClasses={disabledClasses} 
                      optionOne={radioOptions[0].optionOne} 
                      optionTwo={radioOptions[1].optionTwo } 
                    />
                  </div>

                <LabelFieldForm field="¿Permitir Remarcaje?" simbol="*"/>
                  <div className='mt-3'> 
                    <ButtonRadioGeneric
                      name="allowReScanned" 
                      disabled={viewMode} 
                      dynamicClasses={disabledClasses} 
                      optionOne={radioOptions[0].optionOne} 
                      optionTwo={radioOptions[1].optionTwo } 
                    />
                  </div>

                <LabelFieldForm field="Disponible" simbol="*"/>
                  <div className='mt-3'>                   
                    <ButtonRadioGeneric
                      name="available" 
                      disabled={viewMode} 
                      dynamicClasses={disabledClasses} 
                      optionOne={radioOptions[0].optionOne} 
                      optionTwo={radioOptions[1].optionTwo } 
                    />
                  </div>

                {(watchAvailable === 'yes') && (
                  <>
                  <LabelFieldForm field="Aplicar cambios a partir de" simbol="*" />
                    <div>
                      <input 
                        readOnly={viewMode} type='date'
                        {...register('availableFrom')}
                        className={`w-full px-3 py-2 rounded-lg filter-input  ${disabledClasses}`} 
                      />
                      {errors?.availableFrom && <ErrorMessage msg={errors.availableFrom.message} /> }  
                    </div>
                  </>
                )}

                 <div className="hidden md:block md:col-span-3"> <LabelFieldForm field="Observación" dinamicClasses="mb-4" />
                    <textarea
                      readOnly={viewMode}
                      {...register('observation')}
                      rows="5"                 
                      cols="33"                 
                      placeholder="Escribe aquí una observación..."
                      className={`filter-input p-2 ${disabledClasses}`}
                    />
                    {errors?.observation && <ErrorMessage msg={errors.observation.message} />}  
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