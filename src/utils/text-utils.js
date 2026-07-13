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

// Formatea cédula: 8123456 → 8.123.456, 21123456 → 21.123.456
export function formatCI(value) {
  if(!value) return;
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 3) return digits;
  const right = digits.slice(-3);
  const middle = digits.slice(-6, -3);
  const left = digits.slice(0, -6);
  return middle ? `${left}.${middle}.${right}` : `${left}${right ? '.' + right : ''}`;
}

// Helper para react-hook-form: formatea la cédula en tiempo real
export const ciOption = {
  onChange: (e) => {
    const cursor = e.target.selectionStart;
    const dotsBefore = (e.target.value.slice(0, cursor).match(/\./g) || []).length;
    e.target.value = formatCI(e.target.value);
    const dotsAfter = (e.target.value.match(/\./g) || []).length;
    const newCursor = cursor + (dotsAfter - dotsBefore);
    e.target.setSelectionRange(newCursor, newCursor);
  },
};