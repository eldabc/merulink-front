export const mapChangeStatusToBackend = (formData) => { 
    console.log("formData", formData);
  return {
    retire_reason: formData.retireReason,
    retire_date: formData.retireDate,
    notes: formData?.notes,
  };
};