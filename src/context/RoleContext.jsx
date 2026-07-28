import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';

import { mapRoleToBackend } from '../utils/mappers/roleMapper';

const RoleContext = createContext();

export const useRoles = () => {
  return useContext(RoleContext);
};

// Provider con la lógica y estado
export const RoleProvider = ({ children }) => {

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const { departments, addRoleGlobalState, updateRoleGlobalState } = useGlobalData();

  const loadRoles = async (assignments = false) => {
    const response = await axios.get(`${ENV.API_BACK_URL}roles/permissions?getAssignments=${assignments}`);
    return response.data;
  };

  
  const allPermissions = async () => {
    try {
      const response = await axios.get(`${ENV.API_BACK_URL}permissions`);
      return response.data;
    } catch (error) {
      showNotification('Error al cargar permisos', error?.response?.data?.message, 'error');
    }
  };


  const getRole = async (id) => {
    try {

      const response = await axios.get(`${ENV.API_BACK_URL}roles/${id}`);
      // console.log("response.data.data,", response.data);
      return response.data.data;
      
    } catch (error) {
      console.log("error", error);
      showNotification('Error al crear cargo', error?.response?.data?.message, 'error');
      return false;
    }
  };

  // *** Crear
  const createRole = async (formData) => {
    try {

      const newRole = mapRoleToBackend(formData);

      console.log("Creado", newRole);
      const response = await axios.post(`${ENV.API_BACK_URL}roles`, newRole);
      // console.log("response.data.data,", response.data);
      showNotification(`Rol ${newRole.role_name} creado con éxito`);
      return true;
      
    } catch (error) {
      console.log("error", error);
      showNotification('Error al crear cargo', error?.response?.data?.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updateRole = async (formData) => {
    try {
      const roleId = formData.id;

      if (!roleId) {
        showNotification('Error:', 'No se encontró ID de Rol', 'error');
        return false;
      }

      const updatedRole = mapRoleToBackend(formData);
      console.log("Actualizado:", updatedRole);
      
      const response = await axios.put(`${ENV.API_BACK_URL}roles/${roleId}`, updatedRole);
      showNotification(`Rol ${updatedRole.role_name} actualizado con éxito`); 
      return true;

    } catch (error) {
      console.log("error:", error);
      showNotification('Error al actualizar:', error?.response?.data?.message, 'error');
      return false;
    }
  };

  // *** Eliminar
  const deleteRole = async (role) => {
    // try {
    //   await axios.delete(`${ENV.API_BACK_URL}roles/${role.id}`);

    //   setRoleData(prevData => {
    //     return prevData.filter(item => item.id !== role.id);
    //   });

    //   showNotification(`Cargo ${role.name} eliminado con éxito`);
    //   return true;
    // } catch (error) {
    //   showNotification('Error al eliminar Cargo', error?.response?.data?.message, 'error');
    //   return false;
    // }
  };

  // const updateGlobalStage = (roleData) => {
  //   return {
  //     id: roleData.id,
  //     code: roleData.code,
  //     name: roleData.name,
  //     department: { ...roleData.department },
  //     employees: [ 
  //       ...roleData.employees
  //     ],
  //     subDepartment: { ...roleData.subDepartment }
  //   };
  // };
  
  const contextValue = {
    loading,
    allPermissions,
    loadRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
    roleData,
    setRoleData, 
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};