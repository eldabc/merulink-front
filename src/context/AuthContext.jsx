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
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    const roles = localStorage.getItem('user_roles');
    const permissions = localStorage.getItem('user_permissions');
    const departmentId = localStorage.getItem('department_id');

    if (token && name) {
      // Rehidrata el estado global en memoria
      setUser({
        name,
        email,
        roles: roles ? JSON.parse(roles) : [],
        permissions: permissions ? JSON.parse(permissions) : [],
        department_id: departmentId ? Number(departmentId) : null
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
          // Redirigir al login
          setTimeout(() => {
            window.location.href = '/login';
          }, 300);
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
    console.log("userData", userData)
    isCleaningUp.current = false; // resetear flag al hacer login nuevo
    localStorage.setItem('token', token);
    localStorage.setItem('user_name', userData.name);
    localStorage.setItem('user_email', userData.email);
    localStorage.setItem('department_id', userData.departmentId);
    localStorage.setItem('user_roles', JSON.stringify(userData.roles));
    localStorage.setItem('user_permissions', JSON.stringify(userData.permissions));

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  // Cerrar sesión (manual o por inactividad)
  const logoutContext = async () => {
    try {
      await axios.post(`${ENV.API_BACK_URL}logout`);
    } catch (error) {
      // Si el token ya no es válido, el 401 se maneja con el interceptor y limpia igual
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
    const { access_token, user } = response.data;

    // Le pasas los datos limpios al contexto y él hace todo el trabajo sucio
    loginContext(access_token, user);
    // Configurar Axios de forma global para futuros requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return true;
  };

  const contextValue = {
    authLoading: loading,
    user,
    loginContext,
    logoutContext,
    logoutDueToInactivity,
    isAuthenticated: !!user,
    authLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usarlo de forma súper cómoda en tus componentes
export const useAuth = () => useContext(AuthContext);