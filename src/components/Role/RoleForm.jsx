import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoles } from '../../context/RoleContext';

import { roleValidationSchema } from '../../utils/Validations/roleValidationSchema';

import TitleHeader from '../Shared/TitleHeader';
import LabelFieldForm from '../Shared/LabelFieldForm';
import InputGeneric from '../Shared/InputGeneric';
import ErrorMessage from '../Shared/ErrorMessage';

function RoleForm ({ mode = 'create', role }) {
  const navigate = useNavigate();
  const { allPermissions } = useRoles();

  const methods = useForm({ resolver: yupResolver(roleValidationSchema) });
    
  // Desestructuración de methods
  const { 
    register, handleSubmit, reset, watch, setValue, trigger, formState: { errors, isSubmitting }
  } = methods;

  const [loading, setLoading] = useState(true);

  const viewMode = mode === 'view';
  const editMode = mode === 'edit';

  useEffect(() => {
    const getPermissions = async () => {
      const response = await allPermissions();
      console.log("response", response);
      setLoading(false);
    };

    getPermissions();
  }, [])

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

  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">  
      
      {(viewMode) && <HeadFormButtons url={`/empleados/cargos/editar/${role?.id}`} data={[]} /> }
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>        
        <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
          <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
            <div className='mx-auto mt-6'>
              <TitleHeader title={editMode ? ( 'Editar Rol' ):( 'Datos del Rol')} dinamicClasses="!mb-5" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full mb-3 div-border">

                  <LabelFieldForm field="Nombre Rol" simbol="*"/>
                <div>
                  <div className="flex flex-col">
                    <input
                      readOnly={viewMode}
                      {...register('roleName')}
                      className={`md:w-full px-1 py-1 rounded-lg filter-input`}
                    />
                    {errors?.roleName?.message && <ErrorMessage msg={errors?.roleName?.message} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      </FormProvider>
    </div>

  );
}

export default RoleForm;