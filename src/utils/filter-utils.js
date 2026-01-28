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
export const filterData = (data, searchValue, searchableFields, filterStatus, normalizeText, searchDateValue = null) => {

  const normalizedValue = normalizeText(searchValue);

  if (normalizedValue === '' && (filterStatus === 'all' || !filterStatus)) {
    return data;
  }

  const normalize = (date) => {
    const d = new Date(date);
    // Retorna solo la parte "2026-01-28"
    return d.toISOString().split('T')[0];
  };

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

    if (searchDateValue instanceof Date && !isNaN(searchDateValue.getTime())) {
        // const itemDate = item.startDate;
        
        matchesSearch = searchableFields.some(field => {

          const dateFromForm = searchDateValue; // Viene del input date
          const dateFromApi = item.startDate; // Viene del JSON

          if (normalize(dateFromForm) === normalize(dateFromApi)) {
            console.log("Es el mismo lunes bancario");
          }
        const fieldValue = item[field];
        
        // Si el campo existe en el objeto, normalizar y comprobar si incluye el valor.
        return fieldValue && normalizeText(fieldValue).includes(normalizedValue);
      });
    }

    return matchesSearch && matchesStatus;
  });
};