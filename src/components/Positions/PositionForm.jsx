import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { positionValidationSchema } from '../../utils/Validations/positionValidationSchema';
import { usePositions } from '../../context/PositionContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import { subDepartments } from '../../utils/StaticData/subDepartments-utils'; 
import { newCodePosition } from '../../utils/Positions/positions-utils'
import TitleHeader from '../Shared/TitleHeader';
import HeadFormButtons from '../Shared/HeadFormButtons';
import FooterFormButtons from '../Shared/FooterFormButtons';
import ErrorMessage from '../Shared/ErrorMessage';
import LabelFieldForm from '../Shared/LabelFieldForm';
import '../../Tables.css';

export default function PositionForm({ mode = 'create' }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const { positionData, createPosition } = usePositions();
  const { departments, globalLoading, loadDepartments } = useGlobalData();
  const [filteredSubDepartments, setFilteredSubDepartments] = useState([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(positionValidationSchema),
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
  const subDepartmentIdDisabled = filteredSubDepartments.length === 0 && 'cursor-not-allowed opacity-50';

  useEffect(() => {  
    if (departments.length === 0) {
      loadDepartments(); 
    }
  }, []);

  useEffect(() => {
    if ((editMode || viewMode) && position) {
      reset(position);
      // Cargar subdepartamentos filtrados si ya hay un departamento
      const filtered = subDepartments.filter(sd => String(sd.departmentId) === String(position.departmentId));
      setFilteredSubDepartments(filtered);
    }
  }, [mode, position, reset]);

  useEffect(() => {
    if (selectedDepartmentId) {
      const filtered = departments.find(sd => String(sd.id) === String(selectedDepartmentId));
      setFilteredSubDepartments(filtered.subDepartments);
      
      // Sino hay Subdepartments genera código
      if (filtered.subDepartments.length === 0) {
        const newCode = newCodePosition(selectedDepartmentId, 0, positionData, departments);
        setValue('code', newCode);
      } else {
        setValue('code', '');
      }
    } else {
      setFilteredSubDepartments([]);
      setValue('code', '');
    }
  }, [selectedDepartmentId, positionData]);

  // Código por Sub-departamento
  useEffect(() => {
    if (selectedSubDepartmentId) {
      const newCode = newCodePosition(selectedDepartmentId, selectedSubDepartmentId, positionData, departments);
      setValue('code', newCode);
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
                <div className="w-30 h-10 overflow-hidden flex items-center justify-center ml-2.5"></div>
                <div>
                  <TitleHeader title={editMode ? ( 'Editar Cargo' ):( 'Datos del Cargo')} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mb-3">

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
                        {...register('subDepartmentId')} //, { onChange: handleSubDepartmentChange }
                        className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${disabledClasses} ${subDepartmentIdDisabled}`}
                      >
                        <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                        {filteredSubDepartments.map(subDep => (
                          <option key={`subDepartmentId-${subDep.id}`} className='bg-[#3c4042]' value={subDep.id}>
                            {subDep.name}
                          </option>
                        ))}
                      </select>
                      {errors?.subDepartmentId && <ErrorMessage msg={errors.subDepartmentId.message} />}  
                    </div>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">

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
                        readOnly={true}
                        {...register('code')}
                        className={`w-20 px-1 py-1 text-xl rounded-lg filter-input cursor-not-allowed`}
                      />
                      {errors?.code && <ErrorMessage msg={errors.code.message} />}  
                    </div>
                  </div>
                </div>
              </div>
              {position?.employees && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">Sub-Cargos</h3>
                  <div className="rounded-lg shadow">
                    <table className="min-w-full border-collapse text-sm sm:text-base">
                      <thead>
                        <tr className="tr-thead-table">
                          <th className="px-4 py-3 text-left font-semibold">Código</th>
                          <th className="px-4 py-3 text-left font-semibold">Cargo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {position.subPositions.map((dep) => (
                          <tr className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                            <td className="px-4 py-3 text-white-800 font-medium">{dep.code}</td>
                            <td className="px-4 py-3 text-white-700">{dep.subPositionName}</td>
                          </tr>
                        ))}
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