import * as Yup from 'yup';

export const bankingSchema = (mode) => {
  return Yup.array().of(
    Yup.object().shape({
      start: Yup.string().required(),
      title: Yup.string()
        .min(3, "La descripción es muy corta")
        .max(50, "La descripción es muy larga")
        .required("Debes indicar el motivo del feriado")
    })
  )
  .min(mode === 'edit' ? 0 : 1, "Debe seleccionar al menos un lunes");
};