import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], allowedPermissions = [] }) => {
  const { user, isAuthenticated, authLoading } = useAuth();

  // Si el contexto aún está cargando la sesión del localStorage, mostramos un spinner gris
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1e2022] flex items-center justify-center text-gray-400 font-bold">
        Cargando seguridad...
      </div>
    );
  }

  // Si no está autenticado, directo al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se exigen roles específicos y el usuario no tiene NINGUNO de ellos
  if (allowedRoles.length > 0) {
    const hasRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) return <Navigate to="/login" replace />; // O a una página 403
  }

  // Si se exigen permisos específicos y el usuario no tiene NINGUNO de ellos
  if (allowedPermissions.length > 0) {
    const hasPermission = user.permissions.some(perm => allowedPermissions.includes(perm));
    if (!hasPermission) return <Navigate to="/login" replace />;
  }

  // Si pasa todas las vacunas, renderiza la ruta hija mediante el <Outlet /> de React Router
  return <Outlet />;
};

export default ProtectedRoute;