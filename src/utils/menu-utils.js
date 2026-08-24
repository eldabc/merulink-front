/**
 * Utilidades de menú que operan sobre el JSON que devuelve el backend
 * 
 */

/**
 * Aplana el menú anidado (útil para búsqueda por path).
 * @param {Array} menu - Menú anidado (items con children[])
 * @returns {Array} Items planos
 */
export function flattenMenu(menu = []) {
  const flat = [];
  const walk = (items) => {
    for (const item of items) {
      flat.push(item);
      if (item.children?.length) walk(item.children);
    }
  };
  walk(menu);
  return flat;
}

/**
 * Encuentra el contexto de menú activo para un pathname usando coincidencia
 * por prefijo más largo.
 *
 * @param {string} pathname - URL actual (ej: "/empleados/123/edit")
 * @param {Array} menu - Menú anidado del usuario
 * @returns {{ activeMenu: string, activePath: string[] } | null}
 */
export function findMenuContextByPath(pathname, menu = []) {
  const items = flattenMenu(menu);
  const lookup = new Map(items.map((item) => [item.id, item]));

  // Mapa id → id del padre (para subir por la cadena de ancestros)
  const parentMap = new Map();
  const walkParents = (nodes, parentId = null) => {
    for (const node of nodes) {
      parentMap.set(node.id, parentId);
      if (node.children?.length) walkParents(node.children, node.id);
    }
  };
  walkParents(menu);

  let bestMatch = null;
  let bestMatchLen = 0;
  for (const item of items) {
    if (!item.path || item.path === '#') continue;
    if (pathname === item.path || pathname.startsWith(item.path + '/')) {
      if (item.path.length > bestMatchLen) {
        bestMatch = item;
        bestMatchLen = item.path.length;
      }
    }
  }

  if (!bestMatch) return null;

  const activePath = [];
  let current = bestMatch;
  while (current?.id && parentMap.has(current.id) && lookup.has(parentMap.get(current.id))) {
    activePath.unshift(current.id);
    current = lookup.get(parentMap.get(current.id));
  }

  return {
    activeMenu: current?.id || bestMatch.id,
    activePath,
  };
}
