
// Filtrar Despartamentos según búsqueda y estado
export const filterData = (employees, searchValue, filterStatus, normalizeText) => {
    
    const normalizedValue = normalizeText(searchValue);

    return employees.filter(emp => {
        
        // 2. Lógica de Búsqueda de Texto (matchesSearch)
        const matchesSearch = normalizedValue === '' ||
            normalizeText(emp.code).includes(normalizedValue) ||
            normalizeText(emp.departmentName).includes(normalizedValue) //||
            // normalizeText(emp.ci).includes(normalizedValue) ||
            // normalizeText(emp.position).includes(normalizedValue) ||
            // normalizeText(emp.department).includes(normalizedValue) ||
            // normalizeText(emp.subDepartment).includes(normalizedValue);

        // 3. Lógica de Filtrado por Estado (matchesStatus)
        // const matchesStatus = filterStatus === 'all' ||
        //     (filterStatus === 'activo' && emp.status === true) ||
        //     (filterStatus === 'inactivo' && emp.status === false);

        // 4. Retorna si cumple ambas condiciones
        return matchesSearch; // && matchesStatus;
    });
};