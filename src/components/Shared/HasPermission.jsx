import React from 'react';
import { useAuth } from '../../context/AuthContext';

const HasPermission = ({ name, children, fallback = null }) => {
  const { user } = useAuth();

  // Si el usuario tiene el permiso, mostramos lo que envuelve. Si no, mostramos el fallback (o nada)
  const hasPermission = user?.permissions?.includes(name);

  if (!hasPermission) {
    return fallback;
  }

  return <>{children}</>;
};

export default HasPermission;