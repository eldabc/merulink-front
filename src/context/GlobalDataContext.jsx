import { createContext, useContext, useState, useEffect } from 'react';
import { getDepartments, getSubDepartments } from '../services/masterDataService';

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const loadDepartments = async () => {
    setGlobalLoading(true);
    try {
      
      const [depRes] = await Promise.all([
        getDepartments(),
      ]);

      setDepartments(depRes);
    } catch (error) {
      console.error("Error cargando maestros:", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  // *** Setters para mantener el estado global actualizado
  const addDepartmentGlobalState = (addDep) => {
    console.log("addDep", addDep)
    setDepartments(prevData => [addDep, ...prevData]);
  };

  const updateDepartmentGlobalState = (updatedDep) => {
    setDepartments(prevData => {
      const filteredData = prevData.filter(department => department.id !== updatedDep.id);
      return [updatedDep, ...filteredData];
    });
  };

  const addSubDepartmentGlobalState = (addSubDep) => {
    // console.log("addSubDep", addSubDep)
    setDepartments(prevDepartments => {
      return prevDepartments.map(dep => {
        // Buscar departamento dueño del nuevo subdepartamento
        if (Number(dep.id) === Number(addSubDep.departmentId)) {
          return {
            ...dep,
            subDepartments: [...dep.subDepartments, addSubDep.subDepartment]
          };
        }      
        return dep;
      });
    });
  };

  const updateSubDepartmentGlobalState = (updatedSubDep) => {
    setDepartments(prevDepartments => {
      return prevDepartments.map(dep => {
        // Validar ID del departamento
        if (Number(dep.id) === Number(updatedSubDep.departmentId)) {
          
          return {
            ...dep,
            subDepartments: dep.subDepartments.map(sub => {

              const targetId = updatedSubDep.subDepartment?.id;
              if (Number(sub.id) === Number(targetId)) {
                return updatedSubDep.subDepartment;
              }
              return sub;
            })
          };
        }
        return dep;
      });
    });
  };

  const addPositionGlobalState = (addPosition) => {

    setDepartments(prevDepartments => {
      return prevDepartments.map(dep => {
        // Buscar departamento dueño del nuevo cargo
        if (Number(dep.id) === Number(addPosition.departmentId)) {
          return {
            ...dep,
            positions: [...dep.positions, addPosition.position]
          };
        }      
        return dep;
      });
    });
  };

  const contextValue = {
    departments, 
    setDepartments,
    subDepartments, 
    globalLoading, 
    loadDepartments, 
    addDepartmentGlobalState,
    updateDepartmentGlobalState,
    addSubDepartmentGlobalState, 
    updateSubDepartmentGlobalState,
    addPositionGlobalState
  };

  return (
    <GlobalDataContext.Provider value={contextValue}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);