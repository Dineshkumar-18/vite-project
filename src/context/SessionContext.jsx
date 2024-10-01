
import React, { createContext, useContext, useState} from 'react';


const SessionContext = createContext();


export const SessionProvider = ({ children }) => {
  
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [userType, setUserType] = useState('user'); // 'normal' or 'flightOwner'

  return (
    <SessionContext.Provider value={{ isSessionExpired, setIsSessionExpired, userType, setUserType }}>
      {children}  
    </SessionContext.Provider>
  );
};
export const useSession = () => useContext(SessionContext);