export const mapScheduleToBackend = (formData) => { 
  console.log("formData", formData);
  return {
    id: formData.id ? formData.id : Date.now(),
    department_id: formData.departmentId,
    status: formData.status,
    observations: formData.observations,
    shifts: formData.shifts || [],
    schedules: formData.schedules || [],
  };
};