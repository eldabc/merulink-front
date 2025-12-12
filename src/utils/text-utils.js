// Normalizar strings para la busqueda
export function normalizeText(text) {
    const safeText = String(text ?? '');
    return safeText
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
}
