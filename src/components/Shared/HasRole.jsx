import { useAuth } from '../../context/AuthContext';

const HasRole = ({ roles, children, fallback = null }) => {

  const { user } = useAuth();
  
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  const hasRole = rolesArray.some(role => user?.roles?.includes(role));

  if (!hasRole) return fallback;
  return <>{children}</>;
};

export default HasRole;