 // Generar código SubDeparment
export const generateCodeSubDep = (departmentId, data) => {
  
  // convertir a número
  const depIdNum = parseInt(departmentId, 10);
  if (isNaN(depIdNum) || depIdNum <= 0) return '';

  const countSubDepartments = data.filter(sub => Number(sub.department.id) === Number(depIdNum)).length;

  const newSubCodeSuffix = countSubDepartments + 1;
  const newCode = `${depIdNum}${newSubCodeSuffix}`;

  return String(newCode);
};