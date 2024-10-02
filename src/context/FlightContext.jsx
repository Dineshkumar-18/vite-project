// FlightContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the Flight Context
const FlightContext = createContext();

// Create a provider component
export const FlightProvider = ({ children }) => {
    const [flightData, setFlightData] = useState({}); // This will hold your flight data

    return (
        <FlightContext.Provider value={{ flightData, setFlightData }}>
            {children}
        </FlightContext.Provider>
    );
};

// Custom hook for using the flight context
export const useFlightContext = () => {
    return useContext(FlightContext);
};
