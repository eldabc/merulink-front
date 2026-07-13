// Normalizar strings para la busqueda
export function normalizeText(text) {
    const safeText = String(text ?? '');
    return safeText
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
}
//  Cortar texto a un limite de caracteres
export function truncateText(text = '', limit = 50) {
  if (text?.length <= limit) return text;
  return text?.substring(0, limit) + "...";
};

// Capitaliza la primera letra de un texto y pasa el resto a minúsculas.
export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  const str = String(text);
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Helper para react-hook-form: convierte el valor a mayúsculas en tiempo real
export const upperOption = { onChange: (e) => { e.target.value = e.target.value.toUpperCase(); } };

// Helper para react-hook-form: convierte el valor a minúsculas en tiempo real
export const lowerOption = { onChange: (e) => { e.target.value = e.target.value.toLowerCase(); } };