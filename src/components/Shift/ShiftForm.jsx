import { useEffect, useState, useMemo } from 'react';
import { set, useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { positionValidationSchema  } from '../../utils/Validations/positionValidationSchema';
import { useShifts } from '../../context/ShiftContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { newCodePosition } from '../../utils/Positions/positions-utils';
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

  // const { register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     code: '',
  //     name: '',
  //     departmentId: '',
  //     subDepartmentId: 0
  //   }
  // });

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
  const selectedSubDepartmentId = watch('subDepartmentId');  
  const position = shiftData.find(e => e.id === Number(id));
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';
  const disabledClasses = getDisabledClasses(viewMode);
  const disabledTypeShift = getDisabledClasses(!selectedDepartmentId);
  const subDepartmentIdDisabled = filteredSubDepartments?.length === 0 && 'cursor-not-allowed opacity-50';

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

  
  useEffect(() => {
    
    // Si se seleccionó Sub-departamento
    if (!viewMode && selectedSubDepartmentId && selectedSubDepartmentId !== "0") {
      const newCode = newCodePosition(selectedDepartmentId, selectedSubDepartmentId, shiftData, departments, position?.id);
      setValue('code', newCode);
    }
  }, [selectedSubDepartmentId]);


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

  const handleAddSudDep = (isAdding) => {
    setAddSubDep(isAdding);
    
    setValue('subDepartmentName', '');
    setValue('code', '');

    if (isAdding) {
      const selectedDep =  departments.find(sd => String(sd.id) === String(selectedDepartmentId));
      const numNewSubDep = filteredSubDepartments?.length + 1;
      const newSubDepPositionCode = `${selectedDepartmentId}${numNewSubDep}${selectedDep?.positions?.length}`;
      
      setValue('code', newSubDepPositionCode);
      
      const newSubDepartmentCode = `${selectedDepartmentId}${numNewSubDep}`;
      // console.log("Código nuevo subdep:", newSubDepartmentCode);
      setNewSubDepCode(newSubDepartmentCode);
    }
    
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
                    {...register('checkInTime', { onChange: (e) => { handleNextTime(e)} })} 
                    className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.checkInTime && <ErrorMessage msg={errors.checkInTime.message} />}  
                </div>

                <LabelFieldForm field="Hora Salida" simbol="*"/>
                <div>
                  <input 
                    readOnly={viewMode} type='time'
                    {...register('checkOutTime', { onChange: (e) => { handleNextTime(e)} })} 
                    className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.checkOutTime && <ErrorMessage msg={errors.checkOutTime.message} />}  
                </div>
                  {/* <InputGeneric readOnly={viewMode} name="code" register={register}  /> */}
              </div>
              
            </div>
          </div>
          {position?.employees && (
            <div className="mt-6">
              <div className="shadow md:w-2xl mx-auto mb-4">

                <TitleHeader title="Empleados en este Turno" dinamicClasses="!mb-3" />
                <table className="rounded-lg min-w-full border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="tr-thead-table">
                      <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                      <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {position?.employees.length === 0 ? (
                      <RowTableResults colSpan={2} message="Sin empleados asociados" />
                    ) : (
                      position?.employees.map((emp) => (
                        <tr key={emp.id} className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                          <td className="px-4 py-3 text-white-800 font-medium">{emp?.firstName} {emp?.lastName}</td>
                          <td className="px-4 py-3 text-white-700">{emp?.department?.departmentName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />
      </form>
    </div>
  </FormProvider>
  );
}