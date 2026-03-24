
export const newCodePosition = (selectedDepartmentId, selectedSubDepartmentId = 0, positionData, departments ) => {
  let newNumPosition = 0;

  const filteredPositionsByDept = positionData.filter(pos => {
    return String(pos.department.id) === String(selectedDepartmentId)
  });

  if (filteredPositionsByDept.length > 0) {
    newNumPosition = filteredPositionsByDept.length + 1
  }  

 const founded = departments.flatMap(d => d.subDepartments)
                  .find(s => String(s.id) === String(selectedSubDepartmentId));

  const subDepartmentCode = founded?.code ? founded.code : `${selectedDepartmentId}0`;

  return `${subDepartmentCode}${newNumPosition}`
};