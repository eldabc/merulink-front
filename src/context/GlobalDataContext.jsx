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

  // Departamento ***
  const addDepartmentGlobalState = (addDep) => {
    console.log("addDep", addDep)
    setDepartments(prevData => [addDep, ...prevData]);
  };

  // Departamento ***
  const updateDepartmentGlobalState = (updatedDep) => {
    setDepartments(prevData => {
      const filteredData = prevData.filter(department => department.id !== updatedDep.id);
      return [updatedDep, ...filteredData];
    });
  };

  
  // Sub-Departamento ***
  const addSubDepartmentGlobalState = (addSubDep) => {
    setDepartments(prevDepartments => {
      return prevDepartments.map(dep => {
        // Buscar departamento dueño del nuevo subdepartamento
        if (Number(dep.id) === Number(addSubDep.department.id)) {
          return {
            ...dep,
            subDepartments: [...dep.subDepartments, addSubDep.subDepartment]
          };
        }      
        return dep;
      });
    });
  };

  // Sub-Departamento ***
  const updateSubDepartmentGlobalState = (updatedSubDep) => {
    setDepartments(prevDepartments => {
      return prevDepartments.map(dep => {
        // Validar ID del departamento
        if (Number(dep.id) === Number(updatedSubDep.department.id)) {
          
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


  // Cargo ***
  const addPositionGlobalState = (addPosition, isAddingSubDepartment) => {

    if (isAddingSubDepartment) {
      addSubDepartmentGlobalState(addPosition);
    }

    setDepartments(prevDepartments => {
      return prevDepartments.map(dep => {
        // Buscar departamento dueño del nuevo cargo
        if (Number(dep.id) === Number(addPosition?.department.id)) {
          return {
            ...dep,
            positions: [...dep.positions, addPosition]
          };
        }      
        return dep;
      });
    });
  };

  
  // Cargo ***
  const updatePositionGlobalState = (updatedPosition, isAddingSubDepartment) => {

    if (isAddingSubDepartment) addSubDepartmentGlobalState(updatedPosition);

    setDepartments(prevDepartments => {
      return prevDepartments.map(dep => {
        // Validar ID del departamento
        if (Number(dep.id) === Number(updatedPosition.department.id)) {        
          return {
            ...dep,
            positions: dep.positions.map(pos => {
         
              const targetId = updatedPosition?.id;
              if (Number(pos.id) === Number(targetId)) {
                return updatedPosition;
              }
              return pos;
            })
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
    addPositionGlobalState,
    updatePositionGlobalState
  };

  return (
    <GlobalDataContext.Provider value={contextValue}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);