import axios from 'axios';
import { ENV } from '../config/env';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotification } from "../context/NotificationContext";
import { useGlobalData } from './GlobalDataContext';

// import { mapRoleToBackend } from '../utils/mappers/roleMapper';

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

  const loadRoles = async () => {
    const response = await axios.get(`${ENV.API_BACK_URL}roles/permissions`);
    return response.data;
  };
  
  // useEffect(() => {
  //   loadRoles();
  // }, [loadRoles]);

  const allPermissions = async () => {
    try {
      const response = await axios.get(`${ENV.API_BACK_URL}permissions`);
      return response;
    } catch (error) {
      showNotification('Error al cargar permisos', error?.response?.data?.message, 'error');
    }
  };

  

  // *** Crear
  const createRole = async (formData) => {

    try {
    //   const isAddingSubDepartment = formData.subDepartmentName && formData.newSubDepartmentCode;
    //   const newRole = mapRoleToBackend(formData, isAddingSubDepartment); //formattedRole(formData);

    //   console.log("Creado", newRole);
    //   const response = await axios.post(`${ENV.API_BACK_URL}roles`, newRole);
    //   // console.log("response.data.data,", response.data.data,);

    //   setRoleData(prevData => {
    //     return [response.data.data, ...prevData]; 
    //   });

    //   const globalData = updateGlobalStage(response.data.data);
    //   console.log("globalData", globalData,departments);

    //   addRoleGlobalState(globalData, isAddingSubDepartment);

    //   showNotification(`Cargo ${newRole.name} creado con éxito`);
      
    //   return true;
    } catch (error) {
      console.log("error", error);
      showNotification('Error al crear cargo', error?.response?.data?.message, 'error');
      return false;
    }
  };

  // *** Actualizar
  const updateRole = async (formData) => {
    try {
    //   const roleId = formData.id;

    //   if (!roleId) {
    //     showNotification('Error:', 'No se encontró ID de cargo', 'error');
    //     return false;
    //   }

    //   const isAddingSubDepartment = formData.subDepartmentName && formData.newSubDepartmentCode;
    //   const updatedRole = mapRoleToBackend(formData); //formattedRole(formData);
    //   console.log("Actualizado:", updatedRole);
      
    //   const response = await axios.put(`${ENV.API_BACK_URL}roles/${roleId}`, updatedRole);
      
    //   setRoleData(prevData => {
    //     const filteredData = prevData.filter(role => role.id !== roleId);
    //     return [response.data.data, ...filteredData];
    //   });

    //   const globalData = updateGlobalStage(response.data.data);
    //   console.log("globalData update", globalData);

    //   updateRoleGlobalState(globalData, isAddingSubDepartment);

    //   showNotification(`Cargo ${formData.name} actualizado con éxito`); 
    //   return true;

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