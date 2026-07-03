import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


// 🛡️ Envoltorio rápido para proteger componentes individuales en línea
function ProtectedElement({ element, permission }) {
  const { user } = useAuth();
  
  // Si el usuario tiene el permiso de Spatie, adelante. Si no, lo rebota al listado principal.
  if (user?.permissions.includes(permission)) {
    return element;
  }
  
  // Puedes mandarlo a una página de 403 o simplemente regresarlo a la raíz del módulo
  return <Navigate to="/403"  />;
}

export default ProtectedElement;