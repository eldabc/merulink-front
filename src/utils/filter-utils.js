/**
 * Filtra un array de datos basándose en un valor de búsqueda y campos específicos.
 *
 * @param {Array<Object>} data - El array de objetos a filtrar (Empleados, Departamentos, etc.).
 * @param {string} searchValue - El texto de búsqueda.
 * @param {Array<string>} searchableFields - Lista de nombres de propiedades a buscar (ej: ['code', 'departmentName']).
 * @param {string} [filterStatus] - Opcional. El estado para filtrar ('all', 'activo', 'inactivo').
 * @param {function} normalizeText - Función de utilidad para normalizar el texto.
 * @returns {Array<Object>} El array de datos filtrado.
 */
export const filterData = (data, searchValue, searchableFields, filterStatus, normalizeText) => {

  const normalizedValue = normalizeText(searchValue);

  if (normalizedValue === '' && (filterStatus === 'all' || !filterStatus)) {
    return data;
  }

  return data.filter(item => {
      
    let matchesSearch = true; 
    
    if (normalizedValue !== '') {
      // Verifica si ALGUNO de los campos definidos en searchableFields coincide con el valor de búsqueda.
      matchesSearch = searchableFields.some(field => {
        const fieldValue = item[field];
        
        // Si el campo existe en el objeto, normalizar y comprobar si incluye el valor.
        return fieldValue && normalizeText(fieldValue).includes(normalizedValue);
      });
    }
    
    let matchesStatus = true;
    
    if (filterStatus && filterStatus !== 'all') {
        const itemStatus = item.status;
        
        if (filterStatus === 'activo') {
          matchesStatus = itemStatus === true;
        } else if (filterStatus === 'inactivo') {
          matchesStatus = itemStatus === false;
        }
    }

    return matchesSearch && matchesStatus;
  });
};