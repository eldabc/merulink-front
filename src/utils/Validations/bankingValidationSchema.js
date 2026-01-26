import * as Yup from 'yup';

// Definimos el esquema
export const bankingSchema = Yup.array().of(
  Yup.object().shape({
    start: Yup.string().required(),
    title: Yup.string()
      .min(3, "La descripción es muy corta")
      .max(50, "La descripción es muy larga")
      .required("Debes indicar el motivo del feriado")
  })
);