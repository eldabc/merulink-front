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
  if (text.length <= limit) return text;
  return text.substring(0, limit) + "...";
};
