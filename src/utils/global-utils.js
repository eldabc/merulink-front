export const getDisabledClasses = (...conditions) => {
  // Si alguna de las condiciones enviadas es verdadera, devuelve las clases
  const isDisabled = conditions.some(condition => Boolean(condition));
  
  return isDisabled ? 'cursor-not-allowed opacity-50 select-none' : '';
};

export const formatPhone = (value, type) => {
  if (!value) return value;
  
  // Limpia todo lo que no sea número
  const digits = value.replace(/\D/g, '');

  if (type === 'mobilePhone') {
    // Formato 328-8989 (Máximo 7 dígitos)
    const d = digits.slice(0, 7);
    if (d.length <= 3) return d;
    return `${d.slice(0, 3)}-${d.slice(3)}`;
  } 

  if (type === 'homePhone') {
    // Formato 0000000 (Solo números, máximo 7)
    return digits.slice(0, 7);
  }

  return digits;
};


/**
 * Remueve guiones, espacios y cualquier carácter no numérico.
 * @param {string} phone - El string proveniente del input (ej: "1234-123-4567")
 * @returns {string} - Solo los dígitos (ej: "12341234567")
 */
export const sanitizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, ""); 
};


/**
* Dividir el número de teléfono completo en código y número
* Opcionalmente formatear el número con guion
*/
export const splitPhone = (fullNumber, withDash = false) => {
  if (!fullNumber) return { code: null, number: null };

  // Limpia el número
  const cleanedNumber = String(fullNumber).replace(/[^0-9]/g, '');

  const code = cleanedNumber.substring(0, 4); 
  let number = cleanedNumber.substring(4); 

  // Si se solicita el guion y el número tiene el largo esperado
  if (withDash && number.length === 7) {
    number = `${number.substring(0, 3)}-${number.substring(3)}`;
  }

  return { code, number };
};