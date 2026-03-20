export const getDisabledClasses = (...conditions) => {
  // Si alguna de las condiciones enviadas es verdadera, devuelve las clases
  const isDisabled = conditions.some(condition => Boolean(condition));
  
  return isDisabled ? 'cursor-not-allowed opacity-50 select-none' : '';
};

 // Generar código Department/SubDeparment
export const generateCodeSubDep = (departmentId, data) => {
    console.log("data", data);
    // convertir a número
    const depIdNum = parseInt(departmentId, 10);
    if (isNaN(depIdNum) || depIdNum <= 0) return '';

    const countSubDepartments = data.filter(sub => Number(sub.department.id) === Number(depIdNum)).length;

    const newSubCodeSuffix = countSubDepartments + 1;
    const newCode = `${depIdNum}${newSubCodeSuffix}`;
    console.log("countSubDepartments", countSubDepartments );

    return String(newCode);
  };