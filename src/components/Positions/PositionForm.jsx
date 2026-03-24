import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { positionValidationSchema  } from '../../utils/Validations/positionValidationSchema';
import { usePositions } from '../../context/PositionContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { newCodePosition } from '../../utils/Positions/positions-utils'
import TitleHeader from '../Shared/TitleHeader';
import HeadFormButtons from '../Shared/HeadFormButtons';
import FooterFormButtons from '../Shared/FooterFormButtons';
import ErrorMessage from '../Shared/ErrorMessage';
import LabelFieldForm from '../Shared/LabelFieldForm';
import RowTableResults from '../Shared/RowTableResults';
import '../../Tables.css';

export default function PositionForm({ mode = 'create' }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const { positionData, createPosition, updatePosition } = usePositions();
  const { departments, globalLoading, loadDepartments } = useGlobalData();
  const [filteredSubDepartments, setFilteredSubDepartments] = useState([]);

  const schema = useMemo(() => {
    return positionValidationSchema(
      filteredSubDepartments.length > 0
    );
  }, [filteredSubDepartments]);

  useEffect(() => {
      // if (filteredSubDepartments.length === 0) {
      //   setValue('subDepartmentId', '');
      // }

    trigger('subDepartmentId');
  }, [filteredSubDepartments]);

  const { register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      departmentId: '',
      subDepartmentId: ''
    }
  });

  const selectedDepartmentId = watch('departmentId');
  const selectedSubDepartmentId = watch('subDepartmentId');  
  const position = positionData.find(e => e.id === Number(id));
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';
  const disabledClasses = getDisabledClasses(viewMode, globalLoading);
  const subDepartmentIdDisabled = filteredSubDepartments?.length === 0 && 'cursor-not-allowed opacity-50';

  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments(); 
    }
  }, [mode]);

  useEffect(() => {    
    if (departments.length > 0 && position?.department?.id) {
      // Cargar subdepartamentos filtrados si ya cargó departamentos
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
        subDepartmentId: position?.subDepartment?.id ?? '',
      });
    }
  }, [mode, position, reset]);

  useEffect(() => {
    if (!viewMode) {
      if (selectedDepartmentId) {
        setValue('code', '');

        const filtered = departments.find(sd => String(sd.id) === String(selectedDepartmentId));
        setFilteredSubDepartments(filtered?.subDepartments);
        
        // Sino hay Subdepartments genera código
        if (filtered?.subDepartments.length === 0) {
          const newCode = newCodePosition(selectedDepartmentId, 0, positionData, departments, position?.id);
          setValue('code', newCode);
          // console.log("code 3;", newCode);
        } 

      } else {
        setFilteredSubDepartments([]);
        setValue('code', '');
        // console.log("code 4;");
      }
    }
    
  }, [selectedDepartmentId, positionData]);

  // Código por Sub-departamento
  useEffect(() => {
    if (selectedSubDepartmentId && !viewMode) {
      const newCode = newCodePosition(selectedDepartmentId, selectedSubDepartmentId, positionData, departments, position?.id);
      setValue('code', newCode);
      console.log("code 1;", newCode);
    }
  }, [selectedSubDepartmentId]);


  const onSubmit = async (data) => {
    let success = false;
    
    if (editMode && position) {
        const updatedData = { ...position, ...data };
        success = await updatePosition(updatedData);
    } else {
        success = await createPosition(data);
    }

    if (success) {
      if (createMode) navigate(-1);
      else navigate(-2);
    }
  };

  const onError = (formErrors) => {
    console.warn('PositionForm validation errors:', formErrors);
    if (!formErrors) return;
  };
  
  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {(viewMode) && <HeadFormButtons url={`/empleados/cargos/editar/${position?.id}`} data={[]} /> }
      <form onSubmit={handleSubmit(onSubmit, onError)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='mx-auto mt-6'>
              <TitleHeader title={editMode ? ( 'Editar Cargo' ):( 'Datos del Cargo')} dinamicClasses="mb-5" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mb-3 div-border">

                  <LabelFieldForm field="Departamento" simbol="*"/>
                <div>
                  <select 
                    disabled= {viewMode}
                    {...register('departmentId')} 
                    className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}>

                      <option value="" className="bg-[#3c4042]"> {globalLoading ? "Cargando..." : "Seleccionar..."} </option>

                      {departments.map(dep => (
                        <option key={`departmentId-${dep.id}`} className='bg-[#3c4042]' value={dep.id}>{dep.departmentName}</option>
                      ))}
                  </select>
                  {errors?.departmentId && <ErrorMessage msg={errors.departmentId.message} />}  
                </div>

                  <LabelFieldForm field="Sub-departamento" simbol="*"/>
                <div>
                  <select 
                    disabled={viewMode || filteredSubDepartments.length === 0}
                    {...register('subDepartmentId')}
                    className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${disabledClasses} ${subDepartmentIdDisabled}`}
                  >
                    <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                    {filteredSubDepartments?.map(subDep => (
                      <option key={`subDepartmentId-${subDep.id}`} className='bg-[#3c4042]' value={subDep.id}>
                        {subDep.name}
                      </option>
                    ))}
                  </select>
                  {errors?.subDepartmentId && <ErrorMessage msg={errors.subDepartmentId.message} />}  
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full div-border">

                  <LabelFieldForm field="Nombre Cargo" simbol="*"/>
                <div>
                  <input
                    readOnly={viewMode}
                    {...register('name')}
                    className={`w-full px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.name && <ErrorMessage msg={errors.name.message} />}  
                </div>

                  <LabelFieldForm field="Código" simbol="*"/>
                <div>
                  <input
                    readOnly={viewMode}
                    {...register('code')}
                    className={`w-20 px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                  />
                  {errors?.code && <ErrorMessage msg={errors.code.message} />}  
                </div>
              </div>
            </div>
          </div>
          {position?.employees && (
            <div className="mt-6">
              <div className="shadow md:w-2xl mx-auto mb-4">

                <TitleHeader title="Empleados en este Cargo" dinamicClasses="mb-5" />
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
                        <tr className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
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
  );
}