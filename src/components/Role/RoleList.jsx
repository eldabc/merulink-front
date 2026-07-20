import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Key, ChevronRight, ChevronDown } from 'lucide-react';
import { getRolesPermissions, getEmployeesByPermission } from '../../services/masterDataService';
import TitleHeader from '../Shared/TitleHeader';
import LoadingSpinner from '../Shared/LoadingSpinner';

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [selectedPermissionLabel, setSelectedPermissionLabel] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadRolesData = async () => {
      try {
        const res = await getRolesPermissions();
        setRoles(res.data || []);
      } catch (error) {
        console.error('Error cargando Roles', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadRolesData();
  }, []);

  const handleRoleClick = (role) => {
    setSelectedRole(role.value === selectedRole?.value ? null : role);
    setExpandedModule(null);
    setSelectedPermission(null);
    setEmployees([]);
  };

  const toggleModule = (moduleKey) => {
    setExpandedModule(expandedModule === moduleKey ? null : moduleKey);
    setSelectedPermission(null);
    setEmployees([]);
  };

  const handlePermissionClick = async (perKey, permName) => {
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
                    <span className="text-xs text-[#9fd8ff] bg-[#fffdfd21] px-2 py-0.5 rounded-full shrink-0">
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

        {/* === Columna 2: Permisos agrupados por módulo === */}
        <div
          className={`transition-all duration-400 overflow-hidden ${
            selectedRole ? 'w-80 opacity-100 ml-0' : 'w-0 opacity-0 -ml-4'
          }`}
        >
          {selectedRole && (
            <div className="bg-[#ffffff0a] border border-[#ffffff21] rounded-xl p-4 h-full min-w-[320px] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#ffffff21]">
                <Shield className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white truncate">{selectedRole.label}</h2>
              </div>

              <div className="space-y-1">
                {(selectedRole.permissionGroups || []).map((group) => (
                  <div key={group.key}>
                    {/* Encabezado del módulo (acordeón) */}
                    <button
                      onClick={() => toggleModule(group.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                        expandedModule === group.key
                          ? 'bg-[#9fd8ff15] border border-[#9fd8ff40]'
                          : 'hover:bg-[#ffffff0f] border border-transparent'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-green-400/70 shrink-0" />
                      <span className="text-sm text-gray-200 truncate flex-1 font-medium">
                        {group.label}
                      </span>
                      <span className="text-xs text-[#9fd8ff] bg-[#fffdfd21] px-2 py-0.5 rounded-full shrink-0">
                        {group.permissions.length}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${
                          expandedModule === group.key ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Permisos del módulo (expandible) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedModule === group.key ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-4 border-l border-[#ffffff15] pl-2 space-y-0.5">
                        {group.permissions.map((perm) => (
                          <button
                            key={perm.key}
                            onClick={() => handlePermissionClick(perm.key, perm.label)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors duration-200 ${
                              selectedPermission === perm.key
                                ? 'bg-[#9fd8ff15] border border-[#9fd8ff40]'
                                : 'hover:bg-[#ffffff0f] border border-transparent'
                            }`}
                          >
                            <Users className="w-3.5 h-3.5 text-green-400/50 shrink-0" />
                            <span className="text-gray-300 truncate flex-1">{perm.label}</span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 shrink-0 ${
                                selectedPermission === perm.key ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
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
                <span className="ml-auto text-xs text-[#9fd8ff] bg-[#fffdfd21] px-2 py-0.5 rounded-full">
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
                        <span className="text-xs text-gray-500">Dep. {emp.department} — {emp.position}</span>
                        <span className="text-xs text-gray-500">Rol. {emp.roleName}</span>
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