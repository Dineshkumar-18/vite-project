import React, { createContext, useState, useContext } from 'react';

const FlightOwnerContext = createContext();

export const FlightOwnerProvider = ({ children }) => {
  const [flightOwner, setFlightOwner] = useState(null);

  const updateFlightOwner = (owner) => {
    setFlightOwner(owner);
  };

  return (
    <FlightOwnerContext.Provider value={{ flightOwner, updateFlightOwner }}>
      {children}
    </FlightOwnerContext.Provider>
  );
};

export const useFlightOwner = () => {
  const context = useContext(FlightOwnerContext);
  if (!context) {
    throw new Error('useFlightOwner must be used within a FlightOwnerProvider');
  }
  return context;
};
