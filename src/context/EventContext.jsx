import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

// hook personalizado para usar el contexto
export const useEvents = () => {
  return useContext(EventContext);
};

// Provider con la lógica y el estado
export const EventProvider = ({ initialData, showNotification, children }) => {
    
  const [eventData, setEventData] = useState(initialData);

  
  const contextValue = {
    eventData,
    setEventData, 
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};