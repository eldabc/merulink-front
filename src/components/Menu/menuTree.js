export const menuTree = {
    IA: {
      _meta: { label: "IA", path: "/ia" }
    },
    RRHH: {
      _meta: { label: "Empleados", path: "/empleados" },
      Roles: { _meta: { label: "Roles", path: "/empleados/roles" } },
      Casilleros: { _meta: { label: "Casilleros", path: "/empleados/casilleros" } },
      Horarios: {
        _meta: { label: "Horarios", path: "/empleados/horarios" },
        "Crear Turno": { _meta: { label: "Crear Turno", path: "/empleados/horarios/crear-turno" } },
        Asignar: { _meta: { label: "Asignar", path: "/empleados/vestuarios/candados" } }
      },
      Departamentos: { _meta: { label: "Departamentos", path: "/empleados/departamentos" } },
      "Sub-Departamentos": { _meta: { label: "Sub-Departamentos", path: "/empleados/sub-departamentos" } },
      Cargos: { _meta: { label: "Cargos", path: "/empleados/cargos" } },
      Vestuarios: {
        _meta: { label: "Vestuarios", path: "/empleados/vestuarios" },
        Lockers: { _meta: { label: "Lockers", path: "/empleados/vestuarios/lockers" } },
        Candados: { _meta: { label: "Candados", path: "/empleados/vestuarios/candados" } }
      }
    },
    Sistemas: {
      _meta: { label: "Sistemas", path: "/sistemas" },
      "APs Internet": { _meta: { label: "APs Internet", path: "/sistemas/aps-internet" } },
      Domotica: { _meta: { label: "Domotica", path: "/sistemas/domotica" } },
      Mantenimiento: { _meta: { label: "Mantenimiento", path: "/sistemas/mantenimiento" } }
    },
    Inventario: {
      _meta: { label: "Inventario", path: "/inventario" },
      Stock: { _meta: { label: "Stock", path: "/inventario/stock" } },
      Entradas: { _meta: { label: "Entradas", path: "/inventario/entradas" } },
      Salidas: { _meta: { label: "Salidas", path: "/inventario/salidas" } }
    },
    Recepcion: {
      _meta: { label: "Whatsapp", path: "/whatsapp" },
      // Recepcion: { _meta: { label: "Recepcion", path: "/whatsapp/recepcion" } },
      Ventas: { _meta: { label: "Ventas", path: "/whatsapp/ventas" } },
      AyB: { _meta: { label: "AyB", path: "/whatsapp/ayb" } }
    },
    Ventas: {
      _meta: { label: "Ventas", path: "/ventas" },
      Productos: { _meta: { label: "Productos", path: "/ventas/productos" } },
    },
    "Alimentos y Bebidas": {
      _meta: { label: "Alimentos y Bebidas", path: "/ayb" },
      Menu: { _meta: { label: "Menú", path: "/ayb/menu" } },
    },
    Mantenimiento: {
      _meta: { label: "Mantenimiento", path: "/mantenimiento" },
    },
    Configuración: {
      _meta: { label: "Configuración", path: "/configuracion" },
      Sistema: { _meta: { label: "Sistema", path: "/configuracion/sistema" } },
      Seguridad: { _meta: { label: "Seguridad", path: "/configuracion/seguridad" } },
      Notificaciones: { _meta: { label: "Notificaciones", path: "/configuracion/notificaciones" } }
    },
    Documentos: {
      _meta: { label: "Documentos", path: "/documentos" },
      Memos: { _meta: { label: "Memos", path: "/documentos/memos" } },
      Reglamento: { _meta: { label: "Reglamento", path: "/documentos/reglamento" } }
    }
  };
  