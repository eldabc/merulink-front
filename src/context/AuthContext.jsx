import axios from 'axios';
import { ENV } from '../config/env';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNotification } from "./NotificationContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const isCleaningUp = useRef(false); // evita múltiples cierres por 401

  // Limpiar estado de sesión (sin llamar al backend)
  const clearSession = useCallback(() => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  // Al montar la app, verifica si ya había una sesión en LocalStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const roles = localStorage.getItem('userRoles');
    const roleName = localStorage.getItem('userRoleName');
    const permissions = localStorage.getItem('userPermissions');
    const departmentId = localStorage.getItem('departmentId');
    const isAdmin = localStorage.getItem('userIsAdmin');

    if (token && name) {
      // Rehidrata el estado global en memoria
      setUser({
        name,
        email,
        roles: roles ? JSON.parse(roles) : [],
        roleName: roleName ?? "",
        permissions: permissions ? JSON.parse(permissions) : [],
        departmentId: departmentId ? Number(departmentId) : null,
        isAdmin
      });

      // Configuramos axios con el token por defecto para todas las peticiones a Laragon
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Interceptor global de Axios: detecta 401 y cierra sesión automáticamente
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401 && !isCleaningUp.current) {
          isCleaningUp.current = true;
          clearSession();
          showNotification('Sesión expirada', 'Tu sesión ha sido cerrada. Vuelve a iniciar sesión.', 'warning');
          // Redirigir al login si no estamos en él
          if (window.location.pathname !== '/login') {
            setTimeout(() => {
              window.location.href = '/login';
            }, 300);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [clearSession, showNotification]);

  // Iniciar sesión desde Login
  const loginContext = (token, userData) => {
    isCleaningUp.current = false;
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('departmentId', userData.departmentId);
    localStorage.setItem('userRoles', JSON.stringify(userData.roles));
    localStorage.setItem('userRoleName', JSON.stringify(userData.roleName));
    localStorage.setItem('userPermissions', JSON.stringify(userData.permissions));
    localStorage.setItem('userIsAdmin', userData.roles.includes('admin'));

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ ...userData, isAdmin: userData.roles.includes('admin') });
  };

  // Cerrar sesión (manual o por inactividad)
  const logoutContext = async () => {
    try {
      const response = await axios.post(`${ENV.API_BACK_URL}logout`);
      return response.data; 
    } catch (error) {
      console.error("Error al revocar el token en el backend:", error);
    } finally {
      clearSession();
      showNotification('Sesión cerrada', 'Has cerrado sesión correctamente.', 'success');
    }
  };

  const logoutDueToInactivity = () => {
    clearSession();
    showNotification('Sesión cerrada', 'Tu sesión fue cerrada por inactividad.', 'warning');
  };

  const authLogin = async (data) => {
    const response = await axios.post(`${ENV.API_BACK_URL}login`, data);
    const { access_token, temp_token, requires_password_change, user } = response.data;

    // Si el usuario debe cambiar contraseña, guardar token temporal y redirigir
    if (requires_password_change && temp_token) {
      localStorage.setItem('tempToken', temp_token);
      localStorage.setItem('tempUser', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${temp_token}`;
      return { requiresPasswordChange: true };
    }

    loginContext(access_token, user);
    // Configurar Axios de forma global para futuros requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return { requiresPasswordChange: false };
  };

  // Cambiar contraseña
  const changePasswordContext = async (data) => {
    try {
      const response = await axios.post(`${ENV.API_BACK_URL}change-password`, data);
      const { access_token, user } = response.data;

      // Limpiar datos temporales
      localStorage.removeItem('tempToken');
      localStorage.removeItem('tempUser');

      // Iniciar sesión normal con nuevo token
      loginContext(access_token, user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return response.data;
    } catch (error) {
      // Si falla, el token temporal se conserva para que el usuario pueda reintentar
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  };

  const contextValue = {
    authLoading: loading,
    user,
    loginContext,
    logoutContext,
    logoutDueToInactivity,
    isAuthenticated: !!user,
    authLogin,
    changePasswordContext,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usarlo de forma súper cómoda en tus componentes
export const useAuth = () => useContext(AuthContext);