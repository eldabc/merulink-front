const menuItems = [
  { id: "IA", label: "IA", path: "/ia" },
  { id: "RRHH", label: "Empleados", path: "/empleados" },
  { id: "Departamentos", label: "Departamentos", path: "/empleados/departamentos", parentId: "RRHH" },
  { id: "Sub-Departamentos", label: "Sub-Departamentos", path: "/empleados/sub-departamentos", parentId: "RRHH" },
  { id: "Cargos", label: "Cargos", path: "/empleados/cargos", parentId: "RRHH" },
  { id: "Roles", label: "Roles", path: "/empleados/roles", parentId: "RRHH" },
  { id: "Planificación", label: "Planificación", path: "#", parentId: "RRHH" },
  { id: "Turnos", label: "Turnos", path: "/empleados/turnos", parentId: "Planificación" },
  { id: "Asignar", label: "Horarios", path: "/empleados/horarios", parentId: "Planificación" },
  { id: "Vestuarios", label: "Vestuarios", path: "#", parentId: "RRHH" },
  { id: "Lockers", label: "Lockers", path: "/empleados/vestuarios/lockers", parentId: "Vestuarios" },
  { id: "Candados", label: "Candados", path: "/empleados/vestuarios/candados", parentId: "Vestuarios" },
  { id: "Patrones Candados", label: "Patrones", path: "/empleados/vestuarios/candados/patrones", parentId: "Vestuarios" },
  { id: "Casilleros", label: "Asignaciones", path: "/empleados/vestuarios/casilleros", parentId: "Vestuarios" },
  { id: "Sistemas", label: "Sistemas", path: "/sistemas" },
  { id: "APs Internet", label: "APs Internet", path: "/sistemas/aps-internet", parentId: "Sistemas" },
  { id: "Domotica", label: "Domotica", path: "/sistemas/domotica", parentId: "Sistemas" },
  { id: "Mantenimiento", label: "Mantenimiento", path: "/sistemas/mantenimiento", parentId: "Sistemas" },
  { id: "Inventario", label: "Inventario", path: "/inventario" },
  { id: "Stock", label: "Stock", path: "/inventario/stock", parentId: "Inventario" },
  { id: "Entradas", label: "Entradas", path: "/inventario/entradas", parentId: "Inventario" },
  { id: "Salidas", label: "Salidas", path: "/inventario/salidas", parentId: "Inventario" },
  { id: "Recepcion", label: "Whatsapp", path: "/whatsapp" },
  { id: "Ventas", label: "Ventas", path: "/whatsapp/ventas", parentId: "Recepcion" },
  { id: "AyB", label: "AyB", path: "/whatsapp/ayb", parentId: "Recepcion" },
  { id: "Ventas-Top", label: "Ventas", path: "/ventas" },
  { id: "Productos", label: "Productos", path: "/ventas/productos", parentId: "Ventas-Top" },
  { id: "Alimentos y Bebidas", label: "Alimentos y Bebidas", path: "/ayb" },
  { id: "Menu", label: "Menú", path: "/ayb/menu", parentId: "Alimentos y Bebidas" },
  { id: "Mantenimiento-Top", label: "Mantenimiento", path: "/mantenimiento" },
  { id: "Configuración", label: "Configuración", path: "/configuracion" },
  { id: "Sistema", label: "Sistema", path: "/configuracion/sistema", parentId: "Configuración" },
  { id: "Seguridad", label: "Seguridad", path: "/configuracion/seguridad", parentId: "Configuración" },
  { id: "Notificaciones", label: "Notificaciones", path: "/configuracion/notificaciones", parentId: "Configuración" },
  { id: "Documentos", label: "Documentos", path: "/documentos" },
  { id: "Memos", label: "Memos", path: "/documentos/memos", parentId: "Documentos" },
  { id: "Reglamento", label: "Reglamento", path: "/documentos/reglamento", parentId: "Documentos" }
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

export function findMenuContextByPath(pathname) {
  const lookup = new Map(menuItems.map((item) => [item.id, item]));
  const match = menuItems.find((item) => item.path === pathname);

  if (!match) {
    return null;
  }

  const activePath = [];
  let current = match;

  while (current?.parentId && lookup.has(current.parentId)) {
    activePath.unshift(current.id);
    current = lookup.get(current.parentId);
  }

  return {
    activeMenu: current?.id || match.id,
    activePath
  };
}
  