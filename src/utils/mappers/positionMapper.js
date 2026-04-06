export const mapPositionToBackend = (formData) => { 
  const isAddingSubDepartment = formData.subDepartmentName && formData.newSubDepartmentCode;
  return {
    id: formData.id ? formData.id : Date.now(),
    code: formData.code,
    name: formData.name,
    department_id: formData.departmentId,
    sub_department_id: isAddingSubDepartment 
      ? null 
      : (String(formData.subDepartmentId) !== "0" ? formData.subDepartmentId : null),
    sub_department_name: formData.subDepartmentName || null,
    sub_department_code: formData.newSubDepartmentCode || null
  };
};