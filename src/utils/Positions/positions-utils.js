
export const newCodePosition = (selectedDepartmentId, selectedSubDepartmentId = 0, positionData, departments, currentPosition ) => {

  const filteredPositionsByDept = positionData.filter(pos => {
    return (String(pos.department.id) === String(selectedDepartmentId) && String(pos.id) !== String(currentPosition))
  });
 
  const newNumPosition = filteredPositionsByDept.length;
  const founded = departments.flatMap(d => d.subDepartments)
                  .find(s => String(s.id) === String(selectedSubDepartmentId));

  const subDepartmentCode = founded?.code ? founded.code : `${selectedDepartmentId}0`;

  return `${subDepartmentCode}${newNumPosition}`
};