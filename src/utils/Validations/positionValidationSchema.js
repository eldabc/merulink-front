import * as yup from 'yup';

export const positionValidationSchema = (hasSubDepartments) =>
  yup.object({
    code: yup
      .string()
      .required('Código es requerido')
      .matches(/^[0-9]+$/, 'Solo se permiten números.')
      .max(4, 'Debe contener máximo 4 dígitos')
      .min(3, 'Debe contener mínimo 3 dígitos'),

    name: yup
      .string()
      .required('Nombre de Cargo es requerido')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\/]+$/, "Solo se permiten letras y los signos '-','/'.")
      .max(30, 'Debe contener máximo 30 dígitos'),

    departmentId: yup
      .string()
      .required('Debe seleccionar Departamento'),

    // subDepartmentId: hasSubDepartments
    //   ? yup.string().required('Debe seleccionar Sub-departamento')
    //   : yup.string().notRequired(),
  });