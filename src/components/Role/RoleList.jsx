import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Key, ChevronRight } from 'lucide-react';
import { getRoles, getEmployeesByPermission } from '../../services/masterDataService';
import TitleHeader from '../Shared/TitleHeader';
import LoadingSpinner from '../Shared/LoadingSpinner';

// Columnas CRUD estándar
const CRUD_ACTIONS = ['create', 'view', 'edit', 'delete'];
const CRUD_LABELS = { create: 'Crear', view: 'Ver', edit: 'Editar', delete: 'Eliminar' };

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [selectedPermissionLabel, setSelectedPermissionLabel] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  console.log("selectedPermissionLabel", selectedPermissionLabel)
  useEffect(() => {
    const loadRolesData = async () => {
      try {
        const res = await getRoles();
        setRoles(res.data || []);
      } catch (error) {
        console.error("Error cargando Roles", error);
      } finally {
        setLoadingData(false);
      }
    };

     loadRolesData();
  }, []);

  const handleRoleClick = (role) => {
    setSelectedRole(role.value === selectedRole?.value ? null : role);
    setSelectedPermission(null);
    setEmployees([]);
  };

  const handlePermissionClick = async (perKey, permName) => {
    // console.log("permName ff", perKey)
    if (selectedPermission === perKey) {
      setSelectedPermission(null);
      setEmployees([]);
      return;
    }
    setSelectedPermission(perKey);
    setSelectedPermissionLabel(permName);
    setLoadingEmployees(true);
    try {
      const data = await getEmployeesByPermission(perKey, selectedRole);
      setEmployees(data);
    } catch {
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  return (
    <div className="p-4">
      <TitleHeader title="Roles y Permisos" dinamicClasses="mb-6" />

      <div className="flex gap-4 items-stretch min-h-[500px]">
        {/* === Columna 1: Roles === */}
        <div className="shrink-0 w-72 transition-all duration-300">
          <div className="bg-[#ffffff0a] border border-[#ffffff21] rounded-xl p-4 h-full">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ffffff21]">
              <Shield className="w-5 h-5 text-[#9fd8ff]" />
              <h2 className="text-lg font-bold text-white">Roles</h2>
              <span className="ml-auto text-xs text-gray-500">{roles.length}</span>
            </div>

            <ul className="space-y-1">
              {loadingData ? (
                <LoadingSpinner />
              ) : roles.map((role) => (
                <li key={role.value}>
                  <button
                    onClick={() => handleRoleClick(role)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                      selectedRole?.value === role.value
                        ? 'bg-[#9fd8ff15] border border-[#9fd8ff40]'
                        : 'hover:bg-[#ffffff0f] border border-transparent'
                    }`}
                  >
                    <Key className="w-4 h-4 text-[#9fd8ff] shrink-0" />
                    <span className="text-sm text-gray-200 truncate flex-1">{role.label}</span>
                    <span className="text-xs text-gray-500 bg-[#ffffff15] px-2 py-0.5 rounded-full shrink-0">
                      {role.employeeCount}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${
                        selectedRole?.value === role.value ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* === Columna 2: Permisos (slide-in) === */}
        <div
          className={`transition-all duration-400 overflow-hidden ${
            selectedRole ? 'w-80 opacity-100 ml-0' : 'w-0 opacity-0 -ml-4'
          }`}
        >
          {selectedRole && (
            <div className="bg-[#ffffff0a] border border-[#ffffff21] rounded-xl p-4 h-full min-w-[320px]">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ffffff21]">
                <Shield className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white truncate">{selectedRole.label}</h2>
              </div>

              <div className="space-y-0.5">
                {/* Permisos CRUD por módulo */}
                {selectedRole.permissionModules?.length > 0 && (
                  <>
                    {(selectedRole.permissionModules).flatMap((mod) =>
                      CRUD_ACTIONS
                        .filter((a) => mod[a])
                        .map((a) => (
                          <button
                            key={`${a}-${mod.key}`}
                            onClick={() => handlePermissionClick(`${a}-${mod.key}`, `${CRUD_LABELS[a]} ${mod.label}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors duration-200 ${
                              selectedPermission === `${a}-${mod.key}`
                                ? 'bg-[#9fd8ff15] border border-[#9fd8ff40]'
                                : 'hover:bg-[#ffffff0f] border border-transparent'
                            }`}
                          >
                            <Users className="w-4 h-4 text-green-400/70 shrink-0" />
                            <span className="text-gray-200 truncate flex-1">
                              {CRUD_LABELS[a]} {mod.label}
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${
                                selectedPermission === `${a}-${mod.key}` ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        ))
                    )}

                    {selectedRole.permissionSpecials?.length > 0 && (
                      <div className="pt-3 mt-3 border-t border-[#ffffff15]">
                        <p className="text-[12px] uppercase tracking-wider text-gray-500 px-3 mb-1">
                          Especiales
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Permisos especiales */}
                {(selectedRole.permissionSpecials || []).map((perm) => (
                  <button
                    key={perm.key}
                    onClick={() => handlePermissionClick(perm.key, perm.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors duration-200 ${
                      selectedPermission === perm.key
                        ? 'bg-[#9fd8ff15] border border-[#9fd8ff40]'
                        : 'hover:bg-[#ffffff0f] border border-transparent'
                    }`}
                  >
                    <Users className="w-4 h-4 text-green-400/70 shrink-0" />
                    <span className="text-gray-200 truncate flex-1">{perm.label}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${
                        selectedPermission === perm.key ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* === Columna 3: Empleados (slide-in) === */}
        <div
          className={`transition-all duration-400 overflow-hidden ${
            selectedPermission ? 'w-96 opacity-100 ml-0' : 'w-0 opacity-0 -ml-4'
          }`}
        >
          {selectedPermission && (
            <div className="bg-[#ffffff0a] border border-[#ffffff21] rounded-xl p-4 h-full min-w-[384px]">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ffffff21]">
                <Users className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white truncate">
                  {selectedPermissionLabel}
                </h2>
                <span className="ml-auto text-xs text-gray-500">
                  {!loadingEmployees && employees.length}
                </span>
              </div>

              {loadingEmployees ? (
                <LoadingSpinner />
              ) : employees.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Sin empleados asignados
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {employees.map((emp) => (
                    <li key={emp.id}>
                      <Link
                        to={`/empleados/ver/${emp.id}`}
                        className="flex flex-col gap-0.5 px-3 py-2 rounded-lg hover:bg-[#ffffff0f] transition-colors duration-200 border border-transparent"
                      >
                        <span className="text-sm text-gray-200">{emp.name}</span>
                        <span className="text-xs text-gray-500">{emp.department} — {emp.position}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}