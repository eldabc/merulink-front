const menuItems = [
  { id: "IA", label: "IA", path: "/ia", hidden: true  },
  { id: "RRHH", label: "Empleados", path: "/empleados", permission: "view-employees" },
  { id: "Departamentos", label: "Departamentos", path: "/empleados/departamentos", parentId: "RRHH", permission: "view-departments" },
  { id: "Sub-Departamentos", label: "Sub-Departamentos", path: "/empleados/sub-departamentos", parentId: "RRHH", permission: "view-subdepartments" },
  { id: "Cargos", label: "Cargos", path: "/empleados/cargos", parentId: "RRHH", permission: "view-positions" },
  { id: "Roles", label: "Roles", path: "#", parentId: "RRHH" },
  { id: "Asignaciones", label: "Asignaciones", path: "/empleados/roles/asignaciones", parentId: "Roles", permission: "view-assigns" },
  { id: "Roles y Permisos", label: "Roles y Permisos", path: "/empleados/roles", parentId: "Roles", permission: "view-roles" },
  { id: "Planificación", label: "Planificación", path: "#", parentId: "RRHH" },
  { id: "Turnos", label: "Turnos", path: "/empleados/turnos", parentId: "Planificación", permission: "view-shifts" },
  { id: "Horarios", label: "Horarios", path: "/empleados/horarios", parentId: "Planificación", permission: "view-schedules" },
  { id: "Vestuarios", label: "Vestuarios", path: "#", parentId: "RRHH" },
  { id: "Lockers", label: "Lockers", path: "/empleados/vestuarios/lockers", parentId: "Vestuarios", permission: "view-lockers" },
  { id: "Candados", label: "Candados", path: "/empleados/vestuarios/candados", parentId: "Vestuarios", permission: "view-padlocks" },
  { id: "Patrones Candados", label: "Patrones", path: "/empleados/vestuarios/candados/patrones", parentId: "Vestuarios", permission: "view-padlocks" },
  { id: "Casilleros", label: "Asignaciones", path: "/empleados/vestuarios/casilleros", parentId: "Vestuarios", permission: "view-assigns" },
  { id: "Sistemas", label: "Sistemas", path: "/sistemas", hidden: true },
  { id: "APs Internet", label: "APs Internet", path: "/sistemas/aps-internet", parentId: "Sistemas", hidden: true },
  { id: "Domotica", label: "Domotica", path: "/sistemas/domotica", parentId: "Sistemas", hidden: true },
  { id: "Mantenimiento", label: "Mantenimiento", path: "/sistemas/mantenimiento", parentId: "Sistemas", hidden: true },
  { id: "Inventario", label: "Inventario", path: "/inventario", hidden: true },
  { id: "Stock", label: "Stock", path: "/inventario/stock", parentId: "Inventario", hidden: true },
  { id: "Entradas", label: "Entradas", path: "/inventario/entradas", parentId: "Inventario", hidden: true },
  { id: "Salidas", label: "Salidas", path: "/inventario/salidas", parentId: "Inventario", hidden: true },
  { id: "Recepcion", label: "Whatsapp", path: "/whatsapp", hidden: true },
  { id: "Ventas", label: "Ventas", path: "/whatsapp/ventas", parentId: "Recepcion", hidden: true },
  { id: "AyB", label: "AyB", path: "/whatsapp/ayb", parentId: "Recepcion", hidden: true },
  { id: "Ventas-Top", label: "Ventas", path: "/ventas", hidden: true },
  { id: "Productos", label: "Productos", path: "/ventas/productos", parentId: "Ventas-Top", hidden: true },
  { id: "Alimentos y Bebidas", label: "Alimentos y Bebidas", path: "/ayb", hidden: true },
  { id: "Menu", label: "Menú", path: "/ayb/menu", parentId: "Alimentos y Bebidas", hidden: true },
  { id: "Mantenimiento-Top", label: "Mantenimiento", path: "/mantenimiento", hidden: true },
  { id: "Configuración", label: "Configuración", path: "/configuracion", hidden: true },
  { id: "Sistema", label: "Sistema", path: "/configuracion/sistema", parentId: "Configuración", hidden: true },
  { id: "Seguridad", label: "Seguridad", path: "/configuracion/seguridad", parentId: "Configuración", hidden: true },
  { id: "Notificaciones", label: "Notificaciones", path: "/configuracion/notificaciones", parentId: "Configuración", hidden: true },
  { id: "Documentos", label: "Documentos", path: "/documentos", hidden: true },
  { id: "Memos", label: "Memos", path: "/documentos/memos", parentId: "Documentos", hidden: true },
  { id: "Reglamento", label: "Reglamento", path: "/documentos/reglamento", parentId: "Documentos", hidden: true }
];

function buildMenuTree(items) {
  const nodes = items.map((item) => ({ ...item, children: [] }));
  const nodeById = new Map(nodes.map((item) => [item.id, item]));

  const roots = [];
  for (const item of items) {
    const node = nodeById.get(item.id);
    if (!item.parentId) {
      roots.push(node);
      continue;
    }

    const parent = nodeById.get(item.parentId);
    if (parent) {
      parent.children.push(node);
    }
  }

  return roots;
}

export const menuTree = buildMenuTree(menuItems);
export const topMenuItems = menuItems.filter((item) => !item.parentId).map((item) => item.id);

/**
 * Filtra los items del menú según los permisos del usuario.
 * 
 * Reglas:
 * - Ítem con `hidden: true`: siempre excluido (módulo no desarrollado).
 * - Ítem con `permission`: se muestra solo si el usuario tiene ese permiso.
 * - Ítem sin `permission` ni `hidden`: se muestra si es hoja, o si tiene al menos un hijo visible.
 * - Un padre contenedor se oculta si todos sus hijos están ocultos.
 *
 * @param {Array} items - Array plano de items del menú
 * @param {string[]} userPermissions - Array de permisos del usuario
 * @returns {Array} Items filtrados
 */
export function filterMenuItemsByPermissions(items, userPermissions) {
  if (!userPermissions || userPermissions.length === 0) return items;

  const permSet = new Set(userPermissions);

  // ---- Preprocesar: excluir items hidden y todos sus descendientes ----
  const hiddenDescendants = new Set();
  const collectDescendants = (parentId) => {
    for (const child of items) {
      if (child.parentId === parentId && !hiddenDescendants.has(child.id)) {
        hiddenDescendants.add(child.id);
        collectDescendants(child.id);
      }
    }
  };
  for (const item of items) {
    if (item.hidden) {
      hiddenDescendants.add(item.id);
      collectDescendants(item.id);
    }
  }

  // Índice: parentId → ids de hijos
  const childrenMap = new Map();
  for (const item of items) {
    const parentId = item.parentId || '__root__';
    if (!childrenMap.has(parentId)) childrenMap.set(parentId, []);
    childrenMap.get(parentId).push(item.id);
  }

  // Memoización de visibilidad por id
  const keep = new Map();

  function shouldKeep(itemId) {
    if (keep.has(itemId)) return keep.get(itemId);

    // Oculto por flag hidden (módulo no desarrollado)
    if (hiddenDescendants.has(itemId)) {
      keep.set(itemId, false);
      return false;
    }

    const item = items.find(i => i.id === itemId);
    if (!item) { keep.set(itemId, false); return false; }

    const children = childrenMap.get(itemId) || [];
    const anyChildKept = children.some(childId => shouldKeep(childId));

    let result;
    if (item.permission) {
      // Tiene permiso requerido → solo si el usuario lo posee
      result = permSet.has(item.permission);
    } else {
      // Sin permiso → se muestra si es hoja O tiene al menos un hijo visible
      result = children.length === 0 || anyChildKept;
    }

    keep.set(itemId, result);
    return result;
  }

  return items.filter(item => shouldKeep(item.id));
}

/**
 * Construye el árbol de menú filtrado por permisos.
 */
export function getFilteredMenuTree(userPermissions) {
  return buildMenuTree(filterMenuItemsByPermissions(menuItems, userPermissions));
}

/**
 * Obtiene los items del menú superior filtrados por permisos.
 */
export function getFilteredTopMenuItems(userPermissions) {
  const filtered = filterMenuItemsByPermissions(menuItems, userPermissions);
  return filtered.filter(item => !item.parentId).map(item => item.id);
}

/**
 * Find the menu context for a given pathname using longest-prefix matching.
 * This allows nested routes like /empleados/123/edit to match the /empleados menu item.
 *
 * @param {string} pathname - The current URL pathname (e.g., "/empleados/123/edit")
 * @returns {{ activeMenu: string, activePath: string[] } | null}
 */
export function findMenuContextByPath(pathname) {
  const lookup = new Map(menuItems.map((item) => [item.id, item]));

  // Find the best matching menu item: the one whose path is the longest
  // prefix of the current pathname. E.g., /empleados/123/edit matches /empleados.
  let bestMatch = null;
  let bestMatchLen = 0;

  for (const item of menuItems) {
    if (item.path === '#' || !item.path) continue;
    // Match if pathname equals item.path OR pathname starts with item.path followed by /
    if (pathname === item.path || pathname.startsWith(item.path + '/')) {
      if (item.path.length > bestMatchLen) {
        bestMatch = item;
        bestMatchLen = item.path.length;
      }
    }
  }

  if (!bestMatch) {
    return null;
  }

  // Build activePath by walking up the parent chain
  const activePath = [];
  let current = bestMatch;

  while (current?.parentId && lookup.has(current.parentId)) {
    activePath.unshift(current.id);
    current = lookup.get(current.parentId);
  }

  return {
    activeMenu: current?.id || bestMatch.id,
    activePath,
  };
}
  