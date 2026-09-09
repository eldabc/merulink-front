
// Genera código de cargo basado en el departamento y sub-departamento seleccionados
export const newCodePosition = (selectedDepartmentId, selectedSubDepartmentId = 0, positionData, departments, currentPosition) => {

  const isSubSelected = selectedSubDepartmentId && String(selectedSubDepartmentId) !== '0';

  // Cargos que compiten por el número: mismo departamento y, si hay sub-departamento,
  // mismo sub-departamento. Sin sub-departamento, solo los cargos "planos" del depto.
  const filteredPositionsByDept = positionData.filter(pos => {
    const sameDept = String(pos.department?.id) === String(selectedDepartmentId);
    const isCurrent = String(pos.id) === String(currentPosition);
    if (!sameDept || isCurrent) return false;

    if (isSubSelected) {
      return String(pos.subDepartment?.id ?? 0) === String(selectedSubDepartmentId);
    }
    return !pos.subDepartment;
  });

  // Número del cargo dentro del departamento/sub-departamento (arranca en 0)
  const newNumPosition = filteredPositionsByDept.length;

  // Código del departamento desde el catálogo (no su id), con respaldo
  const selectedDepartment = departments.find(d => String(d.id) === String(selectedDepartmentId));
  const departmentCode = selectedDepartment?.code ?? selectedDepartmentId;

  // Prefijo jerárquico:
  // - con sub-departamento: su código (ya incluye el prefijo del depto, ej. '11')
  // - sin sub-departamento: código del depto + '0' (ej. depto '3' -> '30')
  const founded = isSubSelected
    ? departments.flatMap(d => d.subDepartments)
        .find(s => String(s.id) === String(selectedSubDepartmentId))
    : null;

  const prefix = isSubSelected
    ? (founded?.code ?? `${departmentCode}0`)
    : `${departmentCode}0`;

  return `${prefix}${newNumPosition}`;
};