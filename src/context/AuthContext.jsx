import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ENV } from '../config/env';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar la app, verificamos si ya había una sesión guardada en LocalStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    const roles = localStorage.getItem('user_roles');
    const permissions = localStorage.getItem('user_permissions');

    if (token && name) {
      // Rehidratamos el estado global en memoria
      setUser({
        name,
        email,
        roles: roles ? JSON.parse(roles) : [],
        permissions: permissions ? JSON.parse(permissions) : []
      });

      // Configuramos axios con el token por defecto para todas las peticiones a Laragon
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión desde el componente Login
  const loginContext = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_name', userData.name);
    localStorage.setItem('user_email', userData.email);
    localStorage.setItem('user_roles', JSON.stringify(userData.roles));
    localStorage.setItem('user_permissions', JSON.stringify(userData.permissions));

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  // Función para cerrar sesión limpiando todo
  const logoutContext = () => {
    localStorage.clear(); // O remueves uno por uno con removeItem
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const authLogin = async (data) => {
    try {
      console.log("data", typeof data);

      const response = await axios.post(`${ENV.API_BACK_URL}login`, data);
      const { access_token, user } = response.data;

      // Le pasas los datos limpios al contexto y él hace todo el trabajo sucio
      loginContext(access_token, user);
      // Configurar Axios de forma global para futuros requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return true;

    } catch (error) {
      console.error("Error guardar datos", error);
      showNotification('Error al hacer login', error.response?.data?.message || error.message, 'error');
    }
  };

  const contextValue = {
    loading,
    setLoading,
    user, 
    loading, 
    loginContext, 
    logoutContext, 
    isAuthenticated: !!user,
    authLogin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usarlo de forma súper cómoda en tus componentes
export const useAuth = () => useContext(AuthContext);