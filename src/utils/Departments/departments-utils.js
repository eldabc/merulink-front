import { departments } from '../../utils/StaticData/departments-utils';

/**
 * Busca el nombre del departamento dado su ID.
 * * @param {string | number} departmentId - El ID del departamento a buscar.
 * @returns {string} El nombre del departamento o 'N/A' si no se encuentra.
 */
export const getDepartmentNameById = (departmentId) => {
    const department = departments.find(dep => String(dep.id) === String(departmentId));
    
    return department ? department : { departmentName: null, code: null, id: null };
};