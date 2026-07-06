import { useAuth } from '../../context/AuthContext';

/**
 * Muestra children solo si el usuario posee AL MENOS UNO de los permisos indicados.
 * @param {string[]}    [permissions] - Array de permisos.
 * @param {boolean}     [requireAll]  - Si es true, el usuario debe tener TODOS los permisos en vez de al menos uno.
 * @param {ReactNode}   [fallback]    - Contenido a mostrar si no tiene los permisos (default: null).
 */
const HasPermission = ({ permissions = [], children, fallback = null, requireAll = false }) => {
  
  const { user } = useAuth();
  const list = permissions;

  if (list.length === 0) return <>{children}</>;

  const hasPermission = requireAll
    ? list.every(p => user?.permissions?.includes(p))
    : list.some(p => user?.permissions?.includes(p));

  if (!hasPermission) return fallback;

  return <>{children}</>;
};

export default HasPermission;