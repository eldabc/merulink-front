import { useEffect, useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { shiftValidationSchema  } from '../../utils/Validations/shiftValidationSchema';
import { useShifts } from '../../context/ShiftContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { newCodePosition } from '../../utils/Positions/positions-utils';
import { calculateWorkPeriods } from '../../utils/Shift/shift-utils';
import { typeShiftOptions, minHourOptions, radioOptions, nigthShiftOptions } from '../../utils/StaticData/shift-utils';

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
import '../../Tables.css';

export default function ShiftForm({ mode = 'create' }) {

  const { id } = useParams();
  const navigate = useNavigate();
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
  const watchRestPeriod = watch('timeRestPeriod');  
  const watchDurationUnitRestPeriod = watch('durationUnitRestPeriod');  
  const selectedTypeShift = watch('typeShift');  

  const shift = shiftData.find(e => e.id === Number(id));
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';

  const disabledClasses = getDisabledClasses(viewMode);
  const alwaysApplyDisabledClasses = getDisabledClasses(true);
  const disabledTypeShift = getDisabledClasses(!selectedDepartmentId);

  useEffect(() => {
    if (selectedTypeShift === 'administrative') {
      setValue('timeRestPeriod', 1, { shouldValidate: true });
      setValue('durationUnitRestPeriod', 'hours', { shouldValidate: true });
      setValue('nightShift', nigthShiftOptions.optionOne.key, { shouldValidate: true });
    } else if (selectedTypeShift === 'operative') {
      setValue('timeRestPeriod', 30, { shouldValidate: true });
      setValue('durationUnitRestPeriod', 'minutes', { shouldValidate: true });
    }
  },[selectedTypeShift]);

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
      // console.log("aqui", startTotalMinutes);      
    } else {
      setValue('nightShift', nigthShiftOptions.optionOne.key, { shouldValidate: true });
    }

  }, [watchCheckInTime, watchCheckOutTime, setValue]);


  useEffect(() => {
    
    if (watchCheckInTime && watchCheckOutTime && watchRestPeriod && watchDurationUnitRestPeriod) {

      const result = calculateWorkPeriods(
        watchCheckInTime,
        watchCheckOutTime,
        watchRestPeriod, watchDurationUnitRestPeriod
      );

      // console.log(result);
      setValue('timeTotalPeriod', result.totalPeriod, { shouldValidate: true });
      setValue('durationUnitTotalPeriod', result.totalMinutes > 59 ? 'hours' : 'minutes', { shouldValidate: true });
      setValue('timeActivePeriod', result.activePeriod, { shouldValidate: true });
      setValue('durationUnitActivePeriod', result.activeMinutes > 59 ? 'hours' : 'minutes', { shouldValidate: true });

    }
  },[watchCheckInTime, watchCheckOutTime, watchRestPeriod, watchDurationUnitRestPeriod]);

  

  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments();
    }
  }, [mode]);


  useEffect(() => {

      reset({
        code: shift?.code ?? '',
        description: shift?.description ?? '',
        nightShift: shift?.nightShift ?? nigthShiftOptions.optionOne.key,
        departmentId: shift?.department?.id ?? '',
        typeShift: shift?.typeShift ?? '',
        checkInTime: shift?.checkInTime ?? null,
        checkOutTime: shift?.checkOutTime ?? null,
        timeRestPeriod: shift?.timeRestPeriod ?? null,
        durationUnitRestPeriod: shift?.durationUnitRestPeriod ?? '',
        timeActivePeriod: shift?.timeActivePeriod ?? null,
        durationUnitActivePeriod: shift?.durationUnitActivePeriod ?? '',
        timeTotalPeriod: shift?.timeTotalPeriod ?? null,
        durationUnitTotalPeriod: shift?.durationUnitTotalPeriod ?? '',
        allowExit: shift?.allowExit ?? false,
        allowReScanned: shift?.allowReScanned ?? false,
        available: shift?.available ?? false,
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

    if (!viewMode) fetchCodeData(); 
    
  }, [selectedDepartmentId, viewMode]);


  const onSubmit = async (data) => {
    console.log("data submit", data);
    let success = false;
    const dataChanges = { ...data, id: shift?.id };

    if (editMode && shift) { 
      success = await updateShift(dataChanges);
    } else {
      success = await createShift(dataChanges);
    }

    if (success) {
      navigate(`/empleados/horarios/turnos`);
    }
  };

  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    if (!formErrors) return;
  };

  return (
    <FormProvider {...methods}>
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {(viewMode) && <HeadFormButtons url={`/empleados/horarios/turnos/editar/${shift?.id}`} data={[]} /> }
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='mx-auto mt-6'>
              <TitleHeader title={editMode ? ( 'Editar Turno' ):( 'Datos del Turno')} dinamicClasses="!mb-3" />
              
                {loading ? (
                  <SpanText text="Cargando..." />
                ) : (
                  <CodesCircles codes={existingCodes} />
                )}
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full div-border">
                
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

                  <LabelFieldForm field="Nocturno" simbol="*"/>
                <div>
                  <ToggleGeneric name="nightShift" optionsToggle={nigthShiftOptions} readOnly={viewMode} register={register}
                  errors={errors} setValue={setValue} watch={watch} dynamicClasses={disabledClasses} />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mb-3 div-border">

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
                    register={register} 
                    disabled={viewMode || !selectedDepartmentId} 
                    dynamicClasses={`${disabledClasses} ${disabledTypeShift}`} 
                    dataSelect={typeShiftOptions}
                    errors={errors}
                  />
                </div>

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
                      {...register('timeRestPeriod')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                    />
                    <SelectGeneric 
                      name="durationUnitRestPeriod"
                      register={register} 
                      disabled={viewMode} 
                      dynamicClasses={`${disabledClasses} w-40!`} 
                      dataSelect={minHourOptions}
                      errors={errors}
                    />
                    {errors?.durationUnitRestPeriod && <ErrorMessage msg={errors.durationUnitRestPeriod.message} />}  
                  </div>

                 <LabelFieldForm field="Periodo Activo" simbol="*"/>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly={true} //min={1} max={30}
                      {...register('timeActivePeriod')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${alwaysApplyDisabledClasses}`}
                    />
                    <SelectGeneric 
                      name="durationUnitActivePeriod"
                      register={register} 
                      disabled={true} 
                      dynamicClasses={`${alwaysApplyDisabledClasses} w-40!`} 
                      dataSelect={minHourOptions}
                      errors={errors}
                    />
                    {errors?.durationUnitActivePeriod && <ErrorMessage msg={errors.durationUnitActivePeriod.message} />}  
                  </div>

                <LabelFieldForm field="Periodo Total" simbol="*"/>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly={true}// min={1} max={30}
                      {...register('timeTotalPeriod')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${alwaysApplyDisabledClasses}`}
                    />
                    <SelectGeneric 
                      name="durationUnitTotalPeriod"
                      register={register} 
                      disabled={true} 
                      dynamicClasses={`${alwaysApplyDisabledClasses} w-40!`} 
                      dataSelect={minHourOptions}
                      errors={errors}
                    />
                    {errors?.durationUnitTotalPeriod && <ErrorMessage msg={errors.durationUnitTotalPeriod.message} />}  
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

                <LabelFieldForm field="Observación" />
                 <div className="hidden md:block md:col-span-3"> 
                    <textarea
                      readOnly={viewMode}
                      name="observation"
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