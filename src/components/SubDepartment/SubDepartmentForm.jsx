import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import { getDisabledClasses } from '../../utils/global-utils';  
import { generateCodeSubDep } from '../../utils/SubDepartments/subDeparments-utils';  
import { subDepartmentValidationSchema } from '../../utils/Validations/subDepartmentValidationSchema';
import { useSubDepartments } from '../../context/SubDepartmentContext';
import { useGlobalData } from '../../context/GlobalDataContext';

import TitleHeader from '../Shared/TitleHeader';
import HeadFormButtons from '../Shared/HeadFormButtons';
import FooterFormButtons from '../Shared/FooterFormButtons';
import ErrorMessage from '../Shared/ErrorMessage';
import LabelFieldForm from '../Shared/LabelFieldForm';
import RowTableResults from '../Shared/RowTableResults'; 
import '../../Tables.css';

export default function SubDepartmentForm({ mode = 'create' }) {

  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const { departments, globalLoading, loadDepartments } = useGlobalData();
  const { subDepartmentData, createSubDepartment, updateSubDepartment } = useSubDepartments();

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(subDepartmentValidationSchema),
  });

  const { id } = useParams();
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';
  const subDepartment = subDepartmentData.find(e => e.id === Number(id));
  const disabledClasses = getDisabledClasses(viewMode, globalLoading);

  // Al seleccionar departamento
  const handleDepartmentChange = (e) => {
    const selectedDepartmentId = e.target.value;
    
    // establecer valor en react-hook-form
    // setValue('departmentId', selectedDepartmentId, { shouldValidate: true });

    if (selectedDepartmentId) {       
      const newCode = generateCodeSubDep(selectedDepartmentId, subDepartmentData);
      setValue('code', newCode, { shouldValidate: true });
    } else {
      setValue('code', '', { shouldValidate: true });
    }
  };

  useEffect(() => {
    
    if (departments.length === 0) {
      loadDepartments(); 
    }
  }, []);

  useEffect(() => {
    if (subDepartment) { // && editMode || viewMode
      reset({
        code: subDepartment?.code ?? '',
        name: subDepartment?.name ?? '',
        departmentId: subDepartment?.department.id ?? '',
      });
    }
  }, [subDepartment, mode, reset]);

  const onSubmit = async (data) => {
    let success = false;
    
    if (editMode && subDepartment) {
        const updatedData = { ...subDepartment, ...data };
        success = await updateSubDepartment(updatedData);
    } else {
        success = await createSubDepartment(data);
    }

    if (success) {
      if (createMode) navigate(-1);
      else navigate(-2);
    }
  };

  const onError = (formErrors) => {
    console.warn('Validation errors:', formErrors);
    if (!formErrors) return;
  };
  

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto p-2 rounded-lg">
    {(viewMode) && <HeadFormButtons url={`/empleados/sub-departamentos/editar/${subDepartment?.id}`} data={[]} /> }

    <form onSubmit={handleSubmit(onSubmit, onError)}>

      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className='mx-auto mt-6'>
              <TitleHeader title={editMode ? ( 'Editar Sub-Departamento' ):( 'Datos Sub-Departamento')} dinamicClasses="mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:m-6 w-full">
                
                <LabelFieldForm field="Departamento" simbol="*"/>
              <div>
                <select 
                  disabled= {viewMode}
                  {...register('departmentId', { onChange: handleDepartmentChange })} 
                  className={`text-xl w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`}>

                    <option value="" className="bg-[#3c4042]"> {globalLoading ? "Cargando..." : "Seleccionar..."} </option>

                    {departments.map(dep => (
                      <option key={`departmentId-${dep.id}`} className='bg-[#3c4042]' value={dep.id}>{dep.departmentName}</option>
                    ))}
                </select>
                {errors?.departmentId && <ErrorMessage msg={errors.departmentId.message} />}  
              </div>

                <LabelFieldForm field="Nombre Sub-Departamento" simbol="*"/>
              <div>
                <input
                  readOnly={viewMode}
                  {...register('name')}
                  className={`w-full px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                />
                {errors?.name && <ErrorMessage msg={errors.name.message} />}  
              </div>
              <div className='grid  grid-cols-2 md:mt-0 mt-2'>

                <LabelFieldForm field="Código" simbol="*"/>
                <div>
                  <input
                    readOnly={true}
                    {...register('code')}
                    className={`w-20 px-1 py-1 text-xl rounded-lg filter-input cursor-not-allowed ${disabledClasses}`}
                  />
                  {errors?.code && <ErrorMessage msg={errors.code.message} /> }  
                </div>
              </div>
            </div>
          </div>
        </div>
        {viewMode && (
          <div className="mt-6">
            <div className="shadow md:w-2xl mx-auto mb-4">

              <TitleHeader title="Cargos" dinamicClasses="mb-5" />
              <table className="rounded-lg min-w-full border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="tr-thead-table">
                    <th className="px-4 py-3 text-center font-semibold">Código</th>
                    <th className="px-4 py-3 text-center font-semibold">Nombre Cargo</th>
                  </tr>
                </thead>
                <tbody>
                  {subDepartment?.positions?.length === 0 ? (
                    <RowTableResults colSpan={2} message="Sin Cargos asociados" />
                  ) : (
                    subDepartment?.positions?.map((subDep) => (
                      <tr key={subDep.id} className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                        <td className="px-4 py-3 text-center text-white-800 font-medium">{subDep?.code}</td>
                        <td className="px-4 py-3 text-center text-white-700">{subDep?.name}</td>
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