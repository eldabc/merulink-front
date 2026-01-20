import { useDepartments } from '../context/DepartmentContext';

export const useDepartmentsHook = () => {
    const { departments } = useDepartments();

    const getDepartmentById = (departmentId) => {
        const department = departments.find(dep => String(dep.id) === String(departmentId));
        return department ? department : { departmentName: null, code: null, id: null };
    };

    return { getDepartmentById };
};