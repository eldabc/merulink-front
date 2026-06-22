export const mapShiftToBackend = (formData) => { 
    // console.log("formData", formData);
  return {
    id: formData.id ? formData.id : Date.now(),
    code: formData.code,
    description: formData.description,
    night_shift: formData.nightShift,
    department_id: formData.departmentId,
    type_shift: formData.typeShift,
    check_in_time: formData.checkInTime,
    check_out_time: formData.checkOutTime,
    rest_period_time: formData.restPeriodTime,
    rest_period_unit_time: formData.restPeriodUnitTime,
    active_period_time: formData.activePeriodTime,
    active_period_unit_time: formData.activePeriodUnitTime,
    total_period_time: formData.totalPeriodTime,
    total_period_unit_time: formData.totalPeriodUnitTime,
    allow_exit: formData.allowExit,
    allow_re_scanned: formData.allowReScanned,
    available: formData.available,
    available_from: formData.availableFrom,
    observation: formData.observation,
  };
};