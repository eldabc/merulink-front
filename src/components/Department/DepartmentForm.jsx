import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { departmentValidationSchema } from '../../utils/Validations/departmentValidationSchema';
import { useDepartments } from '../../context/DepartmentContext';
import FooterFormButtons from '../Shared/FooterFormButtons';
import HeadFormButtons from '../Shared/HeadFormButtons';
import LabelFieldForm from '../Shared/LabelFieldForm';
import ErrorMessage from '../Shared/ErrorMessage';
import TitleHeader from '../Shared/TitleHeader';
import '../../Tables.css';

export default function DepartmentForm({ mode = 'create', onUpdate }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { departmentData, createDepartment, updateDepartment } = useDepartments();
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(departmentValidationSchema),
  });

  const { id } = useParams();
  const createMode = mode === 'create';
  const viewMode = mode === 'view';
  const editMode = mode === 'edit';
  const department = departmentData.find(e => e.id === Number(id));

  const disabledClasses = viewMode && 'cursor-not-allowed opacity-50';

  useEffect(() => {
    if (department && mode === 'edit' || viewMode) {
 
      reset({
        code: department?.code ?? '',
        departmentName: department?.departmentName ?? '',
      });
    } else if (mode === 'create') {

      // generar número de departamento automáticamente
      const maxNum = Math.max( 0,
        ...departmentData.map(d => {
          const num = parseInt(d.code) || 0;
          return num;
        })
      );
      const newNumDepartment = String(maxNum + 1);
      reset({
        code: newNumDepartment,
        departmentName: '',
      });
    }
  }, [department, mode, reset]);

  const onSubmit = async (data) => {
    let success = false;

    if (editMode && department) {
      const dataEdit = { 
        ...data, 
        id: department.id, 
      }
      success = await updateDepartment(dataEdit);
    } else {
      success = await createDepartment(data);
    }

    if (success) {
      if (createMode) navigate(-1);
      else navigate(-2);
    }
  };

  const onError = (formErrors) => {
    console.warn('DepartmentForm validation errors:', formErrors);
    if (!formErrors) return;
  };
  
  const handleEditSave = async (formData) => {
    // Llamar al backend para actualizar aquí (PUT)
    if (onUpdate) onUpdate(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return <DepartmentForm mode="edit" department={department} onBack={() => setIsEditing(false)} onSave={handleEditSave} />;
  }

  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    
    {(viewMode) && <HeadFormButtons url={`/empleados/departamentos/editar/${department?.id}`} data={[]} /> }
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className='mx-auto mt-6'>
              <TitleHeader title={mode === 'edit' ? ( 'Editar Departamento' ):( 'Datos del Departamento')} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full m-6 text-xs">
                
                <LabelFieldForm field="Nombre Departamento" simbol="*" dinamicClasses="text-xl"/>
              <div>
                <input
                  readOnly={viewMode}
                  {...register('departmentName')}
                  className={`md:w-full px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                />
                {errors?.departmentName && <ErrorMessage msg={errors.departmentName.message} /> }  
              </div>

                
              <div className='flex flex-col md:flex-row'>
                <LabelFieldForm field="Código" simbol="*"/>
                <input
                  readOnly={viewMode}
                  {...register('code')}
                  className={`md:ml-5 w-20 px-1 py-1 text-xl rounded-lg filter-input ${disabledClasses}`}
                /> 
                {errors?.code && <ErrorMessage msg={errors.code.message} /> }  
              </div>
            </div>
          </div>
        </div>
        {department?.subDepartments && (
          <div className="mt-6">
            <div className="shadow md:w-2xl mx-auto mb-4">
              
              <TitleHeader title="Sub-Departamentos" />
              <table className="rounded-lg min-w-full border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="tr-thead-table">
                    <th className="px-4 py-3 text-center font-semibold">Código</th>
                    <th className="px-4 py-3 text-center font-semibold">Sub-Departamento</th>
                  </tr>
                </thead>
                <tbody>
                  {department.subDepartments.map((dep) => (
                    <tr key={dep.id} className="border-b tr-table hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                      <td className="px-4 py-3 text-center font-medium">{dep.code}</td>
                      <td className="px-4 py-3 text-center">{dep.name}</td>
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