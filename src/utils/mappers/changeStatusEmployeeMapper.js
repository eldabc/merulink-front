export const mapChangeStatusToBackend = (formData) => { 
  // console.log("formData", formData);
  return {
    retire_reason: formData.retireReason,
    effective_date: formData.effectiveDate,
    notes: formData?.notes,
  };
};