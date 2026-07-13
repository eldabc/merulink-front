import LabelFieldForm from '../Shared/LabelFieldForm';
import ErrorMessage from '../Shared/ErrorMessage';
import { upperOption } from '../../utils/text-utils';

function HeaderEmployeeForm ({ register, errors, viewMode, disabledClasses }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
      <div>
        <LabelFieldForm field="Primer Nombre" simbol="*" />
      </div>
      <div>
        <input
          readOnly={viewMode}
          {...register('firstName', upperOption)}
          placeholder='Ingrese primer nombre'
          className={`w-full rounded-lg filter-input ${disabledClasses}`}
        />
        {errors?.firstName && <ErrorMessage msg={errors.firstName.message} />}  
      </div>

      <div>
        <LabelFieldForm field="Segundo Nombre" />
      </div>
      <div>
        <input
          readOnly={viewMode}
          {...register('secondName', upperOption)}
          placeholder='Ingrese segundo nombre'
          className={`w-full rounded-lg filter-input ${disabledClasses}`}
        />
        {errors?.secondName && <ErrorMessage msg={errors.secondName.message} />}
      </div>

      <div>
        <LabelFieldForm field="Primer Apellido" simbol="*" />
      </div>
      <div>
        <input
          readOnly={viewMode}
          {...register('lastName', upperOption)}
          placeholder='Ingrese primer apellido'
          className={`w-full rounded-lg filter-input ${disabledClasses}`}
        />
        {errors?.lastName && <ErrorMessage msg={errors.lastName.message} />}
      </div>

      <div>
        <LabelFieldForm field="Segundo Apellido" />
      </div>
      <div>
        <input
          readOnly={viewMode}
          {...register('secondLastName', upperOption)}
          placeholder='Ingrese segundo apellido'
          className={`w-full rounded-lg filter-input ${disabledClasses}`}
        />
        {errors?.secondLastName && <ErrorMessage msg={errors.secondLastName.message} />}
      </div>
      <div>
        <LabelFieldForm field="No. Empleado" simbol="*" />
      </div>
      <div>
        <input
          disabled={true}
          {...register('numEmployee')}
          placeholder='Código'
          className={`w-20 px-2 py-1 text-sm rounded-lg filter-input cursor-not-allowed ${disabledClasses}`}
        />
        {errors?.numEmployee && <ErrorMessage msg={errors.numEmployee.message} />}
      </div>
    </div>
  );
}

export default HeaderEmployeeForm;