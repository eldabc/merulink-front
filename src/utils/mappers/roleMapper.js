export const mapRoleToBackend = (formData, isAddingSubDepartment) => { 
  return {
    id: formData.id ? formData.id : Date.now(),
    role_name: formData.roleName,
    permissions: formData.permissions
  };
};