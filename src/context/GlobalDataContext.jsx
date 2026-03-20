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
      console.log("contexto global departamentos: ", depRes);
      setDepartments(depRes);
    } catch (error) {
      console.error("Error cargando maestros:", error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const contextValue = {
    departments, subDepartments, globalLoading, loadDepartments
  };

  return (
    <GlobalDataContext.Provider value={contextValue}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);