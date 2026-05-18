import { useEffect, useState, useMemo } from 'react';
import { set, useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { positionValidationSchema  } from '../../utils/Validations/positionValidationSchema';
import { useShifts } from '../../context/ShiftContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { newCodePosition } from '../../utils/Positions/positions-utils';
import { calculateWorkPeriods } from '../../utils/Shift/shift-utils';
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
import '../../Tables.css';

export default function ShiftForm({ mode = 'create' }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const { shiftData, createShift, updateShift } = useShifts();
  const { globalLoading, departments, loadDepartments } = useGlobalData();
  const [filteredSubDepartments, setFilteredSubDepartments] = useState([]);
  const [addSubDep, setAddSubDep] = useState(false);
  const [newSubDepCode, setNewSubDepCode] = useState('');
  // console.log("departments en Form", departments)
  const schema = useMemo(() => {
    return positionValidationSchema(
      filteredSubDepartments.length > 0
    );
  }, [filteredSubDepartments]);

  const methods = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        code: '',
        name: '',
        departmentId: '',
        subDepartmentId: 0
      }
    });
  
    // Desestructuración de methods
    const { 
      register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting }
    } = methods;

  useEffect(() => {
    trigger('subDepartmentId');
  }, [filteredSubDepartments]);

  const selectedDepartmentId = watch('departmentId');
  const watchCheckInTime = watch('checkInTime');  
  const watchCheckOutTime = watch('checkOutTime');  
  const watchRestPeriod = watch('timeRestPeriod');  
  const watchMinHourRestPeriod = watch('minHourRestPeriod');  
  const selectedTypeShift = watch('typeShift');  

  const position = shiftData.find(e => e.id === Number(id));
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';
  const disabledClasses = getDisabledClasses(viewMode);
  const alwaysApplyDisabledClasses = getDisabledClasses(true);
  const disabledTypeShift = getDisabledClasses(!selectedDepartmentId);

  const radioOptions = [
    { optionOne: { value: "yes", label: "Sí" } }, 
    { optionTwo: { value: "no", label: "No" } }
  ];

  useEffect(() => {
    if (selectedTypeShift === 'administative') {
      setValue('timeRestPeriod', 1, { shouldValidate: true });
      setValue('minHourRestPeriod', 'hours', { shouldValidate: true });
      setValue('nightShift', 'Diurno', { shouldValidate: true });
    } else {
      setValue('timeRestPeriod', 30, { shouldValidate: true });
      setValue('minHourRestPeriod', 'minutes', { shouldValidate: true });
    }
  },[selectedTypeShift]);

  useEffect(() => {
    
    // if (!watchCheckInTime || !watchCheckOutTime || !watchRestPeriod || !watchMinHourRestPeriod) return;
    if (watchCheckInTime && watchCheckOutTime && watchRestPeriod && watchMinHourRestPeriod) {

      // console.log("watchCheckInTime", watchCheckInTime);
      const result = calculateWorkPeriods(
        watchCheckInTime,
        watchCheckOutTime,
        watchRestPeriod, watchMinHourRestPeriod
      );

      console.log(result);

      setValue('timeTotalPeriod', result.totalPeriod, { shouldValidate: true });
      setValue('minHourTotalPeriod', result.totalMinutes > 59 ? 'hours' : 'minutes', { shouldValidate: true });
      setValue('timeActivePeriod', result.activePeriod, { shouldValidate: true });
      setValue('minHourActivePeriod', result.activeMinutes > 59 ? 'hours' : 'minutes', { shouldValidate: true });

    }
  },[watchCheckInTime, watchCheckOutTime, watchRestPeriod, watchMinHourRestPeriod]);

  

  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments();
    }
  }, [mode]);

  useEffect(() => {    
    if (departments.length > 0 && position?.department?.id) {
      // Cargar subdepartamentos si ya cargó departamentos y se tiene un departamento asignado al cargo
      const filtered = departments?.find(sd => String(sd.id) === String(position?.department?.id));
      setFilteredSubDepartments(filtered?.subDepartments);
    }
  }, [departments]);

  useEffect(() => {

    if (position) {
      reset({
        code: position?.code ?? '',
        name: position?.name ?? '',
        departmentId: position?.department?.id ?? '',
        subDepartmentId: position?.subDepartment?.id ?? 0,
        subDepartmentName: '',
      });
    }
  }, [mode, position, reset]);

  useEffect(() => {
    if (!viewMode) {
      if (selectedDepartmentId) {
        setValue('code', '');

        const filtered = departments.find(sd => String(sd.id) === String(selectedDepartmentId));
        setFilteredSubDepartments(filtered?.subDepartments);
        
        // Genera código
        const newCode = newCodePosition(selectedDepartmentId, 0, shiftData, departments, position?.id);
        setValue('code', newCode);
      } else {
        setFilteredSubDepartments([]);
        setValue('code', '');
      }
    }
    
  }, [selectedDepartmentId, shiftData]);

  


  const onSubmit = async (data) => {
    let success = false;
    const dataChanges = { 
      ...data, 
      id: position?.id,
      newSubDepartmentCode: newSubDepCode
     };

    if (editMode && position) { 
      success = await updateShift(dataChanges);
    } else {
      success = await createShift(dataChanges);
    }

    if (success) {
      if (createMode) navigate(-1);
      else navigate(-2);
    }
  };

  const onError = (formErrors) => {
    console.warn('ShiftForm validation errors:', formErrors);
    if (!formErrors) return;
  };


  const typeShiftData = [
    {
      value: 'operative',
      label: 'Operativo',
    },
    {
      value: 'administative',
      label: 'Administrativo',
    },
  ]

  const minHourOptions = () => {
    return [
      {
        value: 'minutes',
        label: 'Minutos',
      },
      {
        value: 'hours',
        label: 'Horas',
      }
    ];
  };

  return (
    <FormProvider {...methods}>
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {(viewMode) && <HeadFormButtons url={`/empleados/horarios/turnos/editar/${position?.id}`} data={[]} /> }
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='mx-auto mt-6'>
              <TitleHeader title={editMode ? ( 'Editar Turno' ):( 'Datos del Turno')} dinamicClasses="!mb-5" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full div-border">
                
                  <LabelFieldForm field="Código" simbol="*"/>
                <div>
                  <input
                    readOnly={viewMode}
                    {...register('code')}
                    className={`w-20 px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.code && <ErrorMessage msg={errors.code.message} />}  
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
                  <ToggleGeneric name="nightShift" textOn="Nocturno" textOff="Diurno" readOnly={viewMode} register={register} 
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
                    dataSelect={typeShiftData}
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
                      name="minHourRestPeriod"
                      register={register} 
                      disabled={viewMode} 
                      dynamicClasses={`${disabledClasses} w-40!`} 
                      dataSelect={minHourOptions()}
                      errors={errors}
                    />
                    {errors?.minHourRestPeriod && <ErrorMessage msg={errors.minHourRestPeriod.message} />}  
                  </div>

                 <LabelFieldForm field="Periodo Activo" simbol="*"/>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly={true} min={1} max={30} //type='number'
                      {...register('timeActivePeriod')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${alwaysApplyDisabledClasses}`}
                    />
                    <SelectGeneric 
                      name="minHourActivePeriod"
                      register={register} 
                      disabled={true} 
                      dynamicClasses={`${alwaysApplyDisabledClasses} w-40!`} 
                      dataSelect={minHourOptions()}
                      errors={errors}
                    />
                    {errors?.minHourActivePeriod && <ErrorMessage msg={errors.minHourActivePeriod.message} />}  
                  </div>

                <LabelFieldForm field="Periodo Total" simbol="*"/>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly={true} min={1} max={30} //type='number' 
                      {...register('timeTotalPeriod')} 
                      className={`w-20 px-3 py-2 rounded-lg filter-input ${alwaysApplyDisabledClasses}`}
                    />
                    <SelectGeneric 
                      name="minHourTotalPeriod"
                      register={register} 
                      disabled={true} 
                      dynamicClasses={`${alwaysApplyDisabledClasses} w-40!`} 
                      dataSelect={minHourOptions()}
                      errors={errors}
                    />
                    {errors?.minHourTotalPeriod && <ErrorMessage msg={errors.minHourTotalPeriod.message} />}  
                  </div>

                <LabelFieldForm field="Descripción" />
                  <textarea
                    name="comments"
                    rows="5"                 
                    cols="33"                 
                    placeholder="Escribe aquí una descripción..."
                    className="filter-input"
                  />
                
                <LabelFieldForm field="¿Permitir salida?" simbol="*"/>
                  <ButtonRadioGeneric
                    name="allowExit" 
                    disabled={viewMode} 
                    dynamicClasses={disabledClasses} 
                    optionOne={radioOptions[0].optionOne} 
                    optionTwo={radioOptions[1].optionTwo } 
                  />

                <LabelFieldForm field="¿Permitir Remarcaje?" simbol="*"/>
                  <ButtonRadioGeneric
                    name="reScanned" 
                    disabled={viewMode} 
                    dynamicClasses={disabledClasses} 
                    optionOne={radioOptions[0].optionOne} 
                    optionTwo={radioOptions[1].optionTwo } 
                  />

                <LabelFieldForm field="Disponible" simbol="*"/>
                  <ButtonRadioGeneric
                    name="available" 
                    disabled={viewMode} 
                    dynamicClasses={disabledClasses} 
                    optionOne={radioOptions[0].optionOne} 
                    optionTwo={radioOptions[1].optionTwo } 
                  />

                
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