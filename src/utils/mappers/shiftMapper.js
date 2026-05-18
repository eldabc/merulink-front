export const mapShiftToBackend = (formData) => { 
    console.log("formData", formData);
  return {
    id: formData.id ? formData.id : Date.now(),
    code: formData.code,
    description: formData.description,
    night_shift: formData.nightShift,
    department_id: formData.departmentId,
    type_shift: formData.typeShift,
    check_in_time: formData.checkInTime,
    check_out_time: formData.checkOutTime,
    time_rest_period: formData.timeRestPeriod,
    duration_unit_rest_period: formData.durationUnitRestPeriod,
    time_active_period: formData.timeActivePeriod,
    duration_unit_active_period: formData.durationUnitActivePeriod,
    time_total_period: formData.timeTotalPeriod,
    duration_unit_total_period: formData.durationUnitTotalPeriod,
    allow_exit: formData.allowExit,
    allow_re_scanned: formData.allowReScanned,
    available: formData.available,
    observation: formData.observation,
  };
};