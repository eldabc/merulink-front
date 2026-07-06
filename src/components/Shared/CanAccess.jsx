import { useAuth } from '../../context/AuthContext';

/**
 * Dar acceso a perfiles y permisos específicos a un componente hijo, o mostrar un fallback si no tiene acceso.
 */
const CanAccess = ({ roles = [], permissions = [], children, fallback = null, mode = 'all' }) => {
  const { user } = useAuth();

  const hasRoles = roles.length === 0 || roles.some(r => user?.roles?.includes(r));
  const hasPermissions = permissions.length === 0 || permissions.some(p => user?.permissions?.includes(p));

  const allowed = mode === 'any' 
    ? (hasRoles || hasPermissions) 
    : (hasRoles && hasPermissions);

  return allowed ? <>{children}</> : fallback;
};