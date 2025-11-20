import React, { useMemo, useState } from "react";
import { Bell, Settings, User, Menu, Grid, ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";

// MeruLink - Prototype App Shell + Calendario Plaza Meru
// Single-file React component (TailwindCSS assumed)
// - Top navigation (primary menus)
// - Left sidebar (dynamic submenus, per-module, hides/attenuates by permissions)
// - Central area (Lobby: Calendar Plaza Meru) that becomes workspace for selected module
// - Logo acts as "volver al lobby"
// - Guest mode supported (limited permissions)

export default function AlternativaDos() {
  // Mock user and permissions
  const [user, setUser] = useState({
    name: "Riad Abdo",
    email: "riad@example.com",
    role: "admin", // 'admin' | 'manager' | 'viewer' | 'guest'
  });

  const [guestMode, setGuestMode] = useState(false);

  const [activeModule, setActiveModule] = useState("lobby"); // 'lobby' | 'dashboard' | 'users' | 'shifts' | 'reports'

  // simulate permissions map
  const permissions = useMemo(() => {
    const map = {
      admin: { dashboard: true, users: true, shifts: true, reports: true },
      manager: { dashboard: true, users: true, shifts: true, reports: false },
      viewer: { dashboard: true, users: false, shifts: false, reports: false },
      guest: { dashboard: false, users: false, shifts: false, reports: false },
    };
    return map[guestMode ? 'guest' : user.role];
  }, [user.role, guestMode]);

  // Top-level menu items (visible depending on permissions)
  const topMenus = [
    { key: "dashboard", label: "Dashboard", visible: permissions.dashboard },
    { key: "users", label: "Users", visible: permissions.users },
    { key: "shifts", label: "Shift schedules", visible: permissions.shifts },
    { key: "reports", label: "Reports", visible: permissions.reports },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo onClick={() => { setActiveModule('lobby'); setGuestMode(false); }} />

            <nav className="hidden md:flex items-center gap-4">
              {topMenus.map((m) => (
                m.visible ? (
                  <button
                    key={m.key}
                    onClick={() => setActiveModule(m.key)}
                    className={`px-3 py-1 rounded ${activeModule === m.key ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
                  >
                    {m.label}
                  </button>
                ) : null
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-slate-300 text-sm">{activeModule === 'lobby' ? 'Calendario Plaza Meru' : `Workspace — ${capitalize(activeModule)}`}</div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-72">
                <AssistantInput />
              </div>

              <button aria-label="Notificaciones" className="p-2 rounded hover:bg-slate-800"><Bell size={18} /></button>
              <button aria-label="Ajustes" className="p-2 rounded hover:bg-slate-800"><Settings size={18} /></button>

              <div className="flex items-center gap-3 border border-slate-700 rounded px-3 py-1">
                <User size={16} />
                <div className="text-sm leading-tight">
                  <div className="font-medium">{guestMode ? 'Invitado' : user.name}</div>
                  <div className="text-xs text-slate-400">{guestMode ? 'Modo invitado' : user.email}</div>
                </div>
              </div>

              {/* quick debug controls (not for prod) */}
              <div className="hidden md:flex items-center gap-2 ml-2">
                <select
                  value={user.role}
                  onChange={(e) => setUser((u) => ({ ...u, role: e.target.value }))}
                  className="bg-slate-800 text-slate-200 px-2 py-1 rounded"
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="viewer">viewer</option>
                </select>

                <button
                  onClick={() => { setGuestMode(!guestMode); if (!guestMode) setActiveModule('lobby'); }}
                  className="px-2 py-1 rounded border border-slate-700 text-sm"
                >
                  {guestMode ? 'Salir invitado' : 'Entrar como invitado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Left sidebar - dynamic subs (hidden on small screens) */}
        <aside className={`w-64 bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-opacity duration-300 ${activeModule === 'lobby' ? 'opacity-0 pointer-events-none translate-x-[-8px]' : 'opacity-100'}`}>
          <div className="text-xs text-slate-400 mb-3">Secciones</div>
          <SideMenu activeModule={activeModule} permissions={permissions} />
        </aside>

        {/* Main area (calendar or workspace) */}
        <main className="flex-1">
          <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-inner">
            {activeModule === 'lobby' ? (
              <CalendarLobby />
            ) : (
              <Workspace module={activeModule} onBack={() => setActiveModule('lobby')} permissions={permissions} />
            )}
          </div>

          <footer className="mt-6 text-center text-slate-500">Hotel Plaza Meru — V1.0 2025</footer>
        </main>
      </div>
    </div>
  );
}

/* ------------------------- Presentational / Small components ------------------------- */

function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 group">
      <div className="w-12 h-12 flex items-center justify-center transform -rotate-3 shadow-[0_8px_20px_rgba(0,0,0,0.6)] rounded-md border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-600 p-1">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="3" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
          <path d="M6 8h12v8H6z" stroke="#cbd5e1" strokeWidth="0.9" fill="none" />
        </svg>
      </div>
      <div className="hidden sm:block text-white text-lg font-semibold">MeruLink</div>
    </button>
  );
}

function AssistantInput() {
  return (
    <div className="w-full bg-slate-800/60 border border-slate-700 rounded px-3 py-2 text-slate-300 text-sm">
      <span className="text-slate-400">Send a message to the assistant...</span>
    </div>
  );
}

function SideMenu({ activeModule, permissions }) {
  const menus = {
    dashboard: ["Overview", "Quick actions", "System status"],
    users: ["List", "Roles", "Permissions"],
    shifts: ["Calendar view", "Create shift", "Templates"],
    reports: ["Monthly", "Custom reports", "Exports"],
  };

  const items = menus[activeModule] || [];

  if (activeModule === 'lobby') return (
    <div className="text-sm text-slate-400">Seleccione un módulo en el menú superior para ver submenús.</div>
  );

  // If user lacks permission, show attenuated UI
  if (!permissions[activeModule]) return (
    <div className="text-sm text-rose-400">No tiene acceso a este módulo.</div>
  );

  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it} className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer text-slate-200">{it}</div>
      ))}
    </div>
  );
}

function CalendarLobby() {
  // Simple month calendar mock (static) — placeholder for richer calendar library
  const weeks = useMemo(() => {
    // generate a 5-week grid with sample events to mimic the image
    const days = Array.from({ length: 35 }, (_, i) => ({ day: i + 1 }));
    const events = {
      3: [{ id: 1, title: 'Employee training', color: 'blue' }],
      16: [{ id: 2, title: 'Birthday party', color: 'blue' }],
      18: [{ id: 3, title: 'Wedding', color: 'blue' }],
      20: [{ id: 4, title: 'Holiday', color: 'amber' }],
    };
    const grid = [];
    for (let r = 0; r < 5; r++) grid.push(days.slice(r * 7, r * 7 + 7).map((d) => ({ ...d, events: events[d.day] || [] })));
    return grid;
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded bg-slate-800/40 border border-slate-700"><ChevronLeft size={16} /></button>
          <button className="p-2 rounded bg-slate-800/40 border border-slate-700"><ChevronRight size={16} /></button>
          <button className="px-3 py-2 rounded bg-slate-700">Today</button>
        </div>

        <div className="text-slate-300 font-medium">October 2025</div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded p-4">
        <div className="grid grid-cols-7 gap-2 text-sm text-slate-400">
          <div className="text-center">Sunday</div>
          <div className="text-center">Monday</div>
          <div className="text-center">Tuesday</div>
          <div className="text-center">Wednesday</div>
          <div className="text-center">Thursday</div>
          <div className="text-center">Friday</div>
          <div className="text-center">Saturday</div>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-3">
          {weeks.map((week, i) => (
            <div key={i} className="col-span-7 grid grid-cols-7 gap-3">
              {week.map((cell) => (
                <div key={cell.day} className="min-h-[84px] bg-slate-800/30 border border-slate-800 rounded p-2 text-sm">
                  <div className="text-slate-300/80 text-right">{cell.day}</div>
                  <div className="mt-2 space-y-2">
                    {cell.events.map((ev) => (
                      <div key={ev.id} className={`inline-block px-2 py-1 rounded text-xs ${ev.color === 'blue' ? 'bg-sky-700/80 text-white' : 'bg-amber-700/80 text-white'}`}>
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Workspace({ module, onBack, permissions }) {
  if (!permissions[module]) return (
    <div className="p-8 text-center text-rose-400">Acceso denegado. Vuelva al lobby o contacte a un administrador.</div>
  );

  // Each module uses the calendar area as workspace. Keep UI minimal and focused.
  switch (module) {
    case 'dashboard':
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <button onClick={onBack} className="px-3 py-1 rounded bg-slate-700">Volver a Plaza Meru</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Conectores" value="12" />
            <StatCard title="Errores" value="1" />
            <StatCard title="Sincronizaciones" value="3" />
          </div>
        </div>
      );
    case 'users':
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Usuarios</h2>
            <div>
              <button className="px-3 py-1 rounded bg-slate-700 mr-2">+ Nuevo usuario</button>
              <button onClick={onBack} className="px-3 py-1 rounded bg-slate-700">Volver</button>
            </div>
          </div>
          <div className="bg-slate-800/30 rounded p-4">(Lista de usuarios - placeholder)</div>
        </div>
      );
    case 'shifts':
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Shift schedules</h2>
            <button onClick={onBack} className="px-3 py-1 rounded bg-slate-700">Volver</button>
          </div>
          <div className="bg-slate-800/30 rounded p-4">(Editor de turnos - placeholder)</div>
        </div>
      );
    case 'reports':
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Reports</h2>
            <button onClick={onBack} className="px-3 py-1 rounded bg-slate-700">Volver</button>
          </div>
          <div className="bg-slate-800/30 rounded p-4">(Generador de reportes - placeholder)</div>
        </div>
      );
    default:
      return <div>Workspace: {module}</div>;
  }
}

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-800/40 rounded p-4">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

/* ------------------------- Helpers ------------------------- */
function capitalize(s) { if (!s) return s; return s.charAt(0).toUpperCase() + s.slice(1); }