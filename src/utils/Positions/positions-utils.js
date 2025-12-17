

export const newCodePosition = (selectedDepartmentId, selectedSubDepartmentId = 0, positionData ) => {
  let newNumPosition = 0;

  const filteredPositionsByDept = positionData.filter(pos => 
    String(pos.departmentId) === String(selectedDepartmentId)
  );

  if (filteredPositionsByDept.length > 0) {
    newNumPosition = filteredPositionsByDept.length + 1
  }  
   console.log('filteredPositionsByDept.length: ', filteredPositionsByDept.length)
   console.log('newNumPosition: ', newNumPosition)

  return `${selectedDepartmentId}${selectedSubDepartmentId}${newNumPosition}`
};