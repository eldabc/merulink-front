import React, { createContext, useContext, useState } from 'react';

const PositionContext = createContext();

// hook personalizado para usar el contexto
export const usePositions = () => {
  return useContext(PositionContext);
};

// Provider con la lógica y el estado
export const PositionProvider = ({ initialData, showNotification, children }) => {
    
  const [positionData, setPositionData] = useState(initialData);

  
  const contextValue = {
    positionData,
    setPositionData, 
  };

  return (
    <PositionContext.Provider value={contextValue}>
      {children}
    </PositionContext.Provider>
  );
};