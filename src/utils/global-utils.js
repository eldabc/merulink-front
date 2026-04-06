export const getDisabledClasses = (...conditions) => {
  // Si alguna de las condiciones enviadas es verdadera, devuelve las clases
  const isDisabled = conditions.some(condition => Boolean(condition));
  
  return isDisabled ? 'cursor-not-allowed opacity-50 select-none' : '';
};